/**
 * Zero-cost AI: Video Generator Service
 * 
 * This service creates complete videos from scripts using free,
 * locally-run tools and libraries with no API costs.
 */

import localTTS from './localTTS';
import localImageGenerator from './localImageGenerator';
import type { ImageSize } from './localImageGenerator';

// Video Types
type VideoFormat = 'mp4' | 'webm' | 'mov';
type VideoResolution = '720p' | '1080p' | '480p';
type VideoStyle = 'minimalist' | 'dynamic' | 'infographic' | 'cinematic';

// Script section types
interface ScriptSection {
  text: string;
  type: 'intro' | 'main' | 'section' | 'conclusion';
  title?: string;
  imagePrompt?: string;
}

// Video request parameters
interface VideoRequest {
  script: string | ScriptSection[];
  title: string;
  voiceType?: string;
  resolution?: VideoResolution;
  style?: VideoStyle;
  backgroundMusic?: string;
  outputFormat?: VideoFormat;
  thumbnailPrompt?: string;
  outputPath?: string;
}

// Video response
interface VideoResponse {
  videoPath: string;
  thumbnailPath: string;
  duration: number;
  format: VideoFormat;
  resolution: VideoResolution;
}

class VideoGenerator {
  private outputPath: string;
  private assetsPath: string;
  private templatesPath: string;
  private videoCounter: number = 1;
  private isProcessing: boolean = false;
  private readonly videoStyles: Record<VideoStyle, { name: string, description: string }> = {
    'minimalist': {
      name: 'Minimalist',
      description: 'Clean, simple designs with plenty of whitespace and minimal visual elements.'
    },
    'dynamic': {
      name: 'Dynamic',
      description: 'Energetic animations and transitions with bold visuals and movement.'
    },
    'infographic': {
      name: 'Infographic',
      description: 'Data-focused with charts, graphs, and information-rich visuals.'
    },
    'cinematic': {
      name: 'Cinematic',
      description: 'Dramatic, film-like aesthetics with advanced transitions and effects.'
    }
  };
  
  constructor() {
    this.outputPath = '/content/videos';
    this.assetsPath = '/content/assets';
    this.templatesPath = '/content/templates';
  }
  
  /**
   * Generate a complete video from a script
   */
  public async generateVideo(request: VideoRequest): Promise<VideoResponse> {
    this.isProcessing = true;
    
    try {
      // Process script
      const scriptSections = typeof request.script === 'string' 
        ? this.splitScriptIntoSections(request.script)
        : request.script;
      
      const scriptContent = typeof request.script === 'string'
        ? request.script
        : this.convertSectionsToScript(scriptSections);
        
      // Set defaults
      const resolution = request.resolution || '720p';
      const outputFormat = request.outputFormat || 'mp4';
      const style = request.style || 'dynamic';
      const voiceType = request.voiceType || 'professional-male';
      
      // 1. Generate audio from script
      console.log('Generating audio narration...');
      const audioResult = await localTTS.scriptToAudio(scriptContent, voiceType, 'mp3');
      
      // 2. Generate visual elements for each section
      console.log('Generating visual elements...');
      const visuals = await this.generateVisualElements(scriptSections, resolution);
      
      // 3. Generate a thumbnail
      console.log('Generating thumbnail...');
      const thumbnailPrompt = request.thumbnailPrompt || `Thumbnail for ${request.title}`;
      const thumbnail = await localImageGenerator.generateThumbnail(thumbnailPrompt);
      
      // 4. Compile the video
      console.log('Compiling video...');
      const videoPath = await this.compileVideo(
        audioResult.audioPath,
        visuals,
        resolution,
        style,
        request.title,
        outputFormat
      );
      
      // Calculate the duration based on audio + buffer
      const duration = Math.ceil(audioResult.durationMs / 1000) + 5; // Add 5 seconds buffer
      
      this.isProcessing = false;
      return {
        videoPath,
        thumbnailPath: thumbnail.thumbnailPath,
        duration,
        format: outputFormat,
        resolution
      };
    } catch (error) {
      this.isProcessing = false;
      throw error;
    }
  }
  
  /**
   * Convert script sections to a full script
   */
  private convertSectionsToScript(sections: ScriptSection[]): string {
    return sections.map(section => {
      if (section.type === 'intro') {
        return `# INTRODUCTION\n\n${section.text}`;
      } else if (section.type === 'conclusion') {
        return `# CONCLUSION\n\n${section.text}`;
      } else if (section.type === 'section' && section.title) {
        return `# ${section.title.toUpperCase()}\n\n${section.text}`;
      } else {
        return section.text;
      }
    }).join('\n\n');
  }
  
  /**
   * Split a script string into sections for processing
   */
  private splitScriptIntoSections(script: string): ScriptSection[] {
    const sections: ScriptSection[] = [];
    
    // Split by markdown headers or double newlines
    const parts = script.split(/^#\s+([^\n]+)$/gm);
    
    if (parts.length <= 1) {
      // No headers found, treat as a single section
      return [{
        text: script.trim(),
        type: 'main'
      }];
    }
    
    // First part is content before any header
    let currentText = parts[0].trim();
    if (currentText) {
      sections.push({
        text: currentText,
        type: 'intro'
      });
    }
    
    // Process headers and their content
    for (let i = 1; i < parts.length; i += 2) {
      const title = parts[i].trim();
      const content = (parts[i + 1] || '').trim();
      
      // Skip empty sections
      if (!content) continue;
      
      if (title.toLowerCase().includes('intro')) {
        sections.push({
          text: content,
          type: 'intro',
          title
        });
      } else if (title.toLowerCase().includes('conclu')) {
        sections.push({
          text: content,
          type: 'conclusion',
          title
        });
      } else {
        sections.push({
          text: content,
          type: 'section',
          title
        });
      }
    }
    
    return sections;
  }
  
  /**
   * Generate visual elements for each section of the script
   */
  private async generateVisualElements(sections: ScriptSection[], resolution: VideoResolution): Promise<string[]> {
    // Extract image prompts or generate them from sections
    const imagePrompts = sections.map(section => {
      if (section.imagePrompt) {
        return section.imagePrompt;
      }
      
      // Generate a prompt based on the section content and type
      let basePrompt = '';
      
      if (section.title) {
        basePrompt = `Visual representing "${section.title}". `;
      } else if (section.type === 'intro') {
        basePrompt = 'Visual introduction representing the main topic. ';
      } else if (section.type === 'conclusion') {
        basePrompt = 'Visual conclusion summarizing the key points. ';
      } else {
        // Extract the first sentence as context
        const firstSentence = section.text.split(/[.!?]/).shift() || '';
        basePrompt = `Visual for: "${firstSentence.substring(0, 100)}". `;
      }
      
      return basePrompt + 'Professional, clean composition, high quality for video presentation.';
    });
    
    // Map resolution string to actual dimensions
    const sizeMap: Record<VideoResolution, ImageSize> = {
      '480p': '512x512',
      '720p': '1280x720',
      '1080p': '1920x1080'
    };
    
    const imageSize = sizeMap[resolution] || '1280x720';
    
    // Generate frames based on prompts
    const visualPaths: string[] = [];
    
    for (const prompt of imagePrompts) {
      const result = await localImageGenerator.generateImage({
        prompt,
        size: imageSize as any,
        style: 'artistic'
      });
      
      visualPaths.push(result.imagePath);
    }
    
    return visualPaths;
  }
  
  /**
   * Compile the final video using visual elements and audio
   */
  private async compileVideo(
    audioPath: string,
    visualPaths: string[],
    resolution: VideoResolution,
    style: VideoStyle,
    title: string,
    format: VideoFormat
  ): Promise<string> {
    // In a real implementation, this would:
    // 1. Use ffmpeg to combine audio and visuals
    // 2. Add transitions based on style
    // 3. Add text overlays for sections
    // 4. Render to the specified format and resolution
    
    // For simulation, we'll just return a path
    const timestamp = Date.now();
    const filename = `video_${this.videoCounter++}_${timestamp}.${format}`;
    const videoPath = `${this.outputPath}/${filename}`;
    
    // Simulate processing time based on resolution and number of visuals
    const resolutionFactor = resolution === '1080p' ? 2 : (resolution === '720p' ? 1.5 : 1);
    const processingTime = Math.min(5000, 1000 + (visualPaths.length * 300 * resolutionFactor));
    
    // Return the simulated path after delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(videoPath);
      }, processingTime);
    });
  }
  
  /**
   * Check if ffmpeg is available (for video processing)
   */
  public async checkFfmpeg(): Promise<boolean> {
    // In a real implementation, this would:
    // Run `ffmpeg -version` and check the output
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  }
  
  /**
   * Get video template styles
   */
  public getVideoTemplates(): Array<{id: string, name: string, description: string}> {
    return Object.entries(this.videoStyles).map(([id, info]) => ({
      id,
      name: info.name,
      description: info.description
    }));
  }
}

// For convenience, export as a singleton
export default new VideoGenerator();

// Also export type definitions
export type {
  VideoFormat,
  VideoResolution,
  VideoStyle,
  ScriptSection,
  VideoRequest,
  VideoResponse
};