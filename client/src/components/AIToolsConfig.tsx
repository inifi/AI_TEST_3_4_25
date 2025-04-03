import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AIToolsConfig() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("content-generation");
  
  // Content Generation Settings
  const [contentModel, setContentModel] = useState("gpt-4o");
  const [contentTemperature, setContentTemperature] = useState("0.7");
  const [contentPrompt, setContentPrompt] = useState("Create engaging, informative content about {topic} for {platform} that is {tone} in tone and aimed at {audience}. Include relevant call-to-actions and engagement hooks.");
  
  // Script Generation Settings
  const [scriptModel, setScriptModel] = useState("gpt-4o");
  const [scriptTemperature, setScriptTemperature] = useState("0.7");
  const [scriptPrompt, setScriptPrompt] = useState("Write a {format} script about {topic} in a {tone} tone for {audience}. The script should be engaging, informative, and include appropriate pacing for a video of approximately {length} minutes.");
  
  // Voice Generation Settings
  const [voiceProvider, setVoiceProvider] = useState("elevenlabs");
  const [defaultVoice, setDefaultVoice] = useState("professional-male");
  const [voiceSpeed, setVoiceSpeed] = useState("1.0");
  const [audioFormat, setAudioFormat] = useState("mp3");
  
  // Image Generation Settings
  const [imageModel, setImageModel] = useState("dall-e-3");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [imageStyle, setImageStyle] = useState("vivid");
  const [imagePromptStyle, setImagePromptStyle] = useState("Create a visually appealing thumbnail image for a video about {topic}. The image should be eye-catching, professional, and clearly represent the topic.");
  
  // Trend Analysis Settings
  const [trendSources, setTrendSources] = useState(["twitter", "youtube", "google-trends"]);
  const [trendUpdateFrequency, setTrendUpdateFrequency] = useState("hourly");
  const [trendRegion, setTrendRegion] = useState("global");
  const [trendCategories, setTrendCategories] = useState(["technology", "entertainment", "business"]);
  
  // Helper function to handle trend source toggle
  const handleTrendSourceToggle = (source: string) => {
    setTrendSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source) 
        : [...prev, source]
    );
  };
  
  // Helper function to handle trend category toggle
  const handleTrendCategoryToggle = (category: string) => {
    setTrendCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/ai-tools/settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your AI tool settings have been saved successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-tools/settings'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to save settings",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Load settings query
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/ai-tools/settings'],
    onSuccess: (data) => {
      // Load saved settings if available
      if (data) {
        // Content Generation Settings
        if (data.contentGeneration) {
          setContentModel(data.contentGeneration.model || contentModel);
          setContentTemperature(data.contentGeneration.temperature || contentTemperature);
          setContentPrompt(data.contentGeneration.defaultPrompt || contentPrompt);
        }
        
        // Script Generation Settings
        if (data.scriptGeneration) {
          setScriptModel(data.scriptGeneration.model || scriptModel);
          setScriptTemperature(data.scriptGeneration.temperature || scriptTemperature);
          setScriptPrompt(data.scriptGeneration.defaultPrompt || scriptPrompt);
        }
        
        // Voice Generation Settings
        if (data.voiceGeneration) {
          setVoiceProvider(data.voiceGeneration.provider || voiceProvider);
          setDefaultVoice(data.voiceGeneration.defaultVoice || defaultVoice);
          setVoiceSpeed(data.voiceGeneration.speed || voiceSpeed);
          setAudioFormat(data.voiceGeneration.format || audioFormat);
        }
        
        // Image Generation Settings
        if (data.imageGeneration) {
          setImageModel(data.imageGeneration.model || imageModel);
          setImageSize(data.imageGeneration.size || imageSize);
          setImageStyle(data.imageGeneration.style || imageStyle);
          setImagePromptStyle(data.imageGeneration.defaultPrompt || imagePromptStyle);
        }
        
        // Trend Analysis Settings
        if (data.trendAnalysis) {
          setTrendSources(data.trendAnalysis.sources || trendSources);
          setTrendUpdateFrequency(data.trendAnalysis.updateFrequency || trendUpdateFrequency);
          setTrendRegion(data.trendAnalysis.region || trendRegion);
          setTrendCategories(data.trendAnalysis.categories || trendCategories);
        }
      }
    }
  });
  
  const handleSaveSettings = () => {
    const settingsData = {
      contentGeneration: {
        model: contentModel,
        temperature: contentTemperature,
        defaultPrompt: contentPrompt,
      },
      scriptGeneration: {
        model: scriptModel,
        temperature: scriptTemperature,
        defaultPrompt: scriptPrompt,
      },
      voiceGeneration: {
        provider: voiceProvider,
        defaultVoice: defaultVoice,
        speed: voiceSpeed,
        format: audioFormat,
      },
      imageGeneration: {
        model: imageModel,
        size: imageSize,
        style: imageStyle,
        defaultPrompt: imagePromptStyle,
      },
      trendAnalysis: {
        sources: trendSources,
        updateFrequency: trendUpdateFrequency,
        region: trendRegion,
        categories: trendCategories,
      }
    };
    
    saveSettingsMutation.mutate(settingsData);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Tools Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={isMobile ? "grid grid-cols-3 w-full mb-2" : "w-full mb-4"}>
              <TabsTrigger value="content-generation" className="flex items-center">
                <span className="material-icons mr-2 text-sm">article</span>
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="script-voice" className="flex items-center">
                <span className="material-icons mr-2 text-sm">record_voice_over</span>
                <span>Script & Voice</span>
              </TabsTrigger>
              <TabsTrigger value="image-trends" className="flex items-center">
                <span className="material-icons mr-2 text-sm">trending_up</span>
                <span>Images & Trends</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Content Generation Tab */}
            <TabsContent value="content-generation" className="space-y-4 mt-2">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Content Generation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="content-model">AI Model</Label>
                    <Select value={contentModel} onValueChange={setContentModel}>
                      <SelectTrigger id="content-model" className="mt-1.5">
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
                        <SelectItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet (Anthropic)</SelectItem>
                        <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Sonar (Perplexity)</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro (Google)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="content-temperature">Temperature</Label>
                    <Select value={contentTemperature} onValueChange={setContentTemperature}>
                      <SelectTrigger id="content-temperature" className="mt-1.5">
                        <SelectValue placeholder="Select temperature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.3">0.3 - Very Focused</SelectItem>
                        <SelectItem value="0.5">0.5 - Balanced</SelectItem>
                        <SelectItem value="0.7">0.7 - Creative</SelectItem>
                        <SelectItem value="0.9">0.9 - Very Creative</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher values make output more creative but less focused
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="content-prompt">Default Content Prompt Template</Label>
                  <Input 
                    id="content-prompt"
                    value={contentPrompt}
                    onChange={(e) => setContentPrompt(e.target.value)}
                    className="mt-1.5 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {"{topic}"}, {"{platform}"}, {"{tone}"}, {"{audience}"} as variables
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Self-Improvement Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="content-self-editing" defaultChecked />
                      <Label htmlFor="content-self-editing">Self-editing and refinement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="content-fact-checking" defaultChecked />
                      <Label htmlFor="content-fact-checking">Automatic fact-checking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="content-quality-check" defaultChecked />
                      <Label htmlFor="content-quality-check">Quality assurance before posting</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Script & Voice Generation Tab */}
            <TabsContent value="script-voice" className="space-y-4 mt-2">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Script Generation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="script-model">AI Model</Label>
                    <Select value={scriptModel} onValueChange={setScriptModel}>
                      <SelectTrigger id="script-model" className="mt-1.5">
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
                        <SelectItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet (Anthropic)</SelectItem>
                        <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Sonar (Perplexity)</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro (Google)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="script-temperature">Temperature</Label>
                    <Select value={scriptTemperature} onValueChange={setScriptTemperature}>
                      <SelectTrigger id="script-temperature" className="mt-1.5">
                        <SelectValue placeholder="Select temperature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.3">0.3 - Very Focused</SelectItem>
                        <SelectItem value="0.5">0.5 - Balanced</SelectItem>
                        <SelectItem value="0.7">0.7 - Creative</SelectItem>
                        <SelectItem value="0.9">0.9 - Very Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="script-prompt">Default Script Prompt Template</Label>
                  <Input 
                    id="script-prompt"
                    value={scriptPrompt}
                    onChange={(e) => setScriptPrompt(e.target.value)}
                    className="mt-1.5 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {"{topic}"}, {"{format}"}, {"{tone}"}, {"{audience}"}, {"{length}"} as variables
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-medium text-lg">Voice Generation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="voice-provider">Voice Provider</Label>
                    <Select value={voiceProvider} onValueChange={setVoiceProvider}>
                      <SelectTrigger id="voice-provider" className="mt-1.5">
                        <SelectValue placeholder="Select voice provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                        <SelectItem value="aws-polly">AWS Polly</SelectItem>
                        <SelectItem value="google-tts">Google Text-to-Speech</SelectItem>
                        <SelectItem value="azure-tts">Azure Text-to-Speech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="default-voice">Default Voice</Label>
                    <Select value={defaultVoice} onValueChange={setDefaultVoice}>
                      <SelectTrigger id="default-voice" className="mt-1.5">
                        <SelectValue placeholder="Select default voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neutral-male">Neutral Male</SelectItem>
                        <SelectItem value="neutral-female">Neutral Female</SelectItem>
                        <SelectItem value="professional-male">Professional Male</SelectItem>
                        <SelectItem value="professional-female">Professional Female</SelectItem>
                        <SelectItem value="enthusiastic-male">Enthusiastic Male</SelectItem>
                        <SelectItem value="enthusiastic-female">Enthusiastic Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="voice-speed">Voice Speed</Label>
                    <Select value={voiceSpeed} onValueChange={setVoiceSpeed}>
                      <SelectTrigger id="voice-speed" className="mt-1.5">
                        <SelectValue placeholder="Select voice speed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.8">0.8x - Slower</SelectItem>
                        <SelectItem value="0.9">0.9x - Slightly Slower</SelectItem>
                        <SelectItem value="1.0">1.0x - Normal</SelectItem>
                        <SelectItem value="1.1">1.1x - Slightly Faster</SelectItem>
                        <SelectItem value="1.2">1.2x - Faster</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="audio-format">Audio Format</Label>
                    <Select value={audioFormat} onValueChange={setAudioFormat}>
                      <SelectTrigger id="audio-format" className="mt-1.5">
                        <SelectValue placeholder="Select audio format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp3">MP3</SelectItem>
                        <SelectItem value="wav">WAV</SelectItem>
                        <SelectItem value="ogg">OGG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Audio Processing</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="voice-background-removal" defaultChecked />
                      <Label htmlFor="voice-background-removal">Background noise removal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="voice-normalize" defaultChecked />
                      <Label htmlFor="voice-normalize">Normalize audio levels</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="voice-enhance" defaultChecked />
                      <Label htmlFor="voice-enhance">Voice enhancement</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Images & Trends Tab */}
            <TabsContent value="image-trends" className="space-y-4 mt-2">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Image Generation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image-model">Image Model</Label>
                    <Select value={imageModel} onValueChange={setImageModel}>
                      <SelectTrigger id="image-model" className="mt-1.5">
                        <SelectValue placeholder="Select image model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dall-e-3">DALL-E 3 (OpenAI)</SelectItem>
                        <SelectItem value="stable-diffusion-xl">Stable Diffusion XL</SelectItem>
                        <SelectItem value="midjourney">Midjourney</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="image-size">Image Size</Label>
                    <Select value={imageSize} onValueChange={setImageSize}>
                      <SelectTrigger id="image-size" className="mt-1.5">
                        <SelectValue placeholder="Select image size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024x1024">1024x1024 (Square)</SelectItem>
                        <SelectItem value="1024x768">1024x768 (Landscape)</SelectItem>
                        <SelectItem value="768x1024">768x1024 (Portrait)</SelectItem>
                        <SelectItem value="1792x1024">1792x1024 (Wide)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="image-style">Image Style</Label>
                  <Select value={imageStyle} onValueChange={setImageStyle}>
                    <SelectTrigger id="image-style" className="mt-1.5">
                      <SelectValue placeholder="Select image style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vivid">Vivid - Hyper-real and dramatic</SelectItem>
                      <SelectItem value="natural">Natural - More subtle and realistic</SelectItem>
                      <SelectItem value="cartoon">Cartoon - Stylized animation style</SelectItem>
                      <SelectItem value="digital-art">Digital Art - Modern digital style</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="image-prompt">Default Image Prompt Template</Label>
                  <Input 
                    id="image-prompt"
                    value={imagePromptStyle}
                    onChange={(e) => setImagePromptStyle(e.target.value)}
                    className="mt-1.5 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {"{topic}"} as a variable in your prompt
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-medium text-lg">Trend Analysis</h3>
                <div>
                  <Label className="block mb-2">Trend Sources</Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-twitter" 
                        checked={trendSources.includes("twitter")}
                        onCheckedChange={() => handleTrendSourceToggle("twitter")}
                      />
                      <Label htmlFor="trend-twitter">Twitter/X</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-youtube" 
                        checked={trendSources.includes("youtube")}
                        onCheckedChange={() => handleTrendSourceToggle("youtube")}
                      />
                      <Label htmlFor="trend-youtube">YouTube</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-tiktok" 
                        checked={trendSources.includes("tiktok")}
                        onCheckedChange={() => handleTrendSourceToggle("tiktok")}
                      />
                      <Label htmlFor="trend-tiktok">TikTok</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-reddit" 
                        checked={trendSources.includes("reddit")}
                        onCheckedChange={() => handleTrendSourceToggle("reddit")}
                      />
                      <Label htmlFor="trend-reddit">Reddit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-google" 
                        checked={trendSources.includes("google-trends")}
                        onCheckedChange={() => handleTrendSourceToggle("google-trends")}
                      />
                      <Label htmlFor="trend-google">Google Trends</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-news" 
                        checked={trendSources.includes("news-api")}
                        onCheckedChange={() => handleTrendSourceToggle("news-api")}
                      />
                      <Label htmlFor="trend-news">News API</Label>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trend-frequency">Update Frequency</Label>
                    <Select value={trendUpdateFrequency} onValueChange={setTrendUpdateFrequency}>
                      <SelectTrigger id="trend-frequency" className="mt-1.5">
                        <SelectValue placeholder="Select update frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="trend-region">Region Focus</Label>
                    <Select value={trendRegion} onValueChange={setTrendRegion}>
                      <SelectTrigger id="trend-region" className="mt-1.5">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="eu">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="block mb-2">Trend Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-technology" 
                        checked={trendCategories.includes("technology")}
                        onCheckedChange={() => handleTrendCategoryToggle("technology")}
                      />
                      <Label htmlFor="trend-technology">Technology</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-entertainment" 
                        checked={trendCategories.includes("entertainment")}
                        onCheckedChange={() => handleTrendCategoryToggle("entertainment")}
                      />
                      <Label htmlFor="trend-entertainment">Entertainment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-business" 
                        checked={trendCategories.includes("business")}
                        onCheckedChange={() => handleTrendCategoryToggle("business")}
                      />
                      <Label htmlFor="trend-business">Business</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-sports" 
                        checked={trendCategories.includes("sports")}
                        onCheckedChange={() => handleTrendCategoryToggle("sports")}
                      />
                      <Label htmlFor="trend-sports">Sports</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-gaming" 
                        checked={trendCategories.includes("gaming")}
                        onCheckedChange={() => handleTrendCategoryToggle("gaming")}
                      />
                      <Label htmlFor="trend-gaming">Gaming</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend-science" 
                        checked={trendCategories.includes("science")}
                        onCheckedChange={() => handleTrendCategoryToggle("science")}
                      />
                      <Label htmlFor="trend-science">Science</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col items-stretch border-t pt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
              <span className="material-icons mr-2 text-sm">lightbulb</span>
              AI Quality Recommendation
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              For best results with fully autonomous content creation, we recommend using the latest AI models (GPT-4o or Claude 3.7) with a temperature setting of 0.7 for a balance of creativity and coherence.
            </p>
          </div>
          
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
                Save AI Configuration
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}