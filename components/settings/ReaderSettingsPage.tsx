"use client";

import NextLink from "next/link";
import { Loader2, Mail, Newspaper, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useDigestPreferences } from "@/hooks/use-digest-preferences";
import { useDigestPreview } from "@/hooks/use-digest-preview";
import { useFollowedTopics } from "@/hooks/use-followed-topics";
import { useToast } from "@/hooks/use-toast";
import type { FollowTargetType } from "@/types/engagement";

function FollowedTopicList({
  type,
  items,
  isMutating,
  onUnfollow,
}: {
  type: FollowTargetType;
  items: Array<{ id: number; name: string; slug: string; article_count?: number }>;
  isMutating: boolean;
  onUnfollow: (type: FollowTargetType, itemId: number) => Promise<void>;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        No followed {type === "category" ? "categories" : "tags"} yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <NextLink
                href={type === "category" ? `/category/${item.slug}` : `/tag/${item.slug}`}
                className="truncate text-sm font-semibold hover:text-actionRed"
              >
                {item.name}
              </NextLink>
              {typeof item.article_count === "number" ? (
                <Badge variant="outline" className="rounded-full">
                  {item.article_count} articles
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {type === "category" ? "Category digest updates" : "Tag alerts and article notices"}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void onUnfollow(type, item.id)}
            disabled={isMutating}
          >
            <X className="h-4 w-4" />
            Unfollow
          </Button>
        </div>
      ))}
    </div>
  );
}

export function ReaderSettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const {
    preferences,
    isLoading: isPreferencesLoading,
    isSaving,
    error: preferencesError,
    refresh: refreshPreferences,
    updateLocal,
    save,
  } = useDigestPreferences({ enabled: isAuthenticated });
  const {
    preview: digestPreview,
    isLoading: isDigestLoading,
    error: digestPreviewError,
    refresh: refreshDigestPreview,
  } = useDigestPreview({
    enabled: isAuthenticated && !isPreferencesLoading && preferences.email_enabled,
    frequency: preferences.digest_frequency,
  });
  const {
    follows,
    isLoading: isFollowsLoading,
    isMutating,
    error: followsError,
    refresh: refreshFollows,
    unfollow,
  } = useFollowedTopics({ enabled: isAuthenticated });

  const handleSave = async () => {
    try {
      await save();
      await refreshDigestPreview();
      toast({
        title: "Preferences saved",
        description: "Your digest and alert preferences are now up to date.",
      });
    } catch {
      toast({
        title: "Unable to save preferences",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  const handleUnfollow = async (type: FollowTargetType, itemId: number) => {
    try {
      await unfollow(type, itemId);
      toast({
        title: "Follow updated",
        description: `The ${type} has been removed from your followed topics.`,
      });
    } catch {
      toast({
        title: "Unable to update follows",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <section className="container py-12">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="font-serif text-3xl">Reader Settings</CardTitle>
            <CardDescription>
              Sign in to manage digest emails, notification preferences, and followed topics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <NextLink href="/login?redirect=%2Fsettings">Sign in</NextLink>
            </Button>
            <Button asChild variant="outline">
              <NextLink href="/register">Create account</NextLink>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const isLoading = isPreferencesLoading || isFollowsLoading;
  const isSaveDisabled = isLoading || isSaving || Boolean(preferencesError);

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-actionRed">
            <Mail className="h-3.5 w-3.5" />
            Reader Settings
          </div>
          <div>
            <h1 className="font-serif text-4xl font-black tracking-tight md:text-5xl">
              Notifications and Digest Preferences
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
              Choose how Monochrome News Flash reaches you when followed topics publish new stories,
              premium access changes, or AI-assisted articles go live.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Digest delivery</CardTitle>
              <CardDescription>
                Control email digests and the alerts that feed your notification center.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="email-enabled">Email digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Send summaries of new stories from the topics you follow.
                  </p>
                </div>
                <Switch
                  id="email-enabled"
                  checked={preferences.email_enabled}
                  onCheckedChange={(checked) => updateLocal({ email_enabled: checked })}
                  disabled={isSaveDisabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="digest-frequency">Digest frequency</Label>
                <Select
                  value={preferences.digest_frequency}
                  onValueChange={(value) =>
                    updateLocal({ digest_frequency: value as "off" | "daily" | "weekly" })
                  }
                  disabled={isSaveDisabled || !preferences.email_enabled}
                >
                  <SelectTrigger id="digest-frequency">
                    <SelectValue placeholder="Choose a digest schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-4 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Delivery preview</p>
                  <p className="text-sm text-muted-foreground">
                    {preferences.email_enabled
                      ? `You will receive ${preferences.digest_frequency === "daily" ? "daily" : preferences.digest_frequency === "weekly" ? "weekly" : "manual-only"} updates by email.`
                      : "Email digests are currently disabled."}
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  {preferences.digest_frequency}
                </Badge>
              </div>

              {preferencesError ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  Could not load your current preferences. Retry before saving to avoid overwriting existing settings.
                  <Button
                    type="button"
                    variant="link"
                    className="ml-2 h-auto p-0 align-baseline text-destructive"
                    onClick={() => void refreshPreferences()}
                  >
                    Retry
                  </Button>
                </div>
              ) : null}

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={isSaveDisabled}
                  className="bg-actionRed text-white hover:bg-actionRed/90"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Digest preview</CardTitle>
              <CardDescription>
                A live summary of the stories currently captured from the categories and tags you follow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {digestPreviewError ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
                  <p className="font-semibold">Unable to load digest preview right now.</p>
                  <Button
                    type="button"
                    variant="link"
                    className="mt-2 h-auto p-0 text-destructive"
                    onClick={() => void refreshDigestPreview()}
                  >
                    Retry preview
                  </Button>
                </div>
              ) : isDigestLoading ? (
                <div className="flex items-center justify-center rounded-lg border border-dashed px-4 py-10 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building your preview...
                </div>
              ) : !preferences.email_enabled || preferences.digest_frequency === "off" ? (
                <div className="rounded-lg border border-dashed px-4 py-8 text-center">
                  <p className="font-semibold">Digest preview is paused</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Turn the digest back on to preview daily or weekly article bundles.
                  </p>
                </div>
              ) : digestPreview?.articles.length ? (
                <div className="space-y-3">
                  {digestPreview.articles.map((article) => (
                    <NextLink
                      key={article.id}
                      href={`/news/${article.id}`}
                      className="block rounded-lg border px-4 py-4 transition-colors hover:bg-muted/40"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                        <Newspaper className="h-3.5 w-3.5" />
                        <span>{article.category?.name ?? "News"}</span>
                        {article.is_premium ? (
                          <Badge variant="outline" className="rounded-full">Premium</Badge>
                        ) : null}
                      </div>
                      <p className="font-semibold">{article.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {article.author?.name ?? "Monochrome News Flash"}
                        {article.published_at ? ` · ${new Date(article.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}` : ""}
                      </p>
                    </NextLink>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed px-4 py-8 text-center">
                  <p className="font-semibold">No stories in the current digest window</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Follow more categories or tags and publish new stories to populate the digest.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Followed topics</CardTitle>
              <CardDescription>
                Manage the categories and tags that drive your alerts and digests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="categories" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>
                <TabsContent value="categories" className="space-y-4">
                  {followsError ? (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
                      <p className="font-semibold">Unable to load followed categories.</p>
                      <Button
                        type="button"
                        variant="link"
                        className="mt-2 h-auto p-0 text-destructive"
                        onClick={() => void refreshFollows()}
                      >
                        Retry follows
                      </Button>
                    </div>
                  ) : isFollowsLoading ? (
                    <div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                      Loading followed categories...
                    </div>
                  ) : (
                    <FollowedTopicList
                      type="category"
                      items={follows.categories}
                      isMutating={isMutating}
                      onUnfollow={handleUnfollow}
                    />
                  )}
                </TabsContent>
                <TabsContent value="tags" className="space-y-4">
                  {followsError ? (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
                      <p className="font-semibold">Unable to load followed tags.</p>
                      <Button
                        type="button"
                        variant="link"
                        className="mt-2 h-auto p-0 text-destructive"
                        onClick={() => void refreshFollows()}
                      >
                        Retry follows
                      </Button>
                    </div>
                  ) : isFollowsLoading ? (
                    <div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                      Loading followed tags...
                    </div>
                  ) : (
                    <FollowedTopicList
                      type="tag"
                      items={follows.tags}
                      isMutating={isMutating}
                      onUnfollow={handleUnfollow}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
