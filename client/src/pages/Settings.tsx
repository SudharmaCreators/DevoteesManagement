import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { ThemeSelector } from "@/components/Common/ThemeSelector";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download, 
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Lock,
  Globe,
  Moon,
  Sun,
  Monitor
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // User preferences query
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ["/api/user-preferences"],
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/user-preferences", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-preferences"] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSavePreferences = (newPreferences: any) => {
    updatePreferencesMutation.mutate(newPreferences);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data Management", icon: Database },
    { id: "system", label: "System", icon: SettingsIcon },
  ];

  if (preferencesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Settings" 
        subtitle="Manage your account and system preferences" 
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Settings Navigation */}
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-6 min-h-[500px]">
                {/* Sidebar */}
                <div className="md:col-span-1 border-r border-border p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            activeTab === tab.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden md:block">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Content */}
                <div className="md:col-span-5 p-6">
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Profile Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={user?.firstName || ""}
                              readOnly
                              className="bg-muted"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={user?.lastName || ""}
                              readOnly
                              className="bg-muted"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={user?.email || ""}
                              readOnly
                              className="bg-muted"
                            />
                          </div>
                          <div>
                            <Label htmlFor="role">Role</Label>
                            <div className="mt-2">
                              <Badge variant="secondary" className="capitalize">
                                {user?.role || "User"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                          Profile information is managed through your authentication provider and cannot be edited here.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "appearance" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Appearance Settings</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <Label className="text-base font-medium">Theme</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Choose from 8 premium themes to customize your experience
                            </p>
                            <ThemeSelector />
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-base font-medium">Display Mode</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Choose how the interface should appear
                            </p>
                            <Select defaultValue="auto">
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">
                                  <div className="flex items-center space-x-2">
                                    <Sun className="w-4 h-4" />
                                    <span>Light Mode</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                  <div className="flex items-center space-x-2">
                                    <Moon className="w-4 h-4" />
                                    <span>Dark Mode</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="auto">
                                  <div className="flex items-center space-x-2">
                                    <Monitor className="w-4 h-4" />
                                    <span>System Preference</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-base font-medium">Language</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Select your preferred language
                            </p>
                            <Select defaultValue="en">
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                                <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">New Devotee Registration</Label>
                              <p className="text-sm text-muted-foreground">Get notified when new devotees join</p>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">Event Reminders</Label>
                              <p className="text-sm text-muted-foreground">Reminders for upcoming events</p>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">Donation Alerts</Label>
                              <p className="text-sm text-muted-foreground">Get notified about new donations</p>
                            </div>
                            <Switch />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">Birthday Reminders</Label>
                              <p className="text-sm text-muted-foreground">Reminders for devotee birthdays</p>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">System Maintenance</Label>
                              <p className="text-sm text-muted-foreground">Important system updates and maintenance</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <Label className="text-base font-medium">Authentication</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Your account is secured through Replit authentication
                            </p>
                            <Button variant="outline" disabled>
                              <Lock className="w-4 h-4 mr-2" />
                              Managed by Replit
                            </Button>
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-base font-medium">Session Management</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Manage your active sessions
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div>
                                  <p className="font-medium">Current Session</p>
                                  <p className="text-sm text-muted-foreground">Active now</p>
                                </div>
                                <Badge variant="outline">Active</Badge>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-base font-medium">Access Control</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Configure role-based access permissions
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 border border-border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">Administrator</span>
                                  <Badge>Full Access</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Complete system access</p>
                              </div>
                              <div className="p-3 border border-border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">Manager</span>
                                  <Badge variant="secondary">Limited</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Manage data and users</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "data" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <Label className="text-base font-medium">Export Data</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Download your organization's data in various formats
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export Devotees (CSV)
                              </Button>
                              <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export Attendance (Excel)
                              </Button>
                              <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export Donations (PDF)
                              </Button>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-base font-medium">Import Data</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Import data from external sources
                            </p>
                            <Button variant="outline">
                              <Upload className="w-4 h-4 mr-2" />
                              Import from Excel/CSV
                            </Button>
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-base font-medium">Database Backup</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Create and manage database backups
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Create Backup
                              </Button>
                              <Button variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Restore Backup
                              </Button>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-base font-medium text-destructive">Danger Zone</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Irreversible and destructive actions
                            </p>
                            <Button variant="destructive" disabled>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete All Data
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "system" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">System Information</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <Label className="text-base font-medium">Application Info</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              <div className="p-3 border border-border rounded-lg">
                                <p className="font-medium">Version</p>
                                <p className="text-sm text-muted-foreground">1.0.0</p>
                              </div>
                              <div className="p-3 border border-border rounded-lg">
                                <p className="font-medium">Environment</p>
                                <p className="text-sm text-muted-foreground">Production</p>
                              </div>
                              <div className="p-3 border border-border rounded-lg">
                                <p className="font-medium">Database</p>
                                <p className="text-sm text-muted-foreground">PostgreSQL</p>
                              </div>
                              <div className="p-3 border border-border rounded-lg">
                                <p className="font-medium">Hosting</p>
                                <p className="text-sm text-muted-foreground">Replit</p>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-base font-medium">Performance</Label>
                            <div className="space-y-3 mt-3">
                              <div className="flex items-center justify-between">
                                <span>Database Status</span>
                                <Badge className="bg-green-100 text-green-800">Connected</Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>API Response Time</span>
                                <span className="text-sm text-muted-foreground">~150ms</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Uptime</span>
                                <span className="text-sm text-muted-foreground">99.9%</span>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-base font-medium">Support</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                              Get help and report issues
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline">
                                <Globe className="w-4 h-4 mr-2" />
                                Documentation
                              </Button>
                              <Button variant="outline">
                                <Bell className="w-4 h-4 mr-2" />
                                Report Issue
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-border">
                    <Button
                      onClick={() => handleSavePreferences(preferences)}
                      disabled={updatePreferencesMutation.isPending}
                    >
                      {updatePreferencesMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
