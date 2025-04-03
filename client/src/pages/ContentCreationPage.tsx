import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

const contentFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  contentType: z.string(),
  status: z.string().default("draft"),
  metadata: z.any().optional()
});

export default function ContentCreationPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: platformAccounts } = useQuery({
    queryKey: ['/api/platform-accounts'],
  });

  const { data: platforms } = useQuery({
    queryKey: ['/api/platforms'],
  });

  const form = useForm<z.infer<typeof contentFormSchema>>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      contentType: activeTab,
      status: "draft",
      metadata: {}
    }
  });

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("contentType", value);
  };

  const onSubmit = async (values: z.infer<typeof contentFormSchema>) => {
    try {
      setIsSubmitting(true);
      // Update content type from the active tab
      values.contentType = activeTab;
      
      await apiRequest("POST", "/api/content", values);
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      queryClient.invalidateQueries({ queryKey: ['/api/content/recent'] });
      
      // Show success state
      setSuccess(true);
      // Reset form
      form.reset({
        title: "",
        description: "",
        contentType: activeTab,
        status: "draft",
        metadata: {}
      });
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to create content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={handleMobileMenuClick}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
            <Sidebar mobileOpen={true} onMobileClose={handleMobileMenuClick} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header onMobileMenuClick={handleMobileMenuClick} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Content Creation</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Create content for your connected platforms
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href="/">
                    <Button variant="outline" className="flex items-center">
                      <span className="material-icons mr-2 text-sm">arrow_back</span>
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Create New Content</CardTitle>
                  <CardDescription>
                    Select a content type and fill in the details to create your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="text">
                        <span className="material-icons mr-2 text-sm">text_fields</span>
                        Text
                      </TabsTrigger>
                      <TabsTrigger value="image">
                        <span className="material-icons mr-2 text-sm">image</span>
                        Image
                      </TabsTrigger>
                      <TabsTrigger value="video">
                        <span className="material-icons mr-2 text-sm">videocam</span>
                        Video
                      </TabsTrigger>
                    </TabsList>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter content title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter content description" 
                                  rows={4}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <TabsContent value="text" className="space-y-6 mt-4">
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                            <h3 className="font-medium mb-2">Text Content Options</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Create text-based posts for Twitter, LinkedIn, or other text platforms.
                            </p>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="image" className="space-y-6 mt-4">
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                            <h3 className="font-medium mb-2">Image Content Options</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Create image posts for Instagram, Pinterest, or other image-based platforms.
                            </p>
                            <div className="mt-4 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center">
                              <span className="material-icons text-3xl text-gray-400 mb-2">cloud_upload</span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Drag and drop an image, or click to select
                              </p>
                              <Button variant="outline" size="sm" className="mt-2">
                                Upload Image
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="video" className="space-y-6 mt-4">
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                            <h3 className="font-medium mb-2">Video Content Options</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Create video content for YouTube, TikTok, or other video platforms.
                            </p>
                            <div className="mt-4 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center">
                              <span className="material-icons text-3xl text-gray-400 mb-2">video_library</span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Drag and drop a video, or click to select
                              </p>
                              <Button variant="outline" size="sm" className="mt-2">
                                Upload Video
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                          <h3 className="font-medium mb-4">Select Target Platforms</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {platforms && platformAccounts ? (
                              platformAccounts.map((account: any) => {
                                const platform = platforms.find((p: any) => p.id === account.platformId);
                                
                                return (
                                  <div 
                                    key={account.id}
                                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                  >
                                    <input 
                                      type="checkbox" 
                                      id={`platform-${account.id}`}
                                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <label 
                                      htmlFor={`platform-${account.id}`}
                                      className="ml-3 flex items-center cursor-pointer"
                                    >
                                      <span className={`material-icons mr-2 text-${platform?.name.toLowerCase()}-500`}>
                                        {platform?.icon}
                                      </span>
                                      <span>{account.name}</span>
                                    </label>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="col-span-3 text-center py-4">
                                <p className="text-gray-500 dark:text-gray-400">No platform accounts connected</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                            disabled={isSubmitting}
                          >
                            Reset
                          </Button>
                          
                          <div className="flex space-x-2">
                            <Button 
                              type="submit"
                              variant="outline"
                              onClick={() => form.setValue("status", "draft")}
                              disabled={isSubmitting}
                            >
                              Save as Draft
                            </Button>
                            
                            <Button 
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <span className="material-icons mr-2 animate-spin">refresh</span>
                                  Creating...
                                </>
                              ) : (
                                <>
                                  <span className="material-icons mr-2">check</span>
                                  Create Content
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {success && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md mt-4 flex items-center">
                            <span className="material-icons mr-2">check_circle</span>
                            Content created successfully!
                          </div>
                        )}
                      </form>
                    </Form>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
