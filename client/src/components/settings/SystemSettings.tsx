import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Form schema for system settings
const systemSettingsFormSchema = z.object({
  // AI Configuration
  maxModelsLoaded: z.coerce.number().min(1).max(10),
  aiContentQualityThreshold: z.coerce.number().min(0).max(100),
  enableAIContentGeneration: z.boolean().default(true),
  
  // Content Storage
  storageLocation: z.string().min(2),
  maxStorageUsage: z.coerce.number().min(1),
  enableAutoCleanup: z.boolean().default(true),
  
  // Scheduling
  maxConcurrentPosts: z.coerce.number().min(1).max(20),
  retryFailedPosts: z.boolean().default(true),
  maxPostRetries: z.coerce.number().min(0).max(10),
  
  // Notifications
  enableEmailNotifications: z.boolean().default(false),
  emailAddress: z.string().email().optional().or(z.literal('')),
  notifyOnPostSuccess: z.boolean().default(true),
  notifyOnPostFailure: z.boolean().default(true),
  
  // System
  enableSystemMetrics: z.boolean().default(true),
  systemLanguage: z.string().min(2),
  theme: z.string().min(4),
});

// Mock initial system settings
const mockInitialSettings = {
  // AI Configuration
  maxModelsLoaded: 5,
  aiContentQualityThreshold: 70,
  enableAIContentGeneration: true,
  
  // Content Storage
  storageLocation: "local",
  maxStorageUsage: 10,
  enableAutoCleanup: true,
  
  // Scheduling
  maxConcurrentPosts: 3,
  retryFailedPosts: true,
  maxPostRetries: 3,
  
  // Notifications
  enableEmailNotifications: false,
  emailAddress: "",
  notifyOnPostSuccess: true,
  notifyOnPostFailure: true,
  
  // System
  enableSystemMetrics: true,
  systemLanguage: "en",
  theme: "system",
};

export default function SystemSettings() {
  const { toast } = useToast();
  const [confirmFactoryResetOpen, setConfirmFactoryResetOpen] = useState(false);
  const [confirmDataClearOpen, setConfirmDataClearOpen] = useState(false);
  
  // System settings form
  const form = useForm<z.infer<typeof systemSettingsFormSchema>>({
    resolver: zodResolver(systemSettingsFormSchema),
    defaultValues: mockInitialSettings
  });

  const emailNotificationsEnabled = form.watch("enableEmailNotifications");

  // Handle form submission
  const onSubmit = (values: z.infer<typeof systemSettingsFormSchema>) => {
    // In a real implementation, this would be an API call
    console.log("Saving system settings:", values);
    
    toast({
      title: "Settings saved",
      description: "Your system settings have been saved successfully",
      variant: "default",
    });
  };

  // Handle factory reset
  const handleFactoryReset = () => {
    // In a real implementation, this would be an API call
    form.reset(mockInitialSettings);
    setConfirmFactoryResetOpen(false);
    
    toast({
      title: "Factory reset complete",
      description: "Your system settings have been reset to default values",
      variant: "default",
    });
  };

  // Handle clear content data
  const handleClearContentData = () => {
    // In a real implementation, this would be an API call
    setConfirmDataClearOpen(false);
    
    toast({
      title: "Content data cleared",
      description: "All content and related data has been cleared from storage",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* AI Configuration Section */}
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>Configure AI behavior for content generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="maxModelsLoaded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum AI Models Loaded</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of AI models that can be loaded in memory simultaneously
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aiContentQualityThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Quality Threshold ({field.value}%)</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum quality score required for generated content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableAIContentGeneration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Enable AI Content Generation</FormLabel>
                      <FormDescription>
                        Allow the system to automatically generate content using AI
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Content Storage Section */}
          <Card>
            <CardHeader>
              <CardTitle>Content Storage</CardTitle>
              <CardDescription>Configure how content is stored and managed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="storageLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select storage location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="cloud">Cloud Storage</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Local + Cloud)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Where content files will be stored
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxStorageUsage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Storage Usage (GB)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum amount of storage space to use for content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableAutoCleanup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Automatic Cleanup</FormLabel>
                      <FormDescription>
                        Automatically remove old content when storage limit is reached
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Scheduling Section */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduling</CardTitle>
              <CardDescription>Configure content scheduling behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="maxConcurrentPosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Concurrent Posts</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={20} {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of posts to publish simultaneously
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="retryFailedPosts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Retry Failed Posts</FormLabel>
                      <FormDescription>
                        Automatically retry posting if initial attempt fails
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxPostRetries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Retry Attempts</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={10} {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of retry attempts for failed posts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="enableEmailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Email Notifications</FormLabel>
                      <FormDescription>
                        Send email notifications for important events
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {emailNotificationsEnabled && (
                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="your-email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Where notification emails will be sent
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="notifyOnPostSuccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Notify on Success</FormLabel>
                        <FormDescription>
                          Send notification when posts succeed
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!emailNotificationsEnabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notifyOnPostFailure"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Notify on Failure</FormLabel>
                        <FormDescription>
                          Send notification when posts fail
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!emailNotificationsEnabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Section */}
          <Card>
            <CardHeader>
              <CardTitle>System</CardTitle>
              <CardDescription>General system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="enableSystemMetrics"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Enable System Metrics</FormLabel>
                      <FormDescription>
                        Collect and display system resource metrics
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="systemLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Language used throughout the system
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Visual theme for the application
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" className="w-full sm:w-auto">
                <span className="material-icons mr-2 text-sm">save</span>
                Save Settings
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => setConfirmFactoryResetOpen(true)}
              >
                <span className="material-icons mr-2 text-sm">restart_alt</span>
                Factory Reset
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full sm:w-auto text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                onClick={() => setConfirmDataClearOpen(true)}
              >
                <span className="material-icons mr-2 text-sm">delete_forever</span>
                Clear Content Data
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
      {/* Confirm Factory Reset Dialog */}
      <AlertDialog open={confirmFactoryResetOpen} onOpenChange={setConfirmFactoryResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Factory Reset</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all settings to their default values. Your content and platform data will not be affected. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFactoryReset}>
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Confirm Clear Content Data Dialog */}
      <AlertDialog open={confirmDataClearOpen} onOpenChange={setConfirmDataClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Content Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all content, scheduled posts, and content-related data. Platform settings and API keys will be preserved. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearContentData}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All Content Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}