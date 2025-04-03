import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type SidebarItem = {
  name: string;
  icon: string;
  path: string;
};

type PlatformItem = {
  name: string;
  icon: string;
  iconColor: string;
  path: string;
};

const navigationItems: SidebarItem[] = [
  { name: "Dashboard", icon: "dashboard", path: "/" },
  { name: "Content Creation", icon: "video_library", path: "/content-creation" },
  { name: "Scheduler", icon: "schedule", path: "/scheduler" },
  { name: "Trend Analysis", icon: "trending_up", path: "/trend-analysis" },
  { name: "Comment Management", icon: "chat", path: "/comment-management" },
  { name: "Analytics", icon: "analytics", path: "/analytics" },
  { name: "Ad Campaigns", icon: "campaign", path: "/ad-campaigns" },
  { name: "Settings", icon: "settings", path: "/settings" },
];

const platformItems: PlatformItem[] = [
  { name: "YouTube", icon: "smart_display", iconColor: "text-red-500", path: "/platforms/youtube" },
  { name: "Instagram", icon: "photo_camera", iconColor: "text-purple-500", path: "/platforms/instagram" },
  { name: "Twitter", icon: "tag", iconColor: "text-blue-400", path: "/platforms/twitter" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [location] = useLocation();

  const sidebarClass = cn(
    "flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
    mobileOpen ? "block" : "hidden md:flex"
  );

  return (
    <div className={sidebarClass}>
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold text-primary">Creator AI</h1>
      </div>
      <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              onClick={mobileOpen ? onMobileClose : undefined}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                location === item.path 
                  ? "sidebar-item active text-primary bg-blue-50 dark:bg-blue-900/20" 
                  : "sidebar-item text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <span className={cn("material-icons mr-3", location === item.path ? "text-primary" : "text-gray-500")}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Platforms
          </h3>
          <div className="mt-2 space-y-1">
            {platformItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={mobileOpen ? onMobileClose : undefined}
                className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className={`material-icons mr-3 ${item.iconColor}`}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <button className="flex items-center w-full px-2 py-2 text-sm font-medium text-primary rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
              <span className="material-icons mr-3">add_circle</span>
              Add Platform
            </button>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300">
              <span className="material-icons text-sm">person</span>
            </div>
          </div>
          <div className="ml-3 w-full">
            <div className="text-sm font-medium">Local User</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Self-Hosted</div>
          </div>
          <Link href="/settings" className="ml-auto p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-icons text-gray-500 text-sm">settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
