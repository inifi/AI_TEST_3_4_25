import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Scripts
export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  topic: text("topic").notNull(),
  format: text("format").notNull(), // video, podcast, short, etc.
  content: text("content").notNull(), // full script text
  duration: integer("duration"), // estimated duration in seconds
  tone: text("tone"), // casual, professional, educational, etc.
  targetAudience: text("target_audience"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  audioPath: text("audio_path"), // path to generated audio file if TTS was applied
  status: text("status").notNull().default("draft"), // draft, finalized, converted
});

export const insertScriptSchema = createInsertSchema(scripts).pick({
  title: true,
  topic: true,
  format: true,
  content: true,
  duration: true,
  tone: true,
  targetAudience: true,
  audioPath: true,
  status: true,
});

// AI Configuration
export const aiConfigs = pgTable("ai_configs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  modelType: text("model_type").notNull(), // llm, tts, image, video
  modelName: text("model_name").notNull(),
  active: boolean("active").notNull().default(true),
  settings: jsonb("settings"), // settings specific to this model type
  capabilities: jsonb("capabilities"), // what this model can do
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  downloadStatus: text("download_status").default("not_downloaded"), // not_downloaded, downloading, available
});

export const insertAiConfigSchema = createInsertSchema(aiConfigs).pick({
  name: true,
  modelType: true,
  modelName: true,
  active: true,
  settings: true,
  capabilities: true,
  downloadStatus: true,
});

// Platforms
export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  active: boolean("active").notNull().default(true),
});

export const insertPlatformSchema = createInsertSchema(platforms).pick({
  name: true,
  icon: true,
  active: true,
});

// Platform Accounts
export const platformAccounts = pgTable("platform_accounts", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id").notNull(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  followerCount: integer("follower_count"),
  active: boolean("active").notNull().default(true),
  metadata: jsonb("metadata"),
});

export const insertPlatformAccountSchema = createInsertSchema(platformAccounts).pick({
  platformId: true,
  name: true,
  username: true,
  accessToken: true,
  refreshToken: true,
  tokenExpiry: true,
  followerCount: true,
  active: true,
  metadata: true,
});

// Content
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(), // video, image, text, etc.
  status: text("status").notNull().default("draft"), // draft, published, scheduled
  filePath: text("file_path"), // local path to content file
  thumbnailPath: text("thumbnail_path"), // local path to thumbnail
  metadata: jsonb("metadata"), // additional metadata like duration, tags, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContentSchema = createInsertSchema(content).pick({
  title: true,
  description: true,
  contentType: true,
  status: true,
  filePath: true,
  thumbnailPath: true,
  metadata: true,
});

// Scheduled Posts
export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  platformAccountId: integer("platform_account_id").notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  status: text("status").notNull().default("pending"), // pending, posted, failed
  postId: text("post_id"), // ID of the post on the platform after publishing
  error: text("error"), // Error message if posting failed
});

export const insertScheduledPostSchema = createInsertSchema(scheduledPosts).pick({
  contentId: true,
  platformAccountId: true,
  scheduledTime: true,
  status: true,
});

// Trending Topics
export const trendingTopics = pgTable("trending_topics", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  trendScore: integer("trend_score").notNull(),
  discoveredAt: timestamp("discovered_at").notNull().defaultNow(),
});

export const insertTrendingTopicSchema = createInsertSchema(trendingTopics).pick({
  topic: true,
  category: true,
  description: true,
  trendScore: true,
});

// Define type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Script = typeof scripts.$inferSelect;
export type InsertScript = z.infer<typeof insertScriptSchema>;

export type AiConfig = typeof aiConfigs.$inferSelect;
export type InsertAiConfig = z.infer<typeof insertAiConfigSchema>;

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;

export type PlatformAccount = typeof platformAccounts.$inferSelect;
export type InsertPlatformAccount = z.infer<typeof insertPlatformAccountSchema>;

export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPost = z.infer<typeof insertScheduledPostSchema>;

export type TrendingTopic = typeof trendingTopics.$inferSelect;
export type InsertTrendingTopic = z.infer<typeof insertTrendingTopicSchema>;
