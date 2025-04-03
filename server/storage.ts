import {
  User, InsertUser, users,
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
  private platforms: Map<number, Platform>;
  private platformAccounts: Map<number, PlatformAccount>;
  private contents: Map<number, Content>;
  private scheduledPosts: Map<number, ScheduledPost>;
  private trendingTopics: Map<number, TrendingTopic>;
  
  private userId: number;
  private platformId: number;
  private accountId: number;
  private contentId: number;
  private postId: number;
  private topicId: number;

  constructor() {
    this.users = new Map();
    this.platforms = new Map();
    this.platformAccounts = new Map();
    this.contents = new Map();
    this.scheduledPosts = new Map();
    this.trendingTopics = new Map();

    this.userId = 1;
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

  // Platform methods
  async getPlatforms(): Promise<Platform[]> {
    return Array.from(this.platforms.values());
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = this.platformId++;
    const platform: Platform = { ...insertPlatform, id };
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
    const account: PlatformAccount = { ...insertAccount, id };
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
      ...insertContent, 
      id, 
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
      ...insertPost, 
      id,
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
      ...insertTopic, 
      id,
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
