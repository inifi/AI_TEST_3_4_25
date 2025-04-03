import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SystemStatus from "./SystemStatus";
import QuickStats from "./QuickStats";
import ConnectedPlatforms from "./ConnectedPlatforms";
import RecentContent from "./RecentContent";
import UpcomingPosts from "./UpcomingPosts";
import TrendingTopics from "./TrendingTopics";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCreateContent = () => {
    // Navigate to content creation page
    window.location.href = "/content-creation";
  };

  const handleRefreshData = () => {
    // Refresh all queries
    queryClient.invalidateQueries();
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={handleCreateContent}
                  >
                    <span className="material-icons mr-2 text-sm">add</span>
                    Create Content
                  </button>
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={handleRefreshData}
                  >
                    <span className="material-icons mr-2 text-sm">refresh</span>
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* System Status */}
              <SystemStatus />

              {/* Quick Stats */}
              <QuickStats />

              {/* Platform Accounts */}
              <ConnectedPlatforms />
              
              {/* Recent Content and Upcoming Posts */}
              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <RecentContent />
                <UpcomingPosts />
              </div>

              {/* Trending Topics */}
              <TrendingTopics />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
