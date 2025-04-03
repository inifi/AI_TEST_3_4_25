import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SchedulerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Content Scheduler</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Schedule and manage your content across platforms
              </p>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Upcoming Content</CardTitle>
                      <Button size="sm">
                        <span className="material-icons mr-2 text-sm">add</span>
                        Schedule New
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <span className="material-icons text-4xl text-gray-400 mb-2">calendar_today</span>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Scheduler Coming Soon</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        The content scheduler is currently under development. Check back soon for updates!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
