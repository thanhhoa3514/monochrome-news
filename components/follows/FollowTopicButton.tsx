"use client";

import { useEffect, useMemo, useState } from "react";
import { BellPlus, Check, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { clientFollowService } from "@/lib/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type FollowTopicType = "category" | "tag";

interface FollowTopicButtonProps {
    topicType?: FollowTopicType;
    topicId?: number;
    topicName?: string;
    type?: FollowTopicType;
    itemId?: number;
    itemName?: string;
    initialIsFollowing?: boolean;
    className?: string;
}

export function FollowTopicButton({
    topicType,
    topicId,
    topicName,
    type,
    itemId,
    itemName,
    initialIsFollowing = false,
    className,
}: FollowTopicButtonProps) {
    const resolvedType = topicType ?? type;
    const resolvedTopicId = topicId ?? itemId;
    const resolvedTopicName = topicName ?? itemName ?? "this topic";
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();
    const [isPending, setIsPending] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    useEffect(() => {
        if (!resolvedType || resolvedTopicId == null) {
            return;
        }

        if (!isAuthenticated) {
            setIsFollowing(false);
            return;
        }

        let isCancelled = false;

        const loadStatus = async () => {
            try {
                const follows = await clientFollowService.list();
                if (isCancelled) {
                    return;
                }

                const nextIsFollowing = resolvedType === "category"
                    ? follows.categories.some((category) => category.id === resolvedTopicId)
                    : follows.tags.some((tag) => tag.id === resolvedTopicId);

                setIsFollowing(nextIsFollowing);
            } catch {
                if (!isCancelled) {
                    setIsFollowing(initialIsFollowing);
                }
            }
        };

        void loadStatus();

        return () => {
            isCancelled = true;
        };
    }, [initialIsFollowing, isAuthenticated, resolvedTopicId, resolvedType]);

    const label = useMemo(() => {
        return isFollowing ? "Following" : `Follow ${resolvedType ?? "topic"}`;
    }, [isFollowing, resolvedType]);

    const handleClick = async () => {
        if (isPending) {
            return;
        }

        if (!resolvedType || resolvedTopicId == null) {
            return;
        }

        if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
            return;
        }

        setIsPending(true);

        try {
            if (resolvedType === "category") {
                if (isFollowing) {
                    await clientFollowService.unfollowCategory(resolvedTopicId);
                } else {
                    await clientFollowService.followCategory(resolvedTopicId);
                }
            } else if (isFollowing) {
                await clientFollowService.unfollowTag(resolvedTopicId);
            } else {
                await clientFollowService.followTag(resolvedTopicId);
            }

            setIsFollowing((current) => !current);
            toast({
                title: isFollowing ? "Topic unfollowed" : "Topic followed",
                description: isFollowing
                    ? `You will stop receiving updates for ${resolvedTopicName}.`
                    : `You will now receive updates for ${resolvedTopicName}.`,
            });
        } catch {
            toast({
                title: "Unable to update follow state",
                description: "Please try again in a moment.",
                variant: "destructive",
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Button
            type="button"
            variant={isFollowing ? "secondary" : "outline"}
            className={cn("min-w-[150px] justify-center", className)}
            onClick={() => void handleClick()}
            disabled={isPending || !resolvedType || resolvedTopicId == null}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <Check className="h-4 w-4" />
            ) : (
                <BellPlus className="h-4 w-4" />
            )}
            {label}
        </Button>
    );
}
