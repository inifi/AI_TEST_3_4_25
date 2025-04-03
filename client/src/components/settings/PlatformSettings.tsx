import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Platform, PlatformAccount } from "@shared/schema";

// Form schema for adding/editing platforms
const platformFormSchema = z.object({
  name: z.string().min(2, "Platform name must be at least 2 characters"),
  icon: z.string().min(1, "Icon is required"),
  active: z.boolean().default(true)
});

// Form schema for adding/editing platform accounts
const platformAccountFormSchema = z.object({
  name: z.string().min(2, "Account name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  platformId: z.coerce.number().min(1, "Platform is required"),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiry: z.string().optional(),
  followerCount: z.coerce.number().optional(),
  active: z.boolean().default(true),
});

export default function PlatformSettings() {
  const { toast } = useToast();
  const [platformDialogOpen, setPlatformDialogOpen] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [editingAccount, setEditingAccount] = useState<PlatformAccount | null>(null);
  const [deletingPlatformId, setDeletingPlatformId] = useState<number | null>(null);
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteAccountOpen, setConfirmDeleteAccountOpen] = useState(false);

  // Fetch platforms
  const { data: platforms = [], isLoading: loadingPlatforms } = useQuery({
    queryKey: ['/api/platforms'],
  });

  // Fetch platform accounts
  const { data: platformAccounts = [], isLoading: loadingAccounts } = useQuery({
    queryKey: ['/api/platform-accounts'],
  });

  // Platform form
  const platformForm = useForm<z.infer<typeof platformFormSchema>>({
    resolver: zodResolver(platformFormSchema),
    defaultValues: {
      name: "",
      icon: "device_hub",
      active: true
    }
  });

  // Account form
  const accountForm = useForm<z.infer<typeof platformAccountFormSchema>>({
    resolver: zodResolver(platformAccountFormSchema),
    defaultValues: {
      name: "",
      username: "",
      platformId: 0,
      accessToken: "",
      refreshToken: "",
      followerCount: 0,
      active: true
    }
  });

  // Add/Edit Platform Mutation
  const platformMutation = useMutation({
    mutationFn: async (data: z.infer<typeof platformFormSchema>) => {
      if (editingPlatform) {
        return apiRequest("PUT", `/api/platforms/${editingPlatform.id}`, data);
      } else {
        return apiRequest("POST", "/api/platforms", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/platforms'] });
      setPlatformDialogOpen(false);
      setEditingPlatform(null);
      platformForm.reset();
      toast({
        title: editingPlatform ? "Platform updated" : "Platform added",
        description: editingPlatform 
          ? "The platform has been updated successfully" 
          : "The platform has been added successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingPlatform ? 'update' : 'add'} platform: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete Platform Mutation
  const deletePlatformMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/platforms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/platforms'] });
      setConfirmDeleteOpen(false);
      setDeletingPlatformId(null);
      toast({
        title: "Platform deleted",
        description: "The platform has been deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete platform: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Add/Edit Account Mutation
  const accountMutation = useMutation({
    mutationFn: async (data: z.infer<typeof platformAccountFormSchema>) => {
      if (editingAccount) {
        return apiRequest("PUT", `/api/platform-accounts/${editingAccount.id}`, data);
      } else {
        return apiRequest("POST", "/api/platform-accounts", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/platform-accounts'] });
      setAccountDialogOpen(false);
      setEditingAccount(null);
      accountForm.reset();
      toast({
        title: editingAccount ? "Account updated" : "Account added",
        description: editingAccount 
          ? "The account has been updated successfully" 
          : "The account has been added successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingAccount ? 'update' : 'add'} account: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete Account Mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/platform-accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/platform-accounts'] });
      setConfirmDeleteAccountOpen(false);
      setDeletingAccountId(null);
      toast({
        title: "Account deleted",
        description: "The account has been deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete account: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle opening platform dialog for adding new platform
  const handleAddPlatform = () => {
    setEditingPlatform(null);
    platformForm.reset({
      name: "",
      icon: "device_hub",
      active: true
    });
    setPlatformDialogOpen(true);
  };

  // Handle opening platform dialog for editing existing platform
  const handleEditPlatform = (platform: Platform) => {
    setEditingPlatform(platform);
    platformForm.reset({
      name: platform.name,
      icon: platform.icon,
      active: platform.active
    });
    setPlatformDialogOpen(true);
  };

  // Handle platform deletion confirmation
  const handleDeletePlatform = (id: number) => {
    setDeletingPlatformId(id);
    setConfirmDeleteOpen(true);
  };

  // Handle confirm platform deletion
  const confirmDeletePlatform = () => {
    if (deletingPlatformId) {
      deletePlatformMutation.mutate(deletingPlatformId);
    }
  };

  // Handle opening account dialog for adding new account
  const handleAddAccount = () => {
    setEditingAccount(null);
    accountForm.reset({
      name: "",
      username: "",
      platformId: platforms && platforms.length > 0 ? platforms[0].id : 0,
      accessToken: "",
      refreshToken: "",
      followerCount: 0,
      active: true
    });
    setAccountDialogOpen(true);
  };

  // Handle opening account dialog for editing existing account
  const handleEditAccount = (account: PlatformAccount) => {
    setEditingAccount(account);
    accountForm.reset({
      name: account.name,
      username: account.username,
      platformId: account.platformId,
      accessToken: account.accessToken || "",
      refreshToken: account.refreshToken || "",
      followerCount: account.followerCount || 0,
      active: account.active
    });
    setAccountDialogOpen(true);
  };

  // Handle account deletion confirmation
  const handleDeleteAccount = (id: number) => {
    setDeletingAccountId(id);
    setConfirmDeleteAccountOpen(true);
  };

  // Handle confirm account deletion
  const confirmDeleteAccount = () => {
    if (deletingAccountId) {
      deleteAccountMutation.mutate(deletingAccountId);
    }
  };

  // Platform form submission
  const onPlatformSubmit = (values: z.infer<typeof platformFormSchema>) => {
    platformMutation.mutate(values);
  };

  // Account form submission
  const onAccountSubmit = (values: z.infer<typeof platformAccountFormSchema>) => {
    accountMutation.mutate(values);
  };

  // Get platform name from id
  const getPlatformName = (platformId: number): string => {
    if (!platforms) return "Unknown";
    const platform = platforms.find((p: Platform) => p.id === platformId);
    return platform ? platform.name : "Unknown";
  };

  // Get platform icon from id
  const getPlatformIcon = (platformId: number): string => {
    if (!platforms) return "device_hub";
    const platform = platforms.find((p: Platform) => p.id === platformId);
    return platform ? platform.icon : "device_hub";
  };

  // Get color class based on platform name
  const getPlatformColorClass = (platformName: string): string => {
    const name = platformName.toLowerCase();
    if (name.includes("youtube")) return "text-red-500";
    if (name.includes("instagram")) return "text-purple-500";
    if (name.includes("twitter") || name.includes("x")) return "text-blue-400";
    if (name.includes("facebook")) return "text-blue-600";
    if (name.includes("tiktok")) return "text-pink-500";
    if (name.includes("linkedin")) return "text-blue-700";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Platforms Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Platforms</CardTitle>
            <CardDescription>Manage social media platforms</CardDescription>
          </div>
          <Button onClick={handleAddPlatform}>
            <span className="material-icons mr-2 text-sm">add</span>
            Add Platform
          </Button>
        </CardHeader>
        <CardContent>
          {loadingPlatforms ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : platforms && platforms.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {platforms.map((platform: Platform) => (
                <div key={platform.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className={`material-icons ${getPlatformColorClass(platform.name)}`}>{platform.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{platform.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {platformAccounts ? 
                          platformAccounts.filter((a: PlatformAccount) => a.platformId === platform.id).length : 0} accounts
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditPlatform(platform)}>
                      <span className="material-icons text-sm">edit</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" onClick={() => handleDeletePlatform(platform.id)}>
                      <span className="material-icons text-sm">delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <span className="material-icons text-4xl text-gray-400 mb-2">device_hub</span>
              <p className="text-gray-500 dark:text-gray-400">No platforms added yet</p>
              <Button className="mt-4" onClick={handleAddPlatform}>
                <span className="material-icons mr-2 text-sm">add</span>
                Add Your First Platform
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Accounts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Platform Accounts</CardTitle>
            <CardDescription>Manage your social media accounts</CardDescription>
          </div>
          <Button onClick={handleAddAccount} disabled={!platforms || platforms.length === 0}>
            <span className="material-icons mr-2 text-sm">add</span>
            Add Account
          </Button>
        </CardHeader>
        <CardContent>
          {loadingAccounts ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : platformAccounts && platformAccounts.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {platformAccounts.map((account: PlatformAccount) => (
                <div key={account.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className={`material-icons ${getPlatformColorClass(getPlatformName(account.platformId))}`}>
                        {getPlatformIcon(account.platformId)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{account.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          @{account.username}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getPlatformName(account.platformId)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditAccount(account)}>
                      <span className="material-icons text-sm">edit</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" onClick={() => handleDeleteAccount(account.id)}>
                      <span className="material-icons text-sm">delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <span className="material-icons text-4xl text-gray-400 mb-2">account_circle</span>
              <p className="text-gray-500 dark:text-gray-400">No accounts added yet</p>
              {platforms && platforms.length > 0 ? (
                <Button className="mt-4" onClick={handleAddAccount}>
                  <span className="material-icons mr-2 text-sm">add</span>
                  Add Your First Account
                </Button>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Add a platform first to create accounts
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Dialog */}
      <Dialog open={platformDialogOpen} onOpenChange={setPlatformDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlatform ? "Edit Platform" : "Add Platform"}</DialogTitle>
            <DialogDescription>
              {editingPlatform 
                ? "Update the details for this platform" 
                : "Enter the details for the new platform"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...platformForm}>
            <form onSubmit={platformForm.handleSubmit(onPlatformSubmit)} className="space-y-4">
              <FormField
                control={platformForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., YouTube, Instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={platformForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (Material Icon name)</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input placeholder="e.g., smart_display, photo_camera" {...field} />
                        <div className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                          <span className="material-icons">{field.value}</span>
                        </div>
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Enter a valid <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="underline">Material Icon</a> name
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={platformForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Platform will be available for content creation and scheduling
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={platformMutation.isPending}>
                  {platformMutation.isPending ? (
                    <>
                      <span className="material-icons animate-spin mr-2 text-sm">refresh</span>
                      {editingPlatform ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>{editingPlatform ? "Update Platform" : "Add Platform"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Account Dialog */}
      <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAccount ? "Edit Account" : "Add Account"}</DialogTitle>
            <DialogDescription>
              {editingAccount 
                ? "Update the details for this account" 
                : "Enter the details for the new account"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...accountForm}>
            <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
              <FormField
                control={accountForm.control}
                name="platformId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        {...field}
                      >
                        {platforms && platforms.map((platform: Platform) => (
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
                control={accountForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Personal YouTube, Business Instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={accountForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., your_username, channel_name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={accountForm.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Token (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Platform access token" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={accountForm.control}
                  name="refreshToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refresh Token (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Platform refresh token" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={accountForm.control}
                name="followerCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follower Count</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={accountForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Account will be available for content creation and scheduling
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={accountMutation.isPending}>
                  {accountMutation.isPending ? (
                    <>
                      <span className="material-icons animate-spin mr-2 text-sm">refresh</span>
                      {editingAccount ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>{editingAccount ? "Update Account" : "Add Account"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Platform Dialog */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this platform and all associated accounts. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePlatform}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletePlatformMutation.isPending ? (
                <>
                  <span className="material-icons animate-spin mr-2 text-sm">refresh</span>
                  Deleting...
                </>
              ) : (
                "Delete Platform"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Confirm Delete Account Dialog */}
      <AlertDialog open={confirmDeleteAccountOpen} onOpenChange={setConfirmDeleteAccountOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteAccountMutation.isPending ? (
                <>
                  <span className="material-icons animate-spin mr-2 text-sm">refresh</span>
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}