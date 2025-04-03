import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export default function AutoContentScheduler() {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [contentTypes, setContentTypes] = useState(["youtube-video", "instagram-reel"]);
  const [topicSources, setTopicSources] = useState(["trending", "social-monitoring"]);
  const [aiQualityLevel, setAiQualityLevel] = useState(80);
  const [maxContentPerWeek, setMaxContentPerWeek] = useState(5);
  const [isAutomationActive, setIsAutomationActive] = useState(false);
  const [keywordsFilter, setKeywordsFilter] = useState("");

  // Fetch platform accounts
  const { data: platformAccounts } = useQuery({
    queryKey: ['/api/platform-accounts'],
  });

  // Fetch trending topics for context
  const { data: trendingTopics = [] } = useQuery({
    queryKey: ['/api/trending-topics'],
  });

  // Toggle activation mutation
  const toggleActivationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/auto-scheduler/toggle", data);
    },
    onSuccess: (data) => {
      setIsAutomationActive(data.isActive);
      toast({
        title: data.isActive ? "Automation activated" : "Automation deactivated",
        description: data.isActive 
          ? "The content automation system is now active" 
          : "The content automation system has been paused",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to toggle automation",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/auto-scheduler/settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your automation settings have been saved successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save settings",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleToggleAutomation = () => {
    if (!isEnabled) {
      toast({
        title: "Please enable automation first",
        description: "Enable the automation toggle above before activating",
        variant: "destructive",
      });
      return;
    }

    toggleActivationMutation.mutate({
      isActive: !isAutomationActive
    });
  };

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate({
      isEnabled,
      frequency,
      contentTypes,
      topicSources,
      aiQualityLevel,
      maxContentPerWeek,
      keywordsFilter: keywordsFilter.split(",").map(k => k.trim()).filter(k => k !== "")
    });
  };

  const handleContentTypeToggle = (contentType: string) => {
    if (contentTypes.includes(contentType)) {
      setContentTypes(contentTypes.filter(t => t !== contentType));
    } else {
      setContentTypes([...contentTypes, contentType]);
    }
  };

  const handleTopicSourceToggle = (source: string) => {
    if (topicSources.includes(source)) {
      setTopicSources(topicSources.filter(s => s !== source));
    } else {
      setTopicSources([...topicSources, source]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Autonomous Content Automation</CardTitle>
            <div className="flex items-center space-x-2">
              <Switch 
                id="automation-toggle" 
                checked={isEnabled} 
                onCheckedChange={setIsEnabled}
              />
              <Label htmlFor="automation-toggle">
                {isEnabled ? "Enabled" : "Disabled"}
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
              <span className="material-icons mr-2 text-sm">info</span>
              Autonomous Mode
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              When enabled, the system will automatically generate content, convert to voice, 
              and schedule posts based on your settings and trending topics.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="frequency" className="text-base font-medium">Publishing Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="frequency" className="mt-1.5">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label htmlFor="max-content" className="text-base font-medium">Maximum Content Per Week</Label>
                <span className="text-sm text-muted-foreground">{maxContentPerWeek} items</span>
              </div>
              <Slider
                id="max-content"
                min={1}
                max={20}
                step={1}
                value={[maxContentPerWeek]}
                onValueChange={(value) => setMaxContentPerWeek(value[0])}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block">Content Types to Generate</Label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={contentTypes.includes("youtube-video") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleContentTypeToggle("youtube-video")}
                >
                  YouTube Video
                </Badge>
                <Badge 
                  variant={contentTypes.includes("youtube-short") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleContentTypeToggle("youtube-short")}
                >
                  YouTube Short
                </Badge>
                <Badge 
                  variant={contentTypes.includes("instagram-reel") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleContentTypeToggle("instagram-reel")}
                >
                  Instagram Reel
                </Badge>
                <Badge 
                  variant={contentTypes.includes("tiktok") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleContentTypeToggle("tiktok")}
                >
                  TikTok
                </Badge>
                <Badge 
                  variant={contentTypes.includes("twitter-post") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleContentTypeToggle("twitter-post")}
                >
                  Twitter Post
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block">Topic Sources</Label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={topicSources.includes("trending") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTopicSourceToggle("trending")}
                >
                  Trending Topics
                </Badge>
                <Badge 
                  variant={topicSources.includes("news") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTopicSourceToggle("news")}
                >
                  Industry News
                </Badge>
                <Badge 
                  variant={topicSources.includes("social-monitoring") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTopicSourceToggle("social-monitoring")}
                >
                  Social Monitoring
                </Badge>
                <Badge 
                  variant={topicSources.includes("competitors") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTopicSourceToggle("competitors")}
                >
                  Competitor Analysis
                </Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="keywords-filter" className="text-base font-medium">Keywords Filter</Label>
              <Input 
                id="keywords-filter"
                placeholder="tech, AI, finance, marketing (comma separated)"
                value={keywordsFilter}
                onChange={(e) => setKeywordsFilter(e.target.value)}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only generate content related to these keywords. Leave empty for no filtering.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label htmlFor="ai-quality" className="text-base font-medium">AI Quality Level</Label>
                <span className="text-sm text-muted-foreground">{aiQualityLevel}%</span>
              </div>
              <Slider
                id="ai-quality"
                min={50}
                max={100}
                step={5}
                value={[aiQualityLevel]}
                onValueChange={(value) => setAiQualityLevel(value[0])}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher quality generates better content but takes longer to process.
              </p>
            </div>

            <div className="pt-2">
              <Button 
                variant="default" 
                className="w-full"
                onClick={handleSaveSettings}
                disabled={saveSettingsMutation.isPending}
              >
                {saveSettingsMutation.isPending ? (
                  <>
                    <span className="material-icons animate-spin mr-2">refresh</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2">save</span>
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 items-stretch border-t pt-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Automation Status</h3>
            <div className="flex justify-between items-center mb-2">
              <span>System Status:</span>
              <Badge variant={isAutomationActive ? "default" : "outline"}>
                {isAutomationActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Next scheduled task:</span>
                <span className="font-medium">
                  {isAutomationActive ? "Today at 2:30 PM" : "Not scheduled"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Content in queue:</span>
                <span className="font-medium">3 items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current processing:</span>
                <span className="font-medium">Analyzing trending topics</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Generated this week:</span>
                <span className="font-medium">2/{maxContentPerWeek}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm mb-1">Weekly quota usage:</p>
              <Progress value={40} className="h-2" />
            </div>
          </div>
          <Button 
            variant={isAutomationActive ? "destructive" : "default"}
            className="w-full"
            onClick={handleToggleAutomation}
            disabled={toggleActivationMutation.isPending || !isEnabled}
          >
            {toggleActivationMutation.isPending ? (
              <>
                <span className="material-icons animate-spin mr-2">refresh</span>
                Processing...
              </>
            ) : isAutomationActive ? (
              <>
                <span className="material-icons mr-2">pause_circle</span>
                Pause Automation
              </>
            ) : (
              <>
                <span className="material-icons mr-2">play_circle</span>
                Activate Automation
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}