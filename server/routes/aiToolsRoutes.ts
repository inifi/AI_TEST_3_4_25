import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertAiConfigSchema, insertScriptSchema } from "@shared/schema";
import { z } from "zod";
import localLLM from "../services/zeroAI/localLLM";
import localTTS from "../services/zeroAI/localTTS";
import localImageGenerator from "../services/zeroAI/localImageGenerator";
import videoGenerator from "../services/zeroAI/videoGenerator";

export const aiToolsRouter = Router();

// AI Configs endpoints
aiToolsRouter.get("/ai-configs", async (_req: Request, res: Response) => {
  try {
    const configs = await storage.getAiConfigs();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.get("/ai-configs/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const config = await storage.getAiConfig(id);
    
    if (!config) {
      return res.status(404).json({ error: "AI Config not found" });
    }
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.get("/ai-configs/type/:type", async (req: Request, res: Response) => {
  try {
    const modelType = req.params.type;
    const configs = await storage.getAiConfigsByType(modelType);
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.post("/ai-configs", async (req: Request, res: Response) => {
  try {
    const validatedData = insertAiConfigSchema.parse(req.body);
    const newConfig = await storage.createAiConfig(validatedData);
    res.status(201).json(newConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.patch("/ai-configs/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const config = await storage.getAiConfig(id);
    
    if (!config) {
      return res.status(404).json({ error: "AI Config not found" });
    }
    
    const validatedData = insertAiConfigSchema.partial().parse(req.body);
    const updatedConfig = await storage.updateAiConfig(id, validatedData);
    res.json(updatedConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.delete("/ai-configs/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const config = await storage.getAiConfig(id);
    
    if (!config) {
      return res.status(404).json({ error: "AI Config not found" });
    }
    
    const success = await storage.deleteAiConfig(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(500).json({ error: "Failed to delete AI Config" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Scripts endpoints
aiToolsRouter.get("/scripts", async (_req: Request, res: Response) => {
  try {
    const scripts = await storage.getScripts();
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.get("/scripts/recent", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const scripts = await storage.getRecentScripts(limit);
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.get("/scripts/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const script = await storage.getScript(id);
    
    if (!script) {
      return res.status(404).json({ error: "Script not found" });
    }
    
    res.json(script);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.post("/scripts", async (req: Request, res: Response) => {
  try {
    const validatedData = insertScriptSchema.parse(req.body);
    const newScript = await storage.createScript(validatedData);
    res.status(201).json(newScript);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.patch("/scripts/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const script = await storage.getScript(id);
    
    if (!script) {
      return res.status(404).json({ error: "Script not found" });
    }
    
    const validatedData = insertScriptSchema.partial().parse(req.body);
    const updatedScript = await storage.updateScript(id, validatedData);
    res.json(updatedScript);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.delete("/scripts/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const script = await storage.getScript(id);
    
    if (!script) {
      return res.status(404).json({ error: "Script not found" });
    }
    
    const success = await storage.deleteScript(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(500).json({ error: "Failed to delete script" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// AI Service action endpoints
aiToolsRouter.post("/ai/generate-script", async (req: Request, res: Response) => {
  try {
    const { topic, format, length, tone, audience } = req.body;
    
    if (!topic || !format) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    
    const scriptContent = await localLLM.generateScript(
      topic, 
      format, 
      length || 5, 
      tone || "conversational", 
      audience || "general"
    );
    
    // Create a script record with the generated content
    const newScript = await storage.createScript({
      title: `${format.charAt(0).toUpperCase() + format.slice(1)} about ${topic}`,
      topic,
      format,
      content: scriptContent,
      duration: length ? length * 60 : 300, // Convert minutes to seconds
      tone,
      targetAudience: audience,
      status: "draft"
    });
    
    res.status(201).json(newScript);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.post("/ai/text-to-speech", async (req: Request, res: Response) => {
  try {
    const { scriptId, voice, format } = req.body;
    
    if (!scriptId) {
      return res.status(400).json({ error: "Missing scriptId parameter" });
    }
    
    const script = await storage.getScript(parseInt(scriptId));
    if (!script) {
      return res.status(404).json({ error: "Script not found" });
    }
    
    // Generate audio from the script
    const audioResult = await localTTS.scriptToAudio(
      script.content,
      (voice as any) || "professional-male",
      (format as any) || "mp3"
    );
    
    // Update the script with the audio path
    const updatedScript = await storage.updateScript(script.id, {
      audioPath: audioResult.audioPath,
      status: "finalized"
    });
    
    res.json({
      script: updatedScript,
      audio: {
        path: audioResult.audioPath,
        duration: audioResult.durationMs / 1000, // Convert to seconds
        format: audioResult.format
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.post("/ai/generate-video", async (req: Request, res: Response) => {
  try {
    const { scriptId, resolution, style, voiceType } = req.body;
    
    if (!scriptId) {
      return res.status(400).json({ error: "Missing scriptId parameter" });
    }
    
    const script = await storage.getScript(parseInt(scriptId));
    if (!script) {
      return res.status(404).json({ error: "Script not found" });
    }
    
    // Generate a video from the script
    const videoResult = await videoGenerator.generateVideo({
      script: script.content,
      title: script.title,
      voiceType: voiceType || "professional-male",
      resolution: (resolution as any) || "720p",
      style: (style as any) || "dynamic",
      thumbnailPrompt: `Thumbnail for ${script.title} about ${script.topic}`
    });
    
    // Create a content record for the generated video
    const newContent = await storage.createContent({
      title: script.title,
      description: `Auto-generated video about ${script.topic}`,
      contentType: "video",
      status: "ready",
      filePath: videoResult.videoPath,
      thumbnailPath: videoResult.thumbnailPath,
      metadata: {
        duration: videoResult.duration,
        format: videoResult.format,
        resolution: videoResult.resolution,
        scriptId: script.id
      }
    });
    
    // Update the script status
    await storage.updateScript(script.id, {
      status: "converted"
    });
    
    res.status(201).json({
      content: newContent,
      video: videoResult
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

aiToolsRouter.post("/ai/download-model", async (req: Request, res: Response) => {
  try {
    const { configId } = req.body;
    
    if (!configId) {
      return res.status(400).json({ error: "Missing configId parameter" });
    }
    
    const config = await storage.getAiConfig(parseInt(configId));
    if (!config) {
      return res.status(404).json({ error: "AI Config not found" });
    }
    
    // Update status to downloading
    await storage.updateAiConfig(config.id, {
      downloadStatus: "downloading"
    });
    
    // Simulate downloading the model based on type
    let success = false;
    
    if (config.modelType === "llm") {
      success = await localLLM.ensureModel(config.modelName as any);
    } else if (config.modelType === "tts") {
      success = await localTTS.downloadVoice(config.modelName);
    } else if (config.modelType === "image") {
      success = await localImageGenerator.ensureModel(config.modelName as any);
    }
    
    // Update status based on result
    const updatedConfig = await storage.updateAiConfig(config.id, {
      downloadStatus: success ? "available" : "failed"
    });
    
    res.json({
      config: updatedConfig,
      success
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// System status endpoint
aiToolsRouter.get("/system-status", async (_req: Request, res: Response) => {
  try {
    const status = await storage.getSystemStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});