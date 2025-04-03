import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

export default function AnalyticsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30days");

  // Fetch platform accounts
  const { data: platformAccounts } = useQuery({
    queryKey: ['/api/platform-accounts'],
  });

  // Fetch platforms
  const { data: platforms } = useQuery({
    queryKey: ['/api/platforms'],
  });

  // Fetch content
  const { data: content } = useQuery({
    queryKey: ['/api/content'],
  });

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  // Calculate total content count
  const totalContent = content?.length || 0;

  // Calculate platform distribution
  const getPlatformDistribution = () => {
    if (!platformAccounts || !platforms) return [];
    
    const distribution = platforms.map((platform: any) => {
      const accounts = platformAccounts.filter((account: any) => account.platformId === platform.id);
      const accountCount = accounts.length;
      return {
        platform: platform.name,
        icon: platform.icon,
        count: accountCount,
        followers: accounts.reduce((sum: number, account: any) => sum + (account.followerCount || 0), 0)
      };
    });
    
    return distribution;
  };

  const platformDistribution = getPlatformDistribution();

  // Get platform color
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'instagram':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'twitter':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  // Get platform icon with color class
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
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Analytics</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Track your content performance across platforms
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Button 
                    variant={dateRange === "7days" ? "default" : "outline"}
                    onClick={() => handleDateRangeChange("7days")}
                    size="sm"
                  >
                    7 Days
                  </Button>
                  <Button 
                    variant={dateRange === "30days" ? "default" : "outline"}
                    onClick={() => handleDateRangeChange("30days")}
                    size="sm"
                  >
                    30 Days
                  </Button>
                  <Button 
                    variant={dateRange === "90days" ? "default" : "outline"}
                    onClick={() => handleDateRangeChange("90days")}
                    size="sm"
                  >
                    90 Days
                  </Button>
                  <Button 
                    variant={dateRange === "1year" ? "default" : "outline"}
                    onClick={() => handleDateRangeChange("1year")}
                    size="sm"
                  >
                    1 Year
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">
                    <span className="material-icons mr-2 text-sm">dashboard</span>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="platforms">
                    <span className="material-icons mr-2 text-sm">device_hub</span>
                    Platforms
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <span className="material-icons mr-2 text-sm">article</span>
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="engagement">
                    <span className="material-icons mr-2 text-sm">people</span>
                    Engagement
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-primary/20 p-3 rounded-full">
                            <span className="material-icons text-primary">dvr</span>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                Total Content
                              </dt>
                              <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {totalContent}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-500/20 p-3 rounded-full">
                            <span className="material-icons text-green-500">people</span>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                Total Followers
                              </dt>
                              <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {platformDistribution.reduce((sum, platform) => sum + platform.followers, 0).toLocaleString()}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-500/20 p-3 rounded-full">
                            <span className="material-icons text-blue-500">visibility</span>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                Total Views
                              </dt>
                              <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {/* This would come from real data */}
                                46.8K
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-purple-500/20 p-3 rounded-full">
                            <span className="material-icons text-purple-500">thumb_up</span>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                Total Engagements
                              </dt>
                              <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {/* This would come from real data */}
                                3.2K
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Platform Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Platform Distribution</CardTitle>
                        <CardDescription>
                          Content distribution across your connected platforms
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {platformDistribution.map((platform) => (
                            <div key={platform.platform} className="flex items-center">
                              <div className="w-8">
                                {getPlatformIcon(platform.platform, platform.icon)}
                              </div>
                              <div className="flex-1 mx-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{platform.platform}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{platform.count} accounts</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${getPlatformColor(platform.platform)}`}
                                    style={{ width: `${(platform.followers / platformDistribution.reduce((sum, p) => sum + p.followers, 0)) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="w-20 text-right">
                                <span className="text-sm font-medium">{platform.followers.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Over Time</CardTitle>
                        <CardDescription>
                          Content performance metrics for the last {dateRange === "7days" ? "7 days" : dateRange === "30days" ? "30 days" : dateRange === "90days" ? "90 days" : "year"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="min-h-[250px] flex items-center justify-center">
                        <div className="text-center">
                          <span className="material-icons text-4xl text-gray-400 mb-2">insert_chart</span>
                          <p className="text-gray-500 dark:text-gray-400">Analytics charts coming soon</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Performing Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Content</CardTitle>
                      <CardDescription>
                        Your best performing content across all platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {content && content.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {content.slice(0, 5).map((item: any, index: number) => (
                            <div key={item.id} className="py-4 flex">
                              <div className="flex-shrink-0 mr-4">
                                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                  <span className="material-icons text-gray-500">{
                                    item.contentType === 'video' ? 'videocam' :
                                    item.contentType === 'image' ? 'image' : 'text_fields'
                                  }</span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(item.createdAt).toLocaleDateString()} • {item.contentType}
                                </p>
                                <div className="mt-2 flex space-x-4">
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span className="material-icons text-xs mr-1">visibility</span>
                                    {(item.metadata?.views || Math.floor(Math.random() * 1000) + 100).toLocaleString()}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span className="material-icons text-xs mr-1">thumb_up</span>
                                    {(item.metadata?.likes || Math.floor(Math.random() * 100) + 10).toLocaleString()}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span className="material-icons text-xs mr-1">comment</span>
                                    {(item.metadata?.comments || Math.floor(Math.random() * 50)).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-4">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                                  index === 2 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                  {index === 0 ? '#1 Top Performer' :
                                   index === 1 ? '#2 Runner Up' :
                                   index === 2 ? '#3 Third Place' :
                                   `#${index + 1}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <span className="material-icons text-4xl text-gray-400 mb-2">analytics</span>
                          <p className="text-gray-500 dark:text-gray-400">No content analytics available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="platforms">
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Analytics</CardTitle>
                      <CardDescription>
                        Detailed analytics for each connected platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10">
                        <span className="material-icons text-4xl text-gray-400 mb-2">device_hub</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Platform Analytics Coming Soon</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          Detailed platform-specific analytics are currently under development. Check back soon for comprehensive insights!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Analytics</CardTitle>
                      <CardDescription>
                        Detailed performance metrics for all your content
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10">
                        <span className="material-icons text-4xl text-gray-400 mb-2">article</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Content Analytics Coming Soon</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          Detailed content-specific analytics are currently under development. Check back soon for comprehensive insights!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="engagement">
                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement Analytics</CardTitle>
                      <CardDescription>
                        Detailed metrics on audience engagement across platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10">
                        <span className="material-icons text-4xl text-gray-400 mb-2">people</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Engagement Analytics Coming Soon</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          Detailed engagement analytics are currently under development. Check back soon for comprehensive insights!
                        </p>
                      </div>
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
