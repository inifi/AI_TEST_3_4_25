import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import { format } from "date-fns";

export default function RecentContent() {
  const { data: recentContent, isLoading, error } = useQuery({
    queryKey: ['/api/content/recent'],
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
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
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
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Recent Content</h3>
          <div className="mt-2 text-sm text-red-500">
            Error loading recent content. Please refresh.
          </div>
        </div>
      </div>
    );
  }

  // Format relative time
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return format(new Date(date), 'MMM d, yyyy');
  };

  // Get icon for content type
  const getContentTypeIcon = (type: string): string => {
    switch (type) {
      case 'video':
        return 'smart_display';
      case 'image':
        return 'photo_camera';
      case 'text':
        return 'tag';
      default:
        return 'description';
    }
  };

  // Get platform name from content
  const getPlatformName = (content: Content): string => {
    const metadata = content.metadata as any;
    if (metadata?.platform) return metadata.platform;
    
    switch (content.contentType) {
      case 'video':
        return 'YouTube';
      case 'image':
        return 'Instagram';
      case 'text':
        return 'Twitter';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Recent Content</h3>
        <a href="#" className="text-sm font-medium text-primary hover:text-blue-700">View all</a>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
            {recentContent && recentContent.map((content: Content) => {
              const metadata = content.metadata as any;
              return (
                <li key={content.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {content.thumbnailPath ? (
                        <div className="h-12 w-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                          <span className="material-icons">{getContentTypeIcon(content.contentType)}</span>
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                          <span className="material-icons">{getContentTypeIcon(content.contentType)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {content.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {getPlatformName(content)} • 
                        {metadata?.views ? ` ${metadata.views} views •` : ''}
                        {metadata?.likes ? ` ${metadata.likes} likes •` : ''}
                        {metadata?.retweets ? ` ${metadata.retweets} retweets •` : ''}
                        {` ${getRelativeTime(new Date(content.createdAt))}`}
                      </p>
                    </div>
                    <div>
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <span className="material-icons text-sm mr-1">content_copy</span>
                        Repurpose
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
            
            {recentContent && recentContent.length === 0 && (
              <li className="py-8 text-center">
                <div className="flex flex-col items-center">
                  <span className="material-icons text-3xl text-gray-400 mb-2">folder_open</span>
                  <p className="text-gray-500 dark:text-gray-400">No content created yet</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
