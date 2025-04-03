import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

// Import settings components
import PlatformSettings from "@/components/settings/PlatformSettings";
import APISettings from "@/components/settings/APISettings";
import SystemSettings from "@/components/settings/SystemSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("platforms");
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your platform accounts, API keys, and system preferences
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={isMobile ? "grid grid-cols-3 w-full" : "flex"}>
              <TabsTrigger value="platforms" className="flex items-center">
                <span className="material-icons mr-2 text-sm">device_hub</span>
                <span>Platforms</span>
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center">
                <span className="material-icons mr-2 text-sm">vpn_key</span>
                <span>API Keys</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center">
                <span className="material-icons mr-2 text-sm">settings</span>
                <span>System</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <TabsContent value="platforms" className="mt-0">
            <PlatformSettings />
          </TabsContent>
          <TabsContent value="api-keys" className="mt-0">
            <APISettings />
          </TabsContent>
          <TabsContent value="system" className="mt-0">
            <SystemSettings />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
}