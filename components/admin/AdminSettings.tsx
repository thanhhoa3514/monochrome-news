import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

const AdminSettings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [publishAsFeature, setPublishAsFeature] = useState(false);
    const [autoSave, setAutoSave] = useState(true);

    const handleSaveSettings = () => {
        toast({
            title: "Settings Saved",
            description: "Your settings have been saved successfully.",
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif">Settings</h2>
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-notifications">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email notifications when new articles are published
                                </p>
                            </div>
                            <Switch
                                id="email-notifications"
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="publish-feature">Publish as Feature</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically mark new articles as featured
                                </p>
                            </div>
                            <Switch
                                id="publish-feature"
                                checked={publishAsFeature}
                                onCheckedChange={setPublishAsFeature}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="auto-save">Auto-save Drafts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically save article drafts every 5 minutes
                                </p>
                            </div>
                            <Switch
                                id="auto-save"
                                checked={autoSave}
                                onCheckedChange={setAutoSave}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="font-medium mb-3">Site Appearance</h3>
                        <div className="flex items-center space-x-2">
                            <ThemeToggle />
                            <span className="text-sm">Toggle between light and dark mode</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="font-medium mb-3">User Permissions</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Control who has access to the admin dashboard and what they can do
                        </p>
                        <Button variant="outline" size="sm">
                            Manage Permissions
                        </Button>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button className="bg-actionRed hover:bg-actionRed-hover" onClick={handleSaveSettings}>
                            Save Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminSettings;
