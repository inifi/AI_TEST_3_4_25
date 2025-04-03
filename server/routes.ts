import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlatformSchema, insertPlatformAccountSchema, insertContentSchema, insertScheduledPostSchema, insertTrendingTopicSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = "/api";

  // System Status
  app.get(`${apiPrefix}/system-status`, async (req, res) => {
    try {
      const status = await storage.getSystemStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get system status", error: (error as Error).message });
    }
  });

  // Platforms
  app.get(`${apiPrefix}/platforms`, async (req, res) => {
    try {
      const platforms = await storage.getPlatforms();
      res.json(platforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to get platforms", error: (error as Error).message });
    }
  });

  app.get(`${apiPrefix}/platforms/:id`, async (req, res) => {
    try {
      const platform = await storage.getPlatform(Number(req.params.id));
      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }
      res.json(platform);
    } catch (error) {
      res.status(500).json({ message: "Failed to get platform", error: (error as Error).message });
    }
  });

  app.post(`${apiPrefix}/platforms`, async (req, res) => {
    try {
      const validatedData = insertPlatformSchema.parse(req.body);
      const platform = await storage.createPlatform(validatedData);
      res.status(201).json(platform);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create platform", error: (error as Error).message });
    }
  });

  app.put(`${apiPrefix}/platforms/:id`, async (req, res) => {
    try {
      const validatedData = insertPlatformSchema.partial().parse(req.body);
      const platform = await storage.updatePlatform(Number(req.params.id), validatedData);
      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }
      res.json(platform);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update platform", error: (error as Error).message });
    }
  });

  app.delete(`${apiPrefix}/platforms/:id`, async (req, res) => {
    try {
      const deleted = await storage.deletePlatform(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Platform not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete platform", error: (error as Error).message });
    }
  });

  // Platform Accounts
  app.get(`${apiPrefix}/platform-accounts`, async (req, res) => {
    try {
      const accounts = await storage.getPlatformAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get platform accounts", error: (error as Error).message });
    }
  });

  app.get(`${apiPrefix}/platform-accounts/:id`, async (req, res) => {
    try {
      const account = await storage.getPlatformAccount(Number(req.params.id));
      if (!account) {
        return res.status(404).json({ message: "Platform account not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to get platform account", error: (error as Error).message });
    }
  });

  app.get(`${apiPrefix}/platforms/:platformId/accounts`, async (req, res) => {
    try {
      const accounts = await storage.getPlatformAccountsByPlatform(Number(req.params.platformId));
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get platform accounts", error: (error as Error).message });
    }
  });

  app.post(`${apiPrefix}/platform-accounts`, async (req, res) => {
    try {
      const validatedData = insertPlatformAccountSchema.parse(req.body);
      const account = await storage.createPlatformAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create platform account", error: (error as Error).message });
    }
  });

  app.put(`${apiPrefix}/platform-accounts/:id`, async (req, res) => {
    try {
      const validatedData = insertPlatformAccountSchema.partial().parse(req.body);
      const account = await storage.updatePlatformAccount(Number(req.params.id), validatedData);
      if (!account) {
        return res.status(404).json({ message: "Platform account not found" });
      }
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update platform account", error: (error as Error).message });
    }
  });

  app.delete(`${apiPrefix}/platform-accounts/:id`, async (req, res) => {
    try {
      const deleted = await storage.deletePlatformAccount(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Platform account not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete platform account", error: (error as Error).message });
    }
  });

  // Content
  app.get(`${apiPrefix}/content`, async (req, res) => {
    try {
      const contents = await storage.getContents();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to get contents", error: (error as Error).message });
    }
  });

  app.get(`${apiPrefix}/content/recent`, async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 3;
      const contents = await storage.getRecentContents(limit);
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent contents", error: (error as Error).message });
    }
  });

  app.get(`${apiPrefix}/content/:id`, async (req, res) => {
    try {
      const content = await storage.getContent(Number(req.params.id));
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to get content", error: (error as Error).message });
    }
  });

  app.post(`${apiPrefix}/content`, async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create content", error: (error as Error).message });
    }
  });

  app.put(`${apiPrefix}/content/:id`, async (req, res) => {
    try {
      const validatedData = insertContentSchema.partial().parse(req.body);
      const content = await storage.updateContent(Number(req.params.id), validatedData);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update content", error: (error as Error).message });
    }
  });

  app.delete(`${apiPrefix}/content/:id`, async (req, res) => {
    try {
      const deleted = await storage.deleteContent(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content", error: (error as Error).message });
    }
  });

  // Scheduled Posts
  app.get(`${apiPrefix}/scheduled-posts`, async (req, res) => {
    try {
      const posts = await storage.getScheduledPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scheduled posts", error: (error as Error).message });
    }
  });

  app.get(`${apiPrefix}/scheduled-posts/upcoming`, async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 3;
      const posts = await storage.getUpcomingScheduledPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get upcoming scheduled posts", error: (error as Error).message });
    }
  });

  app.get(`${apiPrefix}/scheduled-posts/:id`, async (req, res) => {
    try {
      const post = await storage.getScheduledPost(Number(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Scheduled post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scheduled post", error: (error as Error).message });
    }
  });

  app.post(`${apiPrefix}/scheduled-posts`, async (req, res) => {
    try {
      const validatedData = insertScheduledPostSchema.parse(req.body);
      const post = await storage.createScheduledPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create scheduled post", error: (error as Error).message });
    }
  });

  app.put(`${apiPrefix}/scheduled-posts/:id`, async (req, res) => {
    try {
      const validatedData = insertScheduledPostSchema.partial().parse(req.body);
      const post = await storage.updateScheduledPost(Number(req.params.id), validatedData);
      if (!post) {
        return res.status(404).json({ message: "Scheduled post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update scheduled post", error: (error as Error).message });
    }
  });

  app.delete(`${apiPrefix}/scheduled-posts/:id`, async (req, res) => {
    try {
      const deleted = await storage.deleteScheduledPost(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Scheduled post not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete scheduled post", error: (error as Error).message });
    }
  });

  // Trending Topics
  app.get(`${apiPrefix}/trending-topics`, async (req, res) => {
    try {
      const topics = await storage.getTrendingTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trending topics", error: (error as Error).message });
    }
  });

  app.get(`${apiPrefix}/trending-topics/top`, async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 3;
      const topics = await storage.getTopTrendingTopics(limit);
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get top trending topics", error: (error as Error).message });
    }
  });

  app.get(`${apiPrefix}/trending-topics/:id`, async (req, res) => {
    try {
      const topic = await storage.getTrendingTopic(Number(req.params.id));
      if (!topic) {
        return res.status(404).json({ message: "Trending topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trending topic", error: (error as Error).message });
    }
  });

  app.post(`${apiPrefix}/trending-topics`, async (req, res) => {
    try {
      const validatedData = insertTrendingTopicSchema.parse(req.body);
      const topic = await storage.createTrendingTopic(validatedData);
      res.status(201).json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trending topic", error: (error as Error).message });
    }
  });

  app.put(`${apiPrefix}/trending-topics/:id`, async (req, res) => {
    try {
      const validatedData = insertTrendingTopicSchema.partial().parse(req.body);
      const topic = await storage.updateTrendingTopic(Number(req.params.id), validatedData);
      if (!topic) {
        return res.status(404).json({ message: "Trending topic not found" });
      }
      res.json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update trending topic", error: (error as Error).message });
    }
  });

  app.delete(`${apiPrefix}/trending-topics/:id`, async (req, res) => {
    try {
      const deleted = await storage.deleteTrendingTopic(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Trending topic not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trending topic", error: (error as Error).message });
    }
  });

  // API routes for API keys
  app.get(`${apiPrefix}/api-keys`, async (req, res) => {
    try {
      // In a real implementation, this would fetch from the database
      // For now, return mock data for UI testing
      const apiKeys = [
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
      res.json(apiKeys);
    } catch (error) {
      res.status(500).json({ message: "Failed to get API keys", error: (error as Error).message });
    }
  });

  app.post(`${apiPrefix}/api-keys`, async (req, res) => {
    try {
      // In a real implementation, this would save to the database
      // For now, return the input with an ID for UI testing
      const newKey = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
      };
      res.status(201).json(newKey);
    } catch (error) {
      res.status(500).json({ message: "Failed to create API key", error: (error as Error).message });
    }
  });

  app.put(`${apiPrefix}/api-keys/:id`, async (req, res) => {
    try {
      // In a real implementation, this would update the database
      // For now, return the input with the ID for UI testing
      const updatedKey = {
        id: Number(req.params.id),
        ...req.body,
        createdAt: req.body.createdAt || new Date().toISOString(),
      };
      res.json(updatedKey);
    } catch (error) {
      res.status(500).json({ message: "Failed to update API key", error: (error as Error).message });
    }
  });

  app.delete(`${apiPrefix}/api-keys/:id`, async (req, res) => {
    try {
      // In a real implementation, this would delete from the database
      // For now, just return success for UI testing
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete API key", error: (error as Error).message });
    }
  });

  // API routes for system settings
  app.get(`${apiPrefix}/system-settings`, async (req, res) => {
    try {
      // In a real implementation, this would fetch from the database
      // For now, return mock data for UI testing
      const settings = {
        // AI Configuration
        maxModelsLoaded: 5,
        aiContentQualityThreshold: 70,
        enableAIContentGeneration: true,
        
        // Content Storage
        storageLocation: "local",
        maxStorageUsage: 10,
        enableAutoCleanup: true,
        
        // Scheduling
        maxConcurrentPosts: 3,
        retryFailedPosts: true,
        maxPostRetries: 3,
        
        // Notifications
        enableEmailNotifications: false,
        emailAddress: "",
        notifyOnPostSuccess: true,
        notifyOnPostFailure: true,
        
        // System
        enableSystemMetrics: true,
        systemLanguage: "en",
        theme: "system",
      };
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get system settings", error: (error as Error).message });
    }
  });

  app.put(`${apiPrefix}/system-settings`, async (req, res) => {
    try {
      // In a real implementation, this would update the database
      // For now, return the input for UI testing
      res.json(req.body);
    } catch (error) {
      res.status(500).json({ message: "Failed to update system settings", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
