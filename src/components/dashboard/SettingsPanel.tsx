
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function SettingsPanel() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    avatar_url: ""
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    assignment_reminders: true,
    grade_notifications: true
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        avatar_url: profile.avatar_url || ""
      });
    }
  }, [profile]);

  const saveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", user.id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    }
    
    setLoading(false);
  };

  const changePassword = async () => {
    // This would typically open a password change dialog
    toast({
      title: "Password Change",
      description: "Password change functionality would be implemented here"
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={profileData.avatar_url}
                onChange={(e) => setProfileData(prev => ({ ...prev, avatar_url: e.target.value }))}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <Button onClick={saveProfile} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email_notifications">Email Notifications</Label>
              <Switch
                id="email_notifications"
                checked={notificationSettings.email_notifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, email_notifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push_notifications">Push Notifications</Label>
              <Switch
                id="push_notifications"
                checked={notificationSettings.push_notifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, push_notifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="assignment_reminders">Assignment Reminders</Label>
              <Switch
                id="assignment_reminders"
                checked={notificationSettings.assignment_reminders}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, assignment_reminders: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="grade_notifications">Grade Notifications</Label>
              <Switch
                id="grade_notifications"
                checked={notificationSettings.grade_notifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, grade_notifications: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <Button variant="outline" onClick={changePassword}>
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
