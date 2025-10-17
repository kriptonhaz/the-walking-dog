import { aiApi } from "./api";

export interface AIMessage {
  role: "user" | "assistant" | "system";
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
  dogGender: "male" | "female";
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  location?: string;
}

export interface WalkRecommendationResponse {
  status: "success" | "error";
  dog: {
    breed: string;
    age: number;
    gender: "male" | "female";
  };
  weather: {
    temperature_c: number;
    condition: string;
  };
  recommendation: {
    distance_km: number;
    duration_min: number;
    intensity: "low" | "medium" | "high";
  };
  message: string;
}

export class AIService {
  private static readonly DEFAULT_MODEL = "z-ai/glm-4.5-air:free";

  static async generateWalkRecommendation(
    request: WalkRecommendationRequest
  ): Promise<WalkRecommendationResponse> {
    try {
      const systemPrompt = `#WALKING DOG ADVISOR SYSTEM
You are an assistant that helps dog owners determine the ideal walking distance and duration for their dogs based on breed, age, gender, and current weather.

##IMPORTANT GUIDELINES
IMPORTANT: DO NOT INCLUDE ANY TEXT OUTSIDE OF JSON!
Always respond **only** in JSON format.
Your output should be concise, accurate, and structured as follows:

{
  "status": "success",
  "dog": {
    "breed": "string",
    "age": number,
    "gender": "male" | "female"
  },
  "weather": {
    "temperature_c": number,
    "condition": "string"
  },
  "recommendation": {
    "distance_km": number,
    "duration_min": number,
    "intensity": "low" | "medium" | "high"
  },
  "message": "string (explain briefly why this distance and duration are recommended)"
}

##REASONING GUIDELINES
Base your reasoning on general canine health knowledge and breed-specific exercise needs.
Consider these factors:
- **Breed size & energy level:** High-energy or working breeds (e.g., Border Collie, Husky, Labrador) require longer walks.
- **Age:** Puppies and senior dogs need shorter walks.
- **Gender:** Usually minor difference, but males may need slightly more exercise.
- **Weather:** Hot or cold weather reduces safe walking duration.

If the weather is extreme (temperature < 5°C or > 30°C), reduce the recommended distance and include a warning in the message.`;

      const userPrompt = `Please recommend a walking plan for:
- Dog: ${request.dogBreed}, ${request.dogAge} years old, ${
        request.dogWeight
      }kg, ${request.dogGender}
- Weather: ${request.weather.temperature}°C, ${request.weather.condition}, ${
        request.weather.humidity
      }% humidity, ${request.weather.windSpeed} km/h wind
${request.location ? `- Location: ${request.location}` : ""}`;

      console.log("userPrompt", userPrompt);

      const messages: AIMessage[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];

      const response = await aiApi.post("chat/completions", {
        json: {
          model: this.DEFAULT_MODEL,
          messages,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "walk_recommendation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["success", "error"],
                    description: "Status of the recommendation",
                  },
                  dog: {
                    type: "object",
                    properties: {
                      breed: {
                        type: "string",
                        description: "Dog breed",
                      },
                      age: {
                        type: "number",
                        description: "Dog age in years",
                      },
                      gender: {
                        type: "string",
                        enum: ["male", "female"],
                        description: "Dog gender",
                      },
                    },
                    required: ["breed", "age", "gender"],
                    additionalProperties: false,
                  },
                  weather: {
                    type: "object",
                    properties: {
                      temperature_c: {
                        type: "number",
                        description: "Temperature in Celsius",
                      },
                      condition: {
                        type: "string",
                        description: "Weather condition description",
                      },
                    },
                    required: ["temperature_c", "condition"],
                    additionalProperties: false,
                  },
                  recommendation: {
                    type: "object",
                    properties: {
                      distance_km: {
                        type: "number",
                        description:
                          "Recommended walking distance in kilometers",
                      },
                      duration_min: {
                        type: "number",
                        description: "Recommended walking duration in minutes",
                      },
                      intensity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "Walking intensity level",
                      },
                    },
                    required: ["distance_km", "duration_min", "intensity"],
                    additionalProperties: false,
                  },
                  message: {
                    type: "string",
                    description:
                      "Brief explanation of why this distance and duration are recommended",
                  },
                },
                required: [
                  "status",
                  "dog",
                  "weather",
                  "recommendation",
                  "message",
                ],
                additionalProperties: false,
              },
            },
          },
          max_tokens: 500,
          temperature: 0.3,
        },
      });

      const data: AIResponse = await response.json();
      console.log("AI Response:", data);
      const content = data.choices[0]?.message?.content;
      console.log("AI Response Content:", content);

      if (content) {
        try {
          // Clean the content by removing markdown code blocks if present
          let cleanContent = content.trim();

          // Remove ```json and ``` markers if they exist
          if (cleanContent.startsWith("```json")) {
            cleanContent = cleanContent
              .replace(/^```json\s*/, "")
              .replace(/\s*```$/, "");
          } else if (cleanContent.startsWith("```")) {
            cleanContent = cleanContent
              .replace(/^```\s*/, "")
              .replace(/\s*```$/, "");
          }

          cleanContent = cleanContent.trim();
          console.log("Cleaned AI Response Content:", cleanContent);

          // Check if content is empty or incomplete
          if (!cleanContent || cleanContent.length < 10) {
            console.error(
              "AI response content is empty or too short:",
              cleanContent
            );
            return this.getDefaultRecommendation(request);
          }

          // Check if the response was truncated by looking at finish_reason
          const finishReason = data.choices[0]?.finish_reason;
          if (finishReason === "length") {
            console.warn("AI response was truncated due to max_tokens limit");
            // Try to parse anyway, but if it fails, use default
          }

          const parsedResponse = JSON.parse(cleanContent);

          // Validate that the parsed response has the required structure
          if (
            !parsedResponse.status ||
            !parsedResponse.dog ||
            !parsedResponse.recommendation
          ) {
            console.error(
              "AI response missing required fields:",
              parsedResponse
            );
            return this.getDefaultRecommendation(request);
          }

          return parsedResponse as WalkRecommendationResponse;
        } catch (parseError) {
          console.error("Failed to parse AI response:", parseError);
          console.error("Raw content:", content);
          return this.getDefaultRecommendation(request);
        }
      }

      return this.getDefaultRecommendation(request);
    } catch (error) {
      console.error("AI API error:", error);
      return this.getDefaultRecommendation(request);
    }
  }

  private static getDefaultRecommendation(
    request: WalkRecommendationRequest
  ): WalkRecommendationResponse {
    // Basic fallback logic
    const baseDistance =
      request.dogAge > 7 ? 1.5 : request.dogAge < 2 ? 1.0 : 2.5;
    const baseDuration = request.dogAge > 7 ? 20 : request.dogAge < 2 ? 15 : 30;

    return {
      status: "success",
      dog: {
        breed: request.dogBreed,
        age: request.dogAge,
        gender: request.dogGender,
      },
      weather: {
        temperature_c: request.weather.temperature,
        condition: request.weather.condition,
      },
      recommendation: {
        distance_km: baseDistance,
        duration_min: baseDuration,
        intensity: "medium",
      },
      message:
        "Default recommendation based on age and basic breed characteristics.",
    };
  }
}
