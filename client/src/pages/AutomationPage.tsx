import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import AutoContentScheduler from "@/components/AutoContentScheduler";
import AIToolsConfig from "@/components/AIToolsConfig";

export default function AutomationPage() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("auto-scheduler");
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation</h1>
          <p className="text-muted-foreground">
            Configure autonomous content creation and AI tools
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className={isMobile ? "grid grid-cols-2 w-full" : "flex"}>
          <TabsTrigger value="auto-scheduler" className="flex items-center">
            <span className="material-icons mr-2 text-sm">schedule</span>
            <span>Content Automation</span>
          </TabsTrigger>
          <TabsTrigger value="ai-tools" className="flex items-center">
            <span className="material-icons mr-2 text-sm">smart_toy</span>
            <span>AI Tools Config</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="auto-scheduler" className="mt-6">
          <AutoContentScheduler />
        </TabsContent>
        
        <TabsContent value="ai-tools" className="mt-6">
          <AIToolsConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}