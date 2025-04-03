import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPlatformAccountSchema, Platform, PlatformAccount } from "@shared/schema";

export default function ConnectedPlatforms() {
  const [open, setOpen] = useState(false);
  const { data: platforms, isLoading: loadingPlatforms } = useQuery({
    queryKey: ['/api/platforms'],
  });

  const { data: accounts, isLoading: loadingAccounts } = useQuery({
    queryKey: ['/api/platform-accounts'],
  });

  const formSchema = z.object({
    platformId: z.coerce.number().min(1, "Please select a platform"),
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    followerCount: z.coerce.number().optional(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformId: 0,
      name: "",
      username: "",
      followerCount: 0
    }
  });

  const addAccount = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiRequest("POST", "/api/platform-accounts", values);
      queryClient.invalidateQueries({ queryKey: ['/api/platform-accounts'] });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add account:", error);
    }
  };

  // Loading state
  if (loadingPlatforms || loadingAccounts) {
    return (
      <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg animate-pulse">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
        </div>
        <div className="px-4 py-4 sm:p-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Platform icon mapping
  const getIconColor = (platformName: string) => {
    switch (platformName.toLowerCase()) {
      case 'youtube':
        return 'text-red-600';
      case 'instagram':
        return 'text-purple-600';
      case 'twitter':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Connected Platforms</h3>
        <button 
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={() => setOpen(true)}
        >
          <span className="material-icons mr-1 text-sm">add</span>
          Add Account
        </button>
      </div>
      
      <div className="px-4 py-4 sm:p-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {accounts && accounts.length > 0 ? (
          accounts.map((account: PlatformAccount) => {
            const platform = platforms?.find((p: Platform) => p.id === account.platformId);
            return (
              <div key={account.id} className="relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full bg-${platform?.name.toLowerCase()}-100 dark:bg-${platform?.name.toLowerCase()}-900 flex items-center justify-center platform-icon`}>
                    <span className={`material-icons ${getIconColor(platform?.name || '')}`}>{platform?.icon}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <a href="#" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true"></span>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{account.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {platform?.name} • {account.followerCount?.toLocaleString()} {platform?.name === 'YouTube' ? 'subscribers' : 'followers'}
                    </p>
                  </a>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <span className="text-xs font-medium text-green-800">✓</span>
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-10">
            <span className="material-icons text-4xl text-gray-400 mb-2">link_off</span>
            <p className="text-gray-500 dark:text-gray-400">No accounts connected yet.</p>
            <Button variant="outline" className="mt-4" onClick={() => setOpen(true)}>
              Connect Your First Account
            </Button>
          </div>
        )}
      </div>

      {/* Add Account Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Platform Account</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addAccount)} className="space-y-4">
              <FormField
                control={form.control}
                name="platformId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        {...field}
                      >
                        <option value={0}>Select a platform</option>
                        {platforms?.map((platform: Platform) => (
                          <option key={platform.id} value={platform.id}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My YouTube Channel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="followerCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follower Count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Account</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
