
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, Save, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function SettingsPanel() {
  const { user, profile, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    username: "",
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
        username: profile.username || "",
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

  const getDisplayName = () => {
    if (profileData.first_name && profileData.last_name) {
      return `${profileData.first_name} ${profileData.last_name}`;
    }
    if (profileData.username) {
      return profileData.username;
    }
    return user?.email?.split('@')[0] || "User";
  };

  const getInitials = () => {
    if (profileData.first_name && profileData.last_name) {
      return `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase();
    }
    if (profileData.username) {
      return profileData.username.slice(0, 2).toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="grid gap-6">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.avatar_url} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{getDisplayName()}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-md capitalize">
                    {role || "User"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Member since {new Date(user?.created_at || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Choose a unique username"
              />
            </div>
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

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email Address</Label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div>
                <Label>User ID</Label>
                <Input value={user?.id || ""} disabled className="font-mono text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Role</Label>
                <Input value={role || "User"} disabled className="capitalize" />
              </div>
              <div>
                <Label>Email Confirmed</Label>
                <Input 
                  value={user?.email_confirmed_at ? "Yes" : "No"} 
                  disabled 
                  className={user?.email_confirmed_at ? "text-green-600" : "text-orange-600"}
                />
              </div>
            </div>
            <Button variant="outline" onClick={changePassword}>
              Change Password
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
      </div>
    </div>
  );
}
