import { aiApi } from './api';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface WalkRecommendationRequest {
  dogBreed: string;
  dogAge: number;
  dogWeight: number;
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  location?: string;
}

export class AIService {
  private static readonly DEFAULT_MODEL = 'anthropic/claude-3-haiku';

  static async generateWalkRecommendation(request: WalkRecommendationRequest): Promise<string> {
    try {
      const systemPrompt = `You are a professional dog walking advisor. Provide personalized walking recommendations based on the dog's characteristics and current weather conditions. Keep responses concise and practical.`;

      const userPrompt = `Please recommend a walking plan for:
- Dog: ${request.dogBreed}, ${request.dogAge} years old, ${request.dogWeight}kg
- Weather: ${request.weather.temperature}°C, ${request.weather.condition}, ${request.weather.humidity}% humidity, ${request.weather.windSpeed} km/h wind
${request.location ? `- Location: ${request.location}` : ''}

Provide a brief recommendation including duration, intensity, and any special considerations.`;

      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      const response = await aiApi.post('chat/completions', {
        json: {
          model: this.DEFAULT_MODEL,
          messages,
          max_tokens: 200,
          temperature: 0.7,
        },
      });

      const data: AIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate recommendation at this time.';
    } catch (error) {
      console.error('AI API error:', error);
      throw new Error('Failed to generate AI recommendation');
    }
  }

  static async generateWalkingSuggestions(
    dogBreed: string,
    location?: string
  ): Promise<Array<{ title: string; description: string; duration: string; difficulty: string }>> {
    try {
      const systemPrompt = `You are a dog walking expert. Generate 3 diverse walking suggestions suitable for the given dog breed and location. Return as JSON array with title, description, duration, and difficulty fields.`;

      const userPrompt = `Generate 3 walking suggestions for a ${dogBreed}${location ? ` in ${location}` : ''}. Consider the breed's exercise needs and energy level.`;

      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      const response = await aiApi.post('chat/completions', {
        json: {
          model: this.DEFAULT_MODEL,
          messages,
          max_tokens: 400,
          temperature: 0.8,
        },
      });

      const data: AIResponse = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (content) {
        try {
          return JSON.parse(content);
        } catch {
          // Fallback if JSON parsing fails
          return this.getDefaultSuggestions();
        }
      }
      
      return this.getDefaultSuggestions();
    } catch (error) {
      console.error('AI suggestions error:', error);
      return this.getDefaultSuggestions();
    }
  }

  private static getDefaultSuggestions() {
    return [
      {
        title: 'Morning Park Walk',
        duration: '30 min',
        difficulty: 'Easy',
        description: 'Perfect weather for a relaxing walk in the park',
      },
      {
        title: 'Beach Trail',
        duration: '45 min',
        difficulty: 'Moderate',
        description: 'Great for active dogs who love water',
      },
      {
        title: 'Neighborhood Loop',
        duration: '20 min',
        difficulty: 'Easy',
        description: 'Quick walk around familiar streets',
      },
    ];
  }
}