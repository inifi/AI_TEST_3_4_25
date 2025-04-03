import { useQuery } from "@tanstack/react-query";
import { ScheduledPost } from "@shared/schema";
import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";

export default function UpcomingPosts() {
  const { data: upcomingPosts, isLoading, error } = useQuery({
    queryKey: ['/api/scheduled-posts/upcoming'],
  });

  const { data: platformAccounts } = useQuery({
    queryKey: ['/api/platform-accounts'],
  });

  const { data: platforms } = useQuery({
    queryKey: ['/api/platforms'],
  });

  const { data: contents } = useQuery({
    queryKey: ['/api/content'],
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3].map((i) => (
                <li key={i} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Upcoming Posts</h3>
          <div className="mt-2 text-sm text-red-500">
            Error loading upcoming posts. Please refresh.
          </div>
        </div>
      </div>
    );
  }

  // Get platform account details
  const getAccountDetails = (accountId: number) => {
    if (!platformAccounts) return null;
    const account = platformAccounts.find((a: any) => a.id === accountId);
    if (!account) return null;
    
    const platform = platforms?.find((p: any) => p.id === account.platformId);
    return { 
      account, 
      platform 
    };
  };

  // Get content details
  const getContentDetails = (contentId: number) => {
    if (!contents) return null;
    return contents.find((c: any) => c.id === contentId);
  };

  // Format scheduled time
  const formatScheduledTime = (scheduledTime: string) => {
    const date = new Date(scheduledTime);
    
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, "h:mm a")}`;
    } else {
      return `${format(date, "MMMM d, yyyy")} at ${format(date, "h:mm a")}`;
    }
  };

  // Get time remaining
  const getTimeRemaining = (scheduledTime: string) => {
    const date = new Date(scheduledTime);
    const now = new Date();
    
    if (date <= now) return "Now";
    
    const timeRemaining = formatDistanceToNow(date, { addSuffix: false });
    return timeRemaining;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        const hours = Math.floor((new Date().getTime() - new Date().getTime()) / (1000 * 60 * 60));
        if (hours < 12) {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
              {getTimeRemaining(new Date().toISOString())}
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Ready
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            {status}
          </span>
        );
    }
  };

  // Get platform icon
  const getPlatformIcon = (platformName: string | undefined) => {
    if (!platformName) return "public";
    
    switch (platformName.toLowerCase()) {
      case 'youtube':
        return "smart_display";
      case 'instagram':
        return "photo_camera";
      case 'twitter':
        return "tag";
      default:
        return "public";
    }
  };

  // Get platform icon color
  const getPlatformIconColor = (platformName: string | undefined) => {
    if (!platformName) return "text-gray-600 dark:text-gray-200";
    
    switch (platformName.toLowerCase()) {
      case 'youtube':
        return "text-red-600 dark:text-red-200";
      case 'instagram':
        return "text-purple-600 dark:text-purple-200";
      case 'twitter':
        return "text-blue-600 dark:text-blue-200";
      default:
        return "text-gray-600 dark:text-gray-200";
    }
  };

  // Get platform background color
  const getPlatformBgColor = (platformName: string | undefined) => {
    if (!platformName) return "bg-gray-100 dark:bg-gray-900";
    
    switch (platformName.toLowerCase()) {
      case 'youtube':
        return "bg-red-100 dark:bg-red-900";
      case 'instagram':
        return "bg-purple-100 dark:bg-purple-900";
      case 'twitter':
        return "bg-blue-100 dark:bg-blue-900";
      default:
        return "bg-gray-100 dark:bg-gray-900";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Upcoming Posts</h3>
        <a href="#" className="text-sm font-medium text-primary hover:text-blue-700">Manage Schedule</a>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingPosts && upcomingPosts.length > 0 ? (
              upcomingPosts.map((post: ScheduledPost) => {
                const accountDetails = getAccountDetails(post.platformAccountId);
                const contentDetails = getContentDetails(post.contentId);
                
                return (
                  <li key={post.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 rounded ${getPlatformBgColor(accountDetails?.platform?.name)} flex items-center justify-center ${getPlatformIconColor(accountDetails?.platform?.name)}`}>
                          <span className="material-icons">{getPlatformIcon(accountDetails?.platform?.name)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {contentDetails?.title || "Untitled Content"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {accountDetails?.platform?.name || "Unknown"} • {formatScheduledTime(post.scheduledTime)}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(post.status)}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="py-8 text-center">
                <div className="flex flex-col items-center">
                  <span className="material-icons text-3xl text-gray-400 mb-2">event_busy</span>
                  <p className="text-gray-500 dark:text-gray-400">No upcoming posts</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
