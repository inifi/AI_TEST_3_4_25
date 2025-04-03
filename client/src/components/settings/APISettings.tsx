import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
} from "@/components/ui/alert-dialog";

// Form schema for API keys
const apiKeyFormSchema = z.object({
  name: z.string().min(2, "API key name must be at least 2 characters"),
  key: z.string().min(5, "API key must be at least 5 characters"),
  service: z.string().min(2, "Service name is required"),
  description: z.string().optional(),
});

// Mock type for API keys
type APIKey = {
  id: number;
  name: string;
  key: string;  
  service: string;
  description?: string;
  createdAt: string;
}

// Mock API keys data
// In a real implementation, this would come from the backend
const mockApiKeys: APIKey[] = [
  {
    id: 1,
    name: "OpenAI API Key",
    key: "sk-••••••••••••••••••••••••••••••••••••",
    service: "OpenAI",
    description: "Used for content generation and analysis",
    createdAt: "2023-08-01T14:30:00Z",
  },
  {
    id: 2,
    name: "Google Cloud API Key",
    key: "AIza••••••••••••••••••••••••••",
    service: "Google Cloud",
    description: "For YouTube integration and translation",
    createdAt: "2023-08-02T09:15:00Z",
  },
  {
    id: 3,
    name: "Weather API Key",
    key: "wapi••••••••••••••••••",
    service: "WeatherAPI",
    description: "For weather-related content creation",
    createdAt: "2023-08-03T11:20:00Z",
  },
];

export default function APISettings() {
  const { toast } = useToast();
  const [apiDialogOpen, setApiDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockApiKeys);
  const [editingApiKey, setEditingApiKey] = useState<APIKey | null>(null);
  const [deletingKeyId, setDeletingKeyId] = useState<number | null>(null);
  
  // API key form
  const apiKeyForm = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      name: "",
      key: "",
      service: "",
      description: "",
    }
  });

  // Handle opening dialog for adding new API key
  const handleAddApiKey = () => {
    setEditingApiKey(null);
    apiKeyForm.reset({
      name: "",
      key: "",
      service: "",
      description: "",
    });
    setApiDialogOpen(true);
  };

  // Handle opening dialog for editing existing API key
  const handleEditApiKey = (apiKey: APIKey) => {
    setEditingApiKey(apiKey);
    apiKeyForm.reset({
      name: apiKey.name,
      key: apiKey.key,
      service: apiKey.service,
      description: apiKey.description || "",
    });
    setApiDialogOpen(true);
  };

  // Handle API key deletion confirmation
  const handleDeleteApiKey = (id: number) => {
    setDeletingKeyId(id);
    setConfirmDeleteOpen(true);
  };

  // Handle confirming API key deletion
  const confirmDeleteApiKey = () => {
    if (deletingKeyId !== null) {
      // In a real implementation, this would be an API call
      setApiKeys(apiKeys.filter(key => key.id !== deletingKeyId));
      setConfirmDeleteOpen(false);
      setDeletingKeyId(null);
      toast({
        title: "API Key deleted",
        description: "The API key has been deleted successfully",
        variant: "default",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // API key form submission
  const onApiKeySubmit = (values: z.infer<typeof apiKeyFormSchema>) => {
    if (editingApiKey) {
      // In a real implementation, this would be an API call
      setApiKeys(apiKeys.map(key => 
        key.id === editingApiKey.id 
          ? { ...key, ...values, key: values.key } 
          : key
      ));
      toast({
        title: "API Key updated",
        description: "The API key has been updated successfully",
        variant: "default",
      });
    } else {
      // In a real implementation, this would be an API call
      const newKey: APIKey = {
        id: Math.max(...apiKeys.map(k => k.id), 0) + 1,
        name: values.name,
        key: values.key,
        service: values.service,
        description: values.description,
        createdAt: new Date().toISOString(),
      };
      setApiKeys([...apiKeys, newKey]);
      toast({
        title: "API Key added",
        description: "The API key has been added successfully",
        variant: "default",
      });
    }
    setApiDialogOpen(false);
    apiKeyForm.reset();
  };

  // Get service icon and color
  const getServiceIcon = (service: string): {icon: string, color: string} => {
    const serviceLower = service.toLowerCase();
    if (serviceLower.includes('openai')) return {icon: 'psychology', color: 'text-green-500'};
    if (serviceLower.includes('google')) return {icon: 'cloud', color: 'text-blue-500'};
    if (serviceLower.includes('twitter') || serviceLower.includes('x')) return {icon: 'tag', color: 'text-blue-400'};
    if (serviceLower.includes('youtube')) return {icon: 'smart_display', color: 'text-red-500'};
    if (serviceLower.includes('facebook')) return {icon: 'facebook', color: 'text-blue-600'};
    if (serviceLower.includes('instagram')) return {icon: 'photo_camera', color: 'text-purple-500'};
    if (serviceLower.includes('weather')) return {icon: 'cloud', color: 'text-cyan-500'};
    return {icon: 'vpn_key', color: 'text-gray-500'};
  };

  return (
    <div className="space-y-6">
      {/* API Keys Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage API keys for external services</CardDescription>
          </div>
          <Button onClick={handleAddApiKey}>
            <span className="material-icons mr-2 text-sm">add</span>
            Add API Key
          </Button>
        </CardHeader>
        <CardContent>
          {apiKeys.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {apiKeys.map((apiKey) => {
                const { icon, color } = getServiceIcon(apiKey.service);
                return (
                  <div key={apiKey.id} className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <span className={`material-icons ${color}`}>{icon}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{apiKey.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {apiKey.service} • Added {formatDate(apiKey.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditApiKey(apiKey)}>
                          <span className="material-icons text-sm">edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" onClick={() => handleDeleteApiKey(apiKey.id)}>
                          <span className="material-icons text-sm">delete</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{apiKey.key}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                          navigator.clipboard.writeText(apiKey.key.replace(/[•]/g, ''));
                          toast({
                            title: "API Key copied",
                            description: "The API key has been copied to clipboard",
                            variant: "default",
                          });
                        }}>
                          <span className="material-icons text-sm">content_copy</span>
                        </Button>
                      </div>
                      {apiKey.description && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{apiKey.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <span className="material-icons text-4xl text-gray-400 mb-2">vpn_key</span>
              <p className="text-gray-500 dark:text-gray-400">No API keys added yet</p>
              <Button className="mt-4" onClick={handleAddApiKey}>
                <span className="material-icons mr-2 text-sm">add</span>
                Add Your First API Key
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Key Dialog */}
      <Dialog open={apiDialogOpen} onOpenChange={setApiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingApiKey ? "Edit API Key" : "Add API Key"}</DialogTitle>
            <DialogDescription>
              {editingApiKey 
                ? "Update the details for this API key" 
                : "Enter the details for the new API key"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...apiKeyForm}>
            <form onSubmit={apiKeyForm.handleSubmit(onApiKeySubmit)} className="space-y-4">
              <FormField
                control={apiKeyForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., OpenAI API Key, YouTube API Key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={apiKeyForm.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., OpenAI, Google Cloud, Twitter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={apiKeyForm.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your API key" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={apiKeyForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What will this API key be used for?" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">
                  {editingApiKey ? "Update API Key" : "Add API Key"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete API Key Dialog */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this API key. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteApiKey}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete API Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}