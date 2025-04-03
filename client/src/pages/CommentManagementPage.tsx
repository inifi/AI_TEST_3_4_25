import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Placeholder structure for future API implementation
type Comment = {
  id: number;
  platformId: number;
  accountId: number;
  contentId: number;
  author: string;
  text: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'replied' | 'flagged';
  platform: string;
  platformIcon: string;
};

export default function CommentManagementPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Placeholder comments - this would be replaced with API data
  const placeholderComments: Comment[] = [
    {
      id: 1,
      platformId: 1,
      accountId: 1,
      contentId: 1,
      author: "TechEnthusiast42",
      text: "This is really helpful content! Can you do a follow-up on open-source AI voice tools specifically?",
      timestamp: "2023-08-12T14:30:00",
      status: 'pending',
      platform: 'YouTube',
      platformIcon: 'smart_display'
    },
    {
      id: 2,
      platformId: 3,
      accountId: 3,
      contentId: 3,
      author: "@AI_Dev_Sarah",
      text: "Great insights on zero-cost content pipelines. Would love to see more about optimizing for different platforms.",
      timestamp: "2023-08-13T09:15:00",
      status: 'pending',
      platform: 'Twitter',
      platformIcon: 'tag'
    },
    {
      id: 3,
      platformId: 2,
      accountId: 2,
      contentId: 2,
      author: "creative_coder",
      text: "The self-hosted AI approach is exactly what I've been looking for! Any plans to cover video generation tools?",
      timestamp: "2023-08-14T16:45:00",
      status: 'pending',
      platform: 'Instagram',
      platformIcon: 'photo_camera'
    }
  ];

  // Format the timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200">Approved</Badge>;
      case 'replied':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200">Replied</Badge>;
      case 'flagged':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200">Flagged</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Comment Management</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage and respond to comments across your social platforms
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button className="flex items-center">
                    <span className="material-icons mr-2 text-sm">auto_awesome</span>
                    Auto-Generate Responses
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Comment List Panel */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comments</CardTitle>
                      <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList>
                          <TabsTrigger value="pending">
                            <span className="flex items-center">
                              <span className="material-icons mr-1 text-sm">pending</span>
                              Pending
                              <span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
                                {placeholderComments.filter(c => c.status === 'pending').length}
                              </span>
                            </span>
                          </TabsTrigger>
                          <TabsTrigger value="replied">
                            <span className="flex items-center">
                              <span className="material-icons mr-1 text-sm">done</span>
                              Replied
                            </span>
                          </TabsTrigger>
                          <TabsTrigger value="flagged">
                            <span className="flex items-center">
                              <span className="material-icons mr-1 text-sm">flag</span>
                              Flagged
                            </span>
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </CardHeader>
                    <CardContent>
                      <TabsContent value="pending" className="mt-0">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {placeholderComments.length > 0 ? (
                            placeholderComments.map((comment) => (
                              <div 
                                key={comment.id}
                                className={`py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded ${selectedComment?.id === comment.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                onClick={() => setSelectedComment(comment)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-1">
                                      {getPlatformIcon(comment.platform, comment.platformIcon)}
                                    </div>
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{comment.author}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.timestamp)}</span>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{comment.text}</p>
                                    </div>
                                  </div>
                                  <div className="ml-2">
                                    {getStatusBadge(comment.status)}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10">
                              <span className="material-icons text-4xl text-gray-400 mb-2">comment</span>
                              <p className="text-gray-500 dark:text-gray-400">No pending comments</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="replied" className="mt-0">
                        <div className="text-center py-10">
                          <span className="material-icons text-4xl text-gray-400 mb-2">done_all</span>
                          <p className="text-gray-500 dark:text-gray-400">No replied comments</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="flagged" className="mt-0">
                        <div className="text-center py-10">
                          <span className="material-icons text-4xl text-gray-400 mb-2">flag</span>
                          <p className="text-gray-500 dark:text-gray-400">No flagged comments</p>
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Card>
                </div>

                {/* Comment Detail Panel */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response</CardTitle>
                      <CardDescription>
                        Manage the selected comment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedComment ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2">
                                <div className="flex-shrink-0">
                                  {getPlatformIcon(selectedComment.platform, selectedComment.platformIcon)}
                                </div>
                                <span className="text-sm font-medium">{selectedComment.author}</span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(selectedComment.timestamp)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm">{selectedComment.text}</p>
                          </div>

                          <div>
                            <label htmlFor="response" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Your Response
                            </label>
                            <Textarea 
                              id="response"
                              placeholder="Type your response here..."
                              rows={4}
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Button className="w-full flex items-center justify-center">
                              <span className="material-icons mr-2 text-sm">send</span>
                              Send Response
                            </Button>
                            <Button variant="outline" className="w-full flex items-center justify-center">
                              <span className="material-icons mr-2 text-sm">auto_awesome</span>
                              Generate AI Response
                            </Button>
                            <div className="flex space-x-2">
                              <Button variant="outline" className="flex-1 flex items-center justify-center text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800">
                                <span className="material-icons mr-2 text-sm">flag</span>
                                Flag
                              </Button>
                              <Button variant="outline" className="flex-1 flex items-center justify-center text-red-600 dark:text-red-400 border-red-300 dark:border-red-800">
                                <span className="material-icons mr-2 text-sm">delete</span>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <span className="material-icons text-4xl text-gray-400 mb-2">chat_bubble_outline</span>
                          <p className="text-gray-500 dark:text-gray-400">Select a comment to respond</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
