import {
  User, InsertUser, users,
  Script, InsertScript, scripts,
  AiConfig, InsertAiConfig, aiConfigs,
  Platform, InsertPlatform, platforms,
  PlatformAccount, InsertPlatformAccount, platformAccounts,
  Content, InsertContent, content,
  ScheduledPost, InsertScheduledPost, scheduledPosts,
  TrendingTopic, InsertTrendingTopic, trendingTopics
} from "@shared/schema";

// Storage interface definition
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Scripts
  getScripts(): Promise<Script[]>;
  getScript(id: number): Promise<Script | undefined>;
  getRecentScripts(limit: number): Promise<Script[]>;
  createScript(script: InsertScript): Promise<Script>;
  updateScript(id: number, script: Partial<InsertScript>): Promise<Script | undefined>;
  deleteScript(id: number): Promise<boolean>;
  
  // AI Configs
  getAiConfigs(): Promise<AiConfig[]>;
  getAiConfig(id: number): Promise<AiConfig | undefined>;
  getAiConfigsByType(modelType: string): Promise<AiConfig[]>;
  createAiConfig(config: InsertAiConfig): Promise<AiConfig>;
  updateAiConfig(id: number, config: Partial<InsertAiConfig>): Promise<AiConfig | undefined>;
  deleteAiConfig(id: number): Promise<boolean>;

  // Platforms
  getPlatforms(): Promise<Platform[]>;
  getPlatform(id: number): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatform(id: number, platform: Partial<InsertPlatform>): Promise<Platform | undefined>;
  deletePlatform(id: number): Promise<boolean>;

  // Platform Accounts
  getPlatformAccounts(): Promise<PlatformAccount[]>;
  getPlatformAccount(id: number): Promise<PlatformAccount | undefined>;
  getPlatformAccountsByPlatform(platformId: number): Promise<PlatformAccount[]>;
  createPlatformAccount(account: InsertPlatformAccount): Promise<PlatformAccount>;
  updatePlatformAccount(id: number, account: Partial<InsertPlatformAccount>): Promise<PlatformAccount | undefined>;
  deletePlatformAccount(id: number): Promise<boolean>;

  // Content
  getContents(): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  getRecentContents(limit: number): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;

  // Scheduled Posts
  getScheduledPosts(): Promise<ScheduledPost[]>;
  getScheduledPost(id: number): Promise<ScheduledPost | undefined>;
  getUpcomingScheduledPosts(limit: number): Promise<ScheduledPost[]>;
  createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost>;
  updateScheduledPost(id: number, post: Partial<InsertScheduledPost>): Promise<ScheduledPost | undefined>;
  deleteScheduledPost(id: number): Promise<boolean>;

  // Trending Topics
  getTrendingTopics(): Promise<TrendingTopic[]>;
  getTrendingTopic(id: number): Promise<TrendingTopic | undefined>;
  getTopTrendingTopics(limit: number): Promise<TrendingTopic[]>;
  createTrendingTopic(topic: InsertTrendingTopic): Promise<TrendingTopic>;
  updateTrendingTopic(id: number, topic: Partial<InsertTrendingTopic>): Promise<TrendingTopic | undefined>;
  deleteTrendingTopic(id: number): Promise<boolean>;

  // System Status
  getSystemStatus(): Promise<SystemStatus>;
}

// System status type for monitoring resources
export type SystemStatus = {
  cpuUsage: number;
  memoryUsage: number;
  storageAvailable: number;
  aiModelsLoaded: number;
  isOnline: boolean;
};

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scripts: Map<number, Script>;
  private aiConfigs: Map<number, AiConfig>;
  private platforms: Map<number, Platform>;
  private platformAccounts: Map<number, PlatformAccount>;
  private contents: Map<number, Content>;
  private scheduledPosts: Map<number, ScheduledPost>;
  private trendingTopics: Map<number, TrendingTopic>;
  
  private userId: number;
  private scriptId: number;
  private aiConfigId: number;
  private platformId: number;
  private accountId: number;
  private contentId: number;
  private postId: number;
  private topicId: number;

  constructor() {
    this.users = new Map();
    this.scripts = new Map();
    this.aiConfigs = new Map();
    this.platforms = new Map();
    this.platformAccounts = new Map();
    this.contents = new Map();
    this.scheduledPosts = new Map();
    this.trendingTopics = new Map();

    this.userId = 1;
    this.scriptId = 1;
    this.aiConfigId = 1;
    this.platformId = 1;
    this.accountId = 1;
    this.contentId = 1;
    this.postId = 1;
    this.topicId = 1;

    // Seed initial data
    this.seedInitialData();
  }

  // Seed some initial data for demonstration
  private seedInitialData() {
    // Add AI configs
    const llama3Config: AiConfig = {
      id: this.aiConfigId++,
      name: "Llama 3",
      modelType: "llm",
      modelName: "llama3",
      active: true,
      settings: {
        maxTokens: 2048,
        temperature: 0.7,
        topP: 0.9
      },
      capabilities: {
        scriptGeneration: true,
        contentCreation: true,
        trendAnalysis: true,
        summarization: true
      },
      lastUpdated: new Date(),
      downloadStatus: "not_downloaded"
    };
    this.aiConfigs.set(llama3Config.id, llama3Config);

    const ttsConfig: AiConfig = {
      id: this.aiConfigId++,
      name: "Local TTS",
      modelType: "tts",
      modelName: "professional-male",
      active: true,
      settings: {
        speed: 1.0,
        format: "mp3"
      },
      capabilities: {
        voiceGeneration: true,
        scriptToAudio: true,
        voiceStyles: ["professional", "casual", "energetic"]
      },
      lastUpdated: new Date(),
      downloadStatus: "available"
    };
    this.aiConfigs.set(ttsConfig.id, ttsConfig);

    const imageConfig: AiConfig = {
      id: this.aiConfigId++,
      name: "SVG Generator",
      modelType: "image",
      modelName: "svg-generator",
      active: true,
      settings: {
        size: "1024x1024",
        style: "artistic"
      },
      capabilities: {
        thumbnailGeneration: true,
        imageGeneration: true,
        supportedSizes: ["512x512", "1024x1024", "1280x720"]
      },
      lastUpdated: new Date(),
      downloadStatus: "available"
    };
    this.aiConfigs.set(imageConfig.id, imageConfig);

    // Add scripts
    const videoScript: Script = {
      id: this.scriptId++,
      title: "Creating Zero-Cost Content with AI",
      topic: "AI content creation",
      format: "video",
      content: "# INTRODUCTION\n\nWelcome to this guide on creating content with zero-cost AI tools. Today we'll explore how you can leverage free open-source models to create high-quality content without any subscription fees.\n\n# SECTION 1: LOCAL LLMS\n\nLet's start with text generation. There are several open-source language models that can run on consumer hardware with surprisingly good results. These include models like Llama 3 and Mistral, which can be downloaded and run locally.\n\n# SECTION 2: TEXT-TO-SPEECH\n\nNext, let's look at converting your scripts to audio. Open-source TTS systems have made remarkable progress, offering near commercial-quality voices without any API costs.\n\n# SECTION 3: IMAGE GENERATION\n\nFor thumbnails and visuals, local Stable Diffusion or even SVG generators can create eye-catching graphics completely free.\n\n# CONCLUSION\n\nBy combining these tools, you can build a complete content creation pipeline that operates entirely on your own hardware, with zero ongoing costs. Thanks for watching!",
      duration: 360, // 6 minutes
      tone: "educational",
      targetAudience: "content creators",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      audioPath: null,
      status: "draft"
    };
    this.scripts.set(videoScript.id, videoScript);

    const shortScript: Script = {
      id: this.scriptId++,
      title: "5 AI Tools Every Creator Needs",
      topic: "AI tools",
      format: "short",
      content: "Did you know you can create professional content without spending a dime? Here are 5 free AI tools that every creator should be using right now:\n\n1. Open source language models for scriptwriting\n2. Free text-to-speech for voiceovers\n3. Local image generation for thumbnails\n4. Open source video editors\n5. Free automation tools for posting\n\nThe best part? All of these can run on your own computer with zero subscription fees. Follow for more tips on building your content creation pipeline without breaking the bank!",
      duration: 60, // 1 minute
      tone: "enthusiastic",
      targetAudience: "social media creators",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      audioPath: "/content/audio/5-ai-tools.mp3",
      status: "finalized"
    };
    this.scripts.set(shortScript.id, shortScript);

    // Add platforms
    const youtubePlatform: Platform = {
      id: this.platformId++,
      name: "YouTube",
      icon: "smart_display",
      active: true
    };
    this.platforms.set(youtubePlatform.id, youtubePlatform);

    const instagramPlatform: Platform = {
      id: this.platformId++,
      name: "Instagram",
      icon: "photo_camera",
      active: true
    };
    this.platforms.set(instagramPlatform.id, instagramPlatform);

    const twitterPlatform: Platform = {
      id: this.platformId++,
      name: "Twitter",
      icon: "tag",
      active: true
    };
    this.platforms.set(twitterPlatform.id, twitterPlatform);

    // Add platform accounts
    const youtubeAccount: PlatformAccount = {
      id: this.accountId++,
      platformId: youtubePlatform.id,
      name: "Tech Channel",
      username: "TechChannel",
      followerCount: 15200,
      active: true,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      metadata: { subscriberCount: 15200 }
    };
    this.platformAccounts.set(youtubeAccount.id, youtubeAccount);

    const instagramAccount: PlatformAccount = {
      id: this.accountId++,
      platformId: instagramPlatform.id,
      name: "@techinsider",
      username: "techinsider",
      followerCount: 8700,
      active: true,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      metadata: { followersCount: 8700 }
    };
    this.platformAccounts.set(instagramAccount.id, instagramAccount);

    const twitterAccount: PlatformAccount = {
      id: this.accountId++,
      platformId: twitterPlatform.id,
      name: "@TechDaily",
      username: "TechDaily",
      followerCount: 12400,
      active: true,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      metadata: { followersCount: 12400 }
    };
    this.platformAccounts.set(twitterAccount.id, twitterAccount);

    // Add content
    const content1: Content = {
      id: this.contentId++,
      title: "Top 10 AI Tools for Content Creators in 2023",
      description: "A comprehensive guide to the best AI tools for content creators in 2023.",
      contentType: "video",
      status: "published",
      filePath: "/content/videos/top-10-ai-tools.mp4",
      thumbnailPath: "/content/thumbnails/top-10-ai-tools.jpg",
      metadata: { duration: "12:45", views: 2400, likes: 187 },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    };
    this.contents.set(content1.id, content1);

    const content2: Content = {
      id: this.contentId++,
      title: "The Future of Self-Hosted AI Applications",
      description: "Exploring how AI can be used in self-hosted applications.",
      contentType: "image",
      status: "published",
      filePath: "/content/images/self-hosted-ai.jpg",
      thumbnailPath: "/content/thumbnails/self-hosted-ai.jpg",
      metadata: { likes: 845, comments: 32 },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    };
    this.contents.set(content2.id, content2);

    const content3: Content = {
      id: this.contentId++,
      title: "Building a Zero-Cost Content Creation Pipeline",
      description: "How to build a content creation pipeline with zero ongoing costs.",
      contentType: "text",
      status: "published",
      filePath: null,
      thumbnailPath: "/content/thumbnails/zero-cost-pipeline.jpg",
      metadata: { retweets: 126, likes: 248 },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    };
    this.contents.set(content3.id, content3);

    // Add scheduled posts
    const scheduledPost1: ScheduledPost = {
      id: this.postId++,
      contentId: this.contentId++,
      platformAccountId: twitterAccount.id,
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: "pending",
      postId: null,
      error: null
    };
    this.scheduledPosts.set(scheduledPost1.id, scheduledPost1);

    const scheduledPost2: ScheduledPost = {
      id: this.postId++,
      contentId: this.contentId++,
      platformAccountId: youtubeAccount.id,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      status: "pending",
      postId: null,
      error: null
    };
    this.scheduledPosts.set(scheduledPost2.id, scheduledPost2);

    const scheduledPost3: ScheduledPost = {
      id: this.postId++,
      contentId: this.contentId++,
      platformAccountId: instagramAccount.id,
      scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: "draft",
      postId: null,
      error: null
    };
    this.scheduledPosts.set(scheduledPost3.id, scheduledPost3);

    // Add trending topics
    const topic1: TrendingTopic = {
      id: this.topicId++,
      topic: "Open Source AI Models",
      category: "Tech",
      description: "Rising interest in locally hosted, free AI tools for content creators and developers.",
      trendScore: 78,
      discoveredAt: new Date()
    };
    this.trendingTopics.set(topic1.id, topic1);

    const topic2: TrendingTopic = {
      id: this.topicId++,
      topic: "Self-Hosted Content Creation",
      category: "Productivity",
      description: "Growing demand for subscription-free tools that work offline for creators.",
      trendScore: 65,
      discoveredAt: new Date()
    };
    this.trendingTopics.set(topic2.id, topic2);

    const topic3: TrendingTopic = {
      id: this.topicId++,
      topic: "Voice Generation Technology",
      category: "AI",
      description: "New advancements in high-quality offline voice synthesis for content creators.",
      trendScore: 92,
      discoveredAt: new Date()
    };
    this.trendingTopics.set(topic3.id, topic3);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Script methods
  async getScripts(): Promise<Script[]> {
    return Array.from(this.scripts.values());
  }

  async getScript(id: number): Promise<Script | undefined> {
    return this.scripts.get(id);
  }

  async getRecentScripts(limit: number): Promise<Script[]> {
    return Array.from(this.scripts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createScript(insertScript: InsertScript): Promise<Script> {
    const id = this.scriptId++;
    const script: Script = {
      id,
      content: insertScript.content,
      format: insertScript.format,
      title: insertScript.title,
      topic: insertScript.topic,
      status: insertScript.status || "draft",
      audioPath: insertScript.audioPath || null,
      duration: insertScript.duration || null,
      tone: insertScript.tone || null,
      targetAudience: insertScript.targetAudience || null,
      createdAt: new Date()
    };
    this.scripts.set(id, script);
    return script;
  }

  async updateScript(id: number, scriptUpdate: Partial<InsertScript>): Promise<Script | undefined> {
    const existingScript = this.scripts.get(id);
    if (!existingScript) return undefined;
    
    const updatedScript = { ...existingScript, ...scriptUpdate };
    this.scripts.set(id, updatedScript);
    return updatedScript;
  }

  async deleteScript(id: number): Promise<boolean> {
    return this.scripts.delete(id);
  }

  // AI Config methods
  async getAiConfigs(): Promise<AiConfig[]> {
    return Array.from(this.aiConfigs.values());
  }

  async getAiConfig(id: number): Promise<AiConfig | undefined> {
    return this.aiConfigs.get(id);
  }

  async getAiConfigsByType(modelType: string): Promise<AiConfig[]> {
    return Array.from(this.aiConfigs.values())
      .filter(config => config.modelType === modelType);
  }

  async createAiConfig(insertConfig: InsertAiConfig): Promise<AiConfig> {
    const id = this.aiConfigId++;
    const config: AiConfig = {
      id,
      name: insertConfig.name,
      modelType: insertConfig.modelType,
      modelName: insertConfig.modelName,
      active: insertConfig.active !== undefined ? insertConfig.active : true,
      settings: insertConfig.settings || {},
      capabilities: insertConfig.capabilities || {},
      lastUpdated: new Date(),
      downloadStatus: insertConfig.downloadStatus || "not_downloaded"
    };
    this.aiConfigs.set(id, config);
    return config;
  }

  async updateAiConfig(id: number, configUpdate: Partial<InsertAiConfig>): Promise<AiConfig | undefined> {
    const existingConfig = this.aiConfigs.get(id);
    if (!existingConfig) return undefined;
    
    const updatedConfig = { 
      ...existingConfig, 
      ...configUpdate,
      lastUpdated: new Date()
    };
    this.aiConfigs.set(id, updatedConfig);
    return updatedConfig;
  }

  async deleteAiConfig(id: number): Promise<boolean> {
    return this.aiConfigs.delete(id);
  }

  // Platform methods
  async getPlatforms(): Promise<Platform[]> {
    return Array.from(this.platforms.values());
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = this.platformId++;
    const platform: Platform = { 
      id,
      name: insertPlatform.name,
      active: insertPlatform.active !== undefined ? insertPlatform.active : true,
      icon: insertPlatform.icon
    };
    this.platforms.set(id, platform);
    return platform;
  }

  async updatePlatform(id: number, platform: Partial<InsertPlatform>): Promise<Platform | undefined> {
    const existingPlatform = this.platforms.get(id);
    if (!existingPlatform) return undefined;
    
    const updatedPlatform = { ...existingPlatform, ...platform };
    this.platforms.set(id, updatedPlatform);
    return updatedPlatform;
  }

  async deletePlatform(id: number): Promise<boolean> {
    return this.platforms.delete(id);
  }

  // Platform Account methods
  async getPlatformAccounts(): Promise<PlatformAccount[]> {
    return Array.from(this.platformAccounts.values());
  }

  async getPlatformAccount(id: number): Promise<PlatformAccount | undefined> {
    return this.platformAccounts.get(id);
  }

  async getPlatformAccountsByPlatform(platformId: number): Promise<PlatformAccount[]> {
    return Array.from(this.platformAccounts.values()).filter(
      account => account.platformId === platformId
    );
  }

  async createPlatformAccount(insertAccount: InsertPlatformAccount): Promise<PlatformAccount> {
    const id = this.accountId++;
    const account: PlatformAccount = { 
      id,
      name: insertAccount.name,
      username: insertAccount.username,
      active: insertAccount.active !== undefined ? insertAccount.active : true,
      platformId: insertAccount.platformId,
      accessToken: insertAccount.accessToken || null,
      refreshToken: insertAccount.refreshToken || null,
      tokenExpiry: insertAccount.tokenExpiry || null,
      followerCount: insertAccount.followerCount || null,
      metadata: insertAccount.metadata || {}
    };
    this.platformAccounts.set(id, account);
    return account;
  }

  async updatePlatformAccount(id: number, account: Partial<InsertPlatformAccount>): Promise<PlatformAccount | undefined> {
    const existingAccount = this.platformAccounts.get(id);
    if (!existingAccount) return undefined;
    
    const updatedAccount = { ...existingAccount, ...account };
    this.platformAccounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async deletePlatformAccount(id: number): Promise<boolean> {
    return this.platformAccounts.delete(id);
  }

  // Content methods
  async getContents(): Promise<Content[]> {
    return Array.from(this.contents.values());
  }

  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async getRecentContents(limit: number): Promise<Content[]> {
    return Array.from(this.contents.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.contentId++;
    const content: Content = { 
      id,
      title: insertContent.title,
      contentType: insertContent.contentType,
      status: insertContent.status || "draft",
      metadata: insertContent.metadata || {},
      description: insertContent.description || null,
      filePath: insertContent.filePath || null,
      thumbnailPath: insertContent.thumbnailPath || null,
      createdAt: new Date() 
    };
    this.contents.set(id, content);
    return content;
  }

  async updateContent(id: number, contentUpdate: Partial<InsertContent>): Promise<Content | undefined> {
    const existingContent = this.contents.get(id);
    if (!existingContent) return undefined;
    
    const updatedContent = { ...existingContent, ...contentUpdate };
    this.contents.set(id, updatedContent);
    return updatedContent;
  }

  async deleteContent(id: number): Promise<boolean> {
    return this.contents.delete(id);
  }

  // Scheduled Posts methods
  async getScheduledPosts(): Promise<ScheduledPost[]> {
    return Array.from(this.scheduledPosts.values());
  }

  async getScheduledPost(id: number): Promise<ScheduledPost | undefined> {
    return this.scheduledPosts.get(id);
  }

  async getUpcomingScheduledPosts(limit: number): Promise<ScheduledPost[]> {
    const now = new Date();
    return Array.from(this.scheduledPosts.values())
      .filter(post => post.scheduledTime > now)
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
      .slice(0, limit);
  }

  async createScheduledPost(insertPost: InsertScheduledPost): Promise<ScheduledPost> {
    const id = this.postId++;
    const post: ScheduledPost = { 
      id,
      contentId: insertPost.contentId,
      platformAccountId: insertPost.platformAccountId,
      scheduledTime: insertPost.scheduledTime,
      status: insertPost.status || "pending",
      postId: null,
      error: null
    };
    this.scheduledPosts.set(id, post);
    return post;
  }

  async updateScheduledPost(id: number, postUpdate: Partial<InsertScheduledPost>): Promise<ScheduledPost | undefined> {
    const existingPost = this.scheduledPosts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost = { ...existingPost, ...postUpdate };
    this.scheduledPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteScheduledPost(id: number): Promise<boolean> {
    return this.scheduledPosts.delete(id);
  }

  // Trending Topics methods
  async getTrendingTopics(): Promise<TrendingTopic[]> {
    return Array.from(this.trendingTopics.values());
  }

  async getTrendingTopic(id: number): Promise<TrendingTopic | undefined> {
    return this.trendingTopics.get(id);
  }

  async getTopTrendingTopics(limit: number): Promise<TrendingTopic[]> {
    return Array.from(this.trendingTopics.values())
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);
  }

  async createTrendingTopic(insertTopic: InsertTrendingTopic): Promise<TrendingTopic> {
    const id = this.topicId++;
    const topic: TrendingTopic = { 
      id,
      topic: insertTopic.topic,
      description: insertTopic.description || null,
      category: insertTopic.category,
      trendScore: insertTopic.trendScore,
      discoveredAt: new Date()
    };
    this.trendingTopics.set(id, topic);
    return topic;
  }

  async updateTrendingTopic(id: number, topicUpdate: Partial<InsertTrendingTopic>): Promise<TrendingTopic | undefined> {
    const existingTopic = this.trendingTopics.get(id);
    if (!existingTopic) return undefined;
    
    const updatedTopic = { ...existingTopic, ...topicUpdate };
    this.trendingTopics.set(id, updatedTopic);
    return updatedTopic;
  }

  async deleteTrendingTopic(id: number): Promise<boolean> {
    return this.trendingTopics.delete(id);
  }

  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    // In a real system, these would come from actual system metrics
    return {
      cpuUsage: 24,
      memoryUsage: 2.1,
      storageAvailable: 128,
      aiModelsLoaded: 5,
      isOnline: true
    };
  }
}

export const storage = new MemStorage();
