import { useQuery } from "@tanstack/react-query";

type QuickStat = {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
};

export default function QuickStats() {
  // Get scheduled posts count
  const { data: scheduledPosts, isLoading: loadingScheduled } = useQuery({
    queryKey: ['/api/scheduled-posts'],
  });

  // Get trending topics count
  const { data: trendingTopics, isLoading: loadingTrending } = useQuery({
    queryKey: ['/api/trending-topics'],
  });

  // Get content count
  const { data: content, isLoading: loadingContent } = useQuery({
    queryKey: ['/api/content'],
  });

  const quickStats: QuickStat[] = [
    {
      id: 'scheduled',
      title: 'Scheduled Content',
      value: loadingScheduled ? '...' : scheduledPosts?.length || 0,
      icon: 'calendar_today',
      iconColor: 'text-primary'
    },
    {
      id: 'trending',
      title: 'Trending Topics',
      value: loadingTrending ? '...' : `${trendingTopics?.length || 0} New`,
      icon: 'trending_up',
      iconColor: 'text-green-500'
    },
    {
      id: 'comments',
      title: 'Pending Comments',
      value: 24, // This would come from a real API in production
      icon: 'insert_comment',
      iconColor: 'text-blue-500'
    },
    {
      id: 'content',
      title: 'Content Created',
      value: loadingContent ? '...' : content?.length || 0,
      icon: 'dvr',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {quickStats.map((stat) => (
        <div key={stat.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className={`material-icons ${stat.iconColor}`}>{stat.icon}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.title}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
