import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingTopic } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const trendFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  trendScore: z.coerce.number().min(1).max(100)
});

export default function TrendAnalysisPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("trending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: trendingTopics, isLoading } = useQuery({
    queryKey: ['/api/trending-topics'],
  });

  const form = useForm<z.infer<typeof trendFormSchema>>({
    resolver: zodResolver(trendFormSchema),
    defaultValues: {
      topic: "",
      category: "",
      description: "",
      trendScore: 50
    }
  });

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const onSubmit = async (values: z.infer<typeof trendFormSchema>) => {
    try {
      setIsSubmitting(true);
      await apiRequest("POST", "/api/trending-topics", values);
      queryClient.invalidateQueries({ queryKey: ['/api/trending-topics'] });
      
      // Show success state
      setSuccess(true);
      // Reset form
      form.reset();
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to add trend:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get category badge color
  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tech':
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case 'productivity':
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case 'ai':
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const handleRefresh = () => {
    // Invalidate the cache and refetch
    queryClient.invalidateQueries({ queryKey: ['/api/trending-topics'] });
  };

  const handleAddManualTrend = () => {
    setActiveTab("add");
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
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Trend Analysis</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Discover and analyze trending topics for your content
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <Button 
                    onClick={handleRefresh}
                    variant="outline"
                    className="flex items-center"
                  >
                    <span className="material-icons mr-2 text-sm">refresh</span>
                    Refresh Trends
                  </Button>
                  <Button 
                    onClick={handleAddManualTrend}
                    className="flex items-center"
                  >
                    <span className="material-icons mr-2 text-sm">add</span>
                    Add Manual Trend
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-6">
                  <TabsTrigger value="trending">
                    <span className="material-icons mr-2 text-sm">trending_up</span>
                    Trending Topics
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <span className="material-icons mr-2 text-sm">analytics</span>
                    Trend Analytics
                  </TabsTrigger>
                  <TabsTrigger value="add">
                    <span className="material-icons mr-2 text-sm">add_circle</span>
                    Add Manual Trend
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="trending">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Trending Topics</CardTitle>
                      <CardDescription>
                        Discover what's trending to create relevant content for your audience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {trendingTopics && trendingTopics.length > 0 ? (
                            trendingTopics.map((topic: TrendingTopic) => (
                              <div key={topic.id} className="relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <div className="flex items-center justify-between">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(topic.category)}`}>
                                    {topic.category}
                                  </span>
                                  <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                                    <span className="material-icons text-sm mr-1">trending_up</span>
                                    {topic.trendScore}%
                                  </span>
                                </div>
                                <h4 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{topic.topic}</h4>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{topic.description}</p>
                                <Button className="mt-3" size="sm" variant="outline">
                                  Create Content
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-3 text-center py-10">
                              <span className="material-icons text-4xl text-gray-400 mb-2">trending_flat</span>
                              <p className="text-gray-500 dark:text-gray-400">No trending topics available</p>
                              <Button 
                                className="mt-4"
                                onClick={handleRefresh}
                              >
                                <span className="material-icons mr-1">refresh</span>
                                Discover Trends
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trend Analytics</CardTitle>
                      <CardDescription>
                        Analyze trend data across different platforms and categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10">
                        <span className="material-icons text-4xl text-gray-400 mb-2">insert_chart</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Analytics Coming Soon</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          Advanced trend analytics are currently under development. Check back soon for detailed trend insights!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="add">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Manual Trend</CardTitle>
                      <CardDescription>
                        Add your own trend topics to track and create content for
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trend Topic</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter trend topic" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                  <select
                                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    {...field}
                                  >
                                    <option value="">Select a category</option>
                                    <option value="Tech">Tech</option>
                                    <option value="Productivity">Productivity</option>
                                    <option value="AI">AI</option>
                                    <option value="Business">Business</option>
                                    <option value="Health">Health</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                  </select>
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
                                    placeholder="Enter trend description" 
                                    rows={3}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="trendScore"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trend Score (1-100)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number"
                                    min="1"
                                    max="100"
                                    placeholder="50"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button 
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <span className="material-icons mr-2 animate-spin">refresh</span>
                                  Adding...
                                </>
                              ) : (
                                <>
                                  <span className="material-icons mr-2">add_circle</span>
                                  Add Trend
                                </>
                              )}
                            </Button>
                          </div>
                          
                          {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md mt-4 flex items-center">
                              <span className="material-icons mr-2">check_circle</span>
                              Trend added successfully!
                            </div>
                          )}
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
