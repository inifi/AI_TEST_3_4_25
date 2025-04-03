import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ScriptGenerationPage() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("generate");
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("youtube-video");
  const [targetPlatform, setTargetPlatform] = useState("youtube");
  const [targetLength, setTargetLength] = useState(5); // in minutes
  const [tone, setTone] = useState("informative");
  const [audience, setAudience] = useState("general");
  const [scriptText, setScriptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoVoiceGeneration, setAutoVoiceGeneration] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("neutral-male");
  const [isConvertingToVoice, setIsConvertingToVoice] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  // Fetch trending topics for suggestions
  const { data: trendingTopics = [] } = useQuery({
    queryKey: ['/api/trending-topics'],
  });

  // Generate script mutation
  const generateScriptMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/scripts/generate", data);
    },
    onSuccess: (data: any) => {
      setScriptText(data.script);
      setActiveTab("edit");
      setIsGenerating(false);
      toast({
        title: "Script generated",
        description: "Your script has been generated successfully!",
        variant: "default",
      });
      
      // Auto convert to voice if enabled
      if (autoVoiceGeneration && data.script) {
        handleConvertToVoice(data.script);
      }
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: `Failed to generate script: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Convert to voice mutation
  const convertToVoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/scripts/to-voice", data);
    },
    onSuccess: (data: any) => {
      setAudioUrl(data.audioUrl);
      setIsConvertingToVoice(false);
      setActiveTab("voice");
      toast({
        title: "Voice generated",
        description: "Your script has been converted to voice successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      setIsConvertingToVoice(false);
      toast({
        title: "Voice generation failed",
        description: `Failed to convert script to voice: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Save script mutation
  const saveScriptMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/scripts", data);
    },
    onSuccess: () => {
      toast({
        title: "Script saved",
        description: "Your script has been saved successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Save failed",
        description: `Failed to save script: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleGenerateScript = () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your script",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    generateScriptMutation.mutate({
      topic,
      format,
      targetPlatform,
      targetLength,
      tone,
      audience
    });
  };

  const handleSaveScript = () => {
    if (!scriptText) {
      toast({
        title: "Script required",
        description: "Please generate or enter a script first",
        variant: "destructive",
      });
      return;
    }
    
    saveScriptMutation.mutate({
      topic,
      format,
      targetPlatform,
      script: scriptText,
      audioUrl: audioUrl || null
    });
  };

  const handleConvertToVoice = (text: string = scriptText) => {
    if (!text) {
      toast({
        title: "Script required",
        description: "Please generate or enter a script first",
        variant: "destructive",
      });
      return;
    }
    
    setIsConvertingToVoice(true);
    
    convertToVoiceMutation.mutate({
      script: text,
      voice: selectedVoice
    });
  };

  const handleUseTrendingTopic = (topic: string) => {
    setTopic(topic);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Script Generation</h1>
          <p className="text-muted-foreground">
            Generate, edit, and convert scripts to voice for your content
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="p-4 sm:p-6 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={isMobile ? "grid grid-cols-3 w-full" : "flex"}>
              <TabsTrigger value="generate" className="flex items-center">
                <span className="material-icons mr-2 text-sm">auto_awesome</span>
                <span>Generate</span>
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center">
                <span className="material-icons mr-2 text-sm">edit_note</span>
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center">
                <span className="material-icons mr-2 text-sm">record_voice_over</span>
                <span>Voice</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <TabsContent value="generate" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic" className="text-base font-medium">Topic/Title</Label>
                <Input 
                  id="topic" 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)} 
                  placeholder="Enter your video topic or title" 
                  className="mt-1.5"
                />
              </div>
              
              {trendingTopics.length > 0 && (
                <div>
                  <Label className="text-sm text-muted-foreground">Trending Topics</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {trendingTopics.slice(0, 5).map((topic: any) => (
                      <Button 
                        key={topic.id} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUseTrendingTopic(topic.topic)}
                      >
                        <span className="material-icons mr-1 text-sm text-primary">trending_up</span>
                        {topic.topic}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="format" className="text-base font-medium">Content Format</Label>
                  <Select defaultValue={format} onValueChange={setFormat}>
                    <SelectTrigger id="format" className="mt-1.5">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube-video">YouTube Video</SelectItem>
                      <SelectItem value="youtube-short">YouTube Short</SelectItem>
                      <SelectItem value="instagram-reel">Instagram Reel</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="explainer">Explainer Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="platform" className="text-base font-medium">Target Platform</Label>
                  <Select defaultValue={targetPlatform} onValueChange={setTargetPlatform}>
                    <SelectTrigger id="platform" className="mt-1.5">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label htmlFor="length" className="text-base font-medium">Target Length</Label>
                  <span className="text-sm text-muted-foreground">{targetLength} minutes</span>
                </div>
                <Slider
                  id="length"
                  min={1}
                  max={20}
                  step={1}
                  defaultValue={[targetLength]}
                  onValueChange={(value) => setTargetLength(value[0])}
                  className="mt-1.5"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone" className="text-base font-medium">Tone</Label>
                  <Select defaultValue={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone" className="mt-1.5">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="entertaining">Entertaining</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="audience" className="text-base font-medium">Target Audience</Label>
                  <Select defaultValue={audience} onValueChange={setAudience}>
                    <SelectTrigger id="audience" className="mt-1.5">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="beginners">Beginners</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="professionals">Professionals</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="creators">Content Creators</SelectItem>
                      <SelectItem value="developers">Developers</SelectItem>
                      <SelectItem value="marketers">Marketers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="auto-voice"
                  checked={autoVoiceGeneration}
                  onCheckedChange={setAutoVoiceGeneration}
                />
                <Label htmlFor="auto-voice">
                  Automatically convert to voice after generation
                </Label>
              </div>
              
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleGenerateScript}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="material-icons animate-spin mr-2">refresh</span>
                    Generating Script...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2">auto_awesome</span>
                    Generate Script
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="edit" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="script-editor" className="text-base font-medium">Script Content</Label>
                <Textarea
                  id="script-editor"
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder="Your script content will appear here. You can edit it as needed."
                  className="mt-1.5 min-h-[400px] font-mono"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={handleSaveScript}
                >
                  <span className="material-icons mr-2">save</span>
                  Save Script
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleConvertToVoice()}
                  disabled={isConvertingToVoice}
                >
                  {isConvertingToVoice ? (
                    <>
                      <span className="material-icons animate-spin mr-2">refresh</span>
                      Converting...
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-2">record_voice_over</span>
                      Convert to Voice
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setActiveTab("generate")}
                >
                  <span className="material-icons mr-2">settings_backup_restore</span>
                  Back to Generation
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="voice-selection" className="text-base font-medium">Voice Selection</Label>
                <Select defaultValue={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger id="voice-selection" className="mt-1.5">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral-male">Neutral Male</SelectItem>
                    <SelectItem value="neutral-female">Neutral Female</SelectItem>
                    <SelectItem value="friendly-male">Friendly Male</SelectItem>
                    <SelectItem value="friendly-female">Friendly Female</SelectItem>
                    <SelectItem value="professional-male">Professional Male</SelectItem>
                    <SelectItem value="professional-female">Professional Female</SelectItem>
                    <SelectItem value="enthusiastic-male">Enthusiastic Male</SelectItem>
                    <SelectItem value="enthusiastic-female">Enthusiastic Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {audioUrl ? (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Generated Audio</h3>
                  <audio 
                    controls 
                    className="w-full"
                    src={audioUrl}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <span className="material-icons text-4xl text-gray-400 mb-2">audio_file</span>
                  <p className="text-gray-500 dark:text-gray-400">No audio generated yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => handleConvertToVoice()}
                    disabled={isConvertingToVoice || !scriptText}
                  >
                    {isConvertingToVoice ? (
                      <>
                        <span className="material-icons animate-spin mr-2">refresh</span>
                        Converting...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">record_voice_over</span>
                        Generate Audio
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={handleSaveScript}
                >
                  <span className="material-icons mr-2">save</span>
                  Save Script & Audio
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setActiveTab("edit")}
                >
                  <span className="material-icons mr-2">edit_note</span>
                  Edit Script
                </Button>
                
                {audioUrl && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      // Create a temporary link to download the audio
                      const a = document.createElement('a');
                      a.href = audioUrl;
                      a.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-voice.mp3`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    <span className="material-icons mr-2">download</span>
                    Download Audio
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="p-4 sm:p-6 border-t flex-col items-start">
          <p className="text-sm text-muted-foreground">
            <span className="material-icons text-primary text-sm align-text-top mr-1">lightbulb</span>
            <span className="font-medium">Tip:</span> For better results, be specific about your topic and target audience. The more details you provide, the better the script will be tailored to your needs.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}