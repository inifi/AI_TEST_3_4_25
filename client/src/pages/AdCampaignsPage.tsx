import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

// Campaign form schema
const campaignFormSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters"),
  platform: z.string().min(1, "Platform is required"),
  objective: z.string().min(1, "Objective is required"),
  budget: z.coerce.number().min(1, "Budget must be at least 1"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().optional(),
  targetAudience: z.string().optional()
});

export default function AdCampaignsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fetch platforms
  const { data: platforms } = useQuery({
    queryKey: ['/api/platforms'],
  });

  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "",
      platform: "",
      objective: "",
      budget: 100,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      description: "",
      targetAudience: ""
    }
  });

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const onSubmit = (values: z.infer<typeof campaignFormSchema>) => {
    console.log(values);
    // In a real app, this would call an API to create the campaign
    setCreateModalOpen(false);
    form.reset();
  };

  // Placeholder campaign data
  const activeCampaigns = [
    {
      id: 1,
      name: "Summer Tech Promo",
      platform: "YouTube",
      platformIcon: "smart_display",
      objective: "Brand Awareness",
      budget: 500,
      spent: 125,
      startDate: "2023-08-01",
      endDate: "2023-08-31",
      status: "active"
    },
    {
      id: 2,
      name: "Product Launch",
      platform: "Instagram",
      platformIcon: "photo_camera",
      objective: "Conversions",
      budget: 1000,
      spent: 350,
      startDate: "2023-07-15",
      endDate: "2023-09-15",
      status: "active"
    }
  ];

  const pastCampaigns = [
    {
      id: 3,
      name: "Spring Collection",
      platform: "Instagram",
      platformIcon: "photo_camera",
      objective: "Engagement",
      budget: 750,
      spent: 750,
      startDate: "2023-03-01",
      endDate: "2023-05-31",
      status: "completed"
    },
    {
      id: 4,
      name: "Holiday Special",
      platform: "Twitter",
      platformIcon: "tag",
      objective: "Traffic",
      budget: 300,
      spent: 300,
      startDate: "2022-12-01",
      endDate: "2022-12-31",
      status: "completed"
    }
  ];

  // Get platform icon with color
  const getPlatformIcon = (platform: string, icon: string) => {
    let colorClass = "text-gray-500";
    
    switch (platform.toLowerCase()) {
      case 'youtube':
        colorClass = "text-red-500";
        break;
      case 'instagram':
        colorClass = "text-purple-500";
        break;
      case 'twitter':
        colorClass = "text-blue-400";
        break;
    }
    
    return <span className={`material-icons ${colorClass}`}>{icon}</span>;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Active</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">Completed</span>;
      case 'paused':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">Paused</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">{status}</span>;
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
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Ad Campaigns</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Create and manage advertising campaigns across platforms
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button 
                    className="flex items-center"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <span className="material-icons mr-2 text-sm">add</span>
                    Create Campaign
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-6">
                  <TabsTrigger value="active">
                    <span className="flex items-center">
                      <span className="material-icons mr-1 text-sm">campaign</span>
                      Active
                      <span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
                        {activeCampaigns.length}
                      </span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    <span className="flex items-center">
                      <span className="material-icons mr-1 text-sm">history</span>
                      Past
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <span className="flex items-center">
                      <span className="material-icons mr-1 text-sm">analytics</span>
                      Analytics
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  {activeCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {activeCampaigns.map((campaign) => (
                        <Card key={campaign.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{campaign.name}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                  {getPlatformIcon(campaign.platform, campaign.platformIcon)}
                                  <span className="ml-1">{campaign.platform}</span>
                                </CardDescription>
                              </div>
                              <div>
                                {getStatusBadge(campaign.status)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Objective:</span>
                                <span className="font-medium">{campaign.objective}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                                <span className="font-medium">${campaign.budget.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Spent:</span>
                                <span className="font-medium">${campaign.spent.toLocaleString()} ({Math.round((campaign.spent / campaign.budget) * 100)}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                                <span className="font-medium">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                              <span className="material-icons mr-1 text-sm">edit</span>
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <span className="material-icons mr-1 text-sm">pause</span>
                              Pause
                            </Button>
                            <Button variant="default" size="sm">
                              <span className="material-icons mr-1 text-sm">analytics</span>
                              View Results
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <span className="material-icons text-4xl text-gray-400 mb-2">campaign</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Active Campaigns</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
                          You don't have any active ad campaigns. Create a new campaign to start promoting your content.
                        </p>
                        <Button 
                          onClick={() => setCreateModalOpen(true)}
                          className="mt-2"
                        >
                          <span className="material-icons mr-1 text-sm">add</span>
                          Create Your First Campaign
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="past">
                  {pastCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {pastCampaigns.map((campaign) => (
                        <Card key={campaign.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{campaign.name}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                  {getPlatformIcon(campaign.platform, campaign.platformIcon)}
                                  <span className="ml-1">{campaign.platform}</span>
                                </CardDescription>
                              </div>
                              <div>
                                {getStatusBadge(campaign.status)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Objective:</span>
                                <span className="font-medium">{campaign.objective}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                                <span className="font-medium">${campaign.budget.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Spent:</span>
                                <span className="font-medium">${campaign.spent.toLocaleString()} ({Math.round((campaign.spent / campaign.budget) * 100)}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                                <span className="font-medium">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                              <span className="material-icons mr-1 text-sm">content_copy</span>
                              Duplicate
                            </Button>
                            <Button variant="default" size="sm">
                              <span className="material-icons mr-1 text-sm">analytics</span>
                              View Results
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <span className="material-icons text-4xl text-gray-400 mb-2">history</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Past Campaigns</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                          You don't have any completed campaigns yet. Your finished campaigns will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Analytics</CardTitle>
                      <CardDescription>
                        Performance metrics for all your advertising campaigns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10">
                        <span className="material-icons text-4xl text-gray-400 mb-2">analytics</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Analytics Coming Soon</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          Detailed campaign analytics are currently under development. Check back soon for comprehensive insights!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Create Campaign Modal */}
              {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                  <Card className="w-full max-w-2xl">
                    <CardHeader>
                      <CardTitle>Create New Campaign</CardTitle>
                      <CardDescription>
                        Set up an advertising campaign across social platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Campaign Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Summer Promotion 2023" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="platform"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Platform</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a platform" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {platforms ? (
                                        platforms.map((platform: any) => (
                                          <SelectItem key={platform.id} value={platform.name}>
                                            <div className="flex items-center">
                                              <span className={`material-icons mr-2 text-sm ${
                                                platform.name === 'YouTube' ? 'text-red-500' : 
                                                platform.name === 'Instagram' ? 'text-purple-500' : 
                                                platform.name === 'Twitter' ? 'text-blue-400' : ''
                                              }`}>
                                                {platform.icon}
                                              </span>
                                              {platform.name}
                                            </div>
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <>
                                          <SelectItem value="YouTube">YouTube</SelectItem>
                                          <SelectItem value="Instagram">Instagram</SelectItem>
                                          <SelectItem value="Twitter">Twitter</SelectItem>
                                        </>
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="objective"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Campaign Objective</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an objective" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                                      <SelectItem value="Traffic">Traffic</SelectItem>
                                      <SelectItem value="Engagement">Engagement</SelectItem>
                                      <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                                      <SelectItem value="Conversions">Conversions</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                              control={form.control}
                              name="budget"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Budget ($)</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="1" placeholder="100" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Campaign Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter campaign description" 
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
                            name="targetAudience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Target Audience</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your target audience" 
                                    rows={3}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setCreateModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={form.handleSubmit(onSubmit)}
                      >
                        Create Campaign
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
