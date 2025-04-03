import { useQuery } from "@tanstack/react-query";
import { TrendingTopic } from "@shared/schema";

export default function TrendingTopics() {
  const { data: trendingTopics, isLoading, error } = useQuery({
    queryKey: ['/api/trending-topics/top'],
  });

  if (isLoading) {
    return (
      <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Trending Topics</h3>
          <div className="mt-2 text-sm text-red-500">
            Error loading trending topics. Please refresh.
          </div>
        </div>
      </div>
    );
  }

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
    // In a real app, this would trigger a trends refresh
    // For now, we'll just refetch the current data
    const queryKey = ['/api/trending-topics/top'];
    // Invalidate the cache and refetch
    queryClient.invalidateQueries({ queryKey });
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Trending Topics</h3>
        <button 
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={handleRefresh}
        >
          <span className="material-icons mr-1 text-sm">refresh</span>
          Refresh
        </button>
      </div>
      <div className="px-4 py-5 sm:p-6">
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
                <button className="mt-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary bg-blue-50 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Create Content
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <span className="material-icons text-4xl text-gray-400 mb-2">trending_flat</span>
              <p className="text-gray-500 dark:text-gray-400">No trending topics available</p>
              <button 
                className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none"
                onClick={handleRefresh}
              >
                <span className="material-icons mr-1">refresh</span>
                Discover Trends
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
