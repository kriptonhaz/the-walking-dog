import { useQuery } from '@tanstack/react-query';
import { AIService, WalkRecommendationRequest, WalkRecommendationResponse } from '@/services/ai-api';

interface UseAiOpenRouterOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useAiOpenRouter(
  request: WalkRecommendationRequest | null,
  options: UseAiOpenRouterOptions = {}
) {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 30, // 30 minutes
    gcTime = 1000 * 60 * 60, // 1 hour
  } = options;

  return useQuery<WalkRecommendationResponse, Error>({
    queryKey: ['ai-walk-recommendation', request],
    queryFn: async () => {
      if (!request) {
        throw new Error('Request data is required');
      }
      return AIService.generateWalkRecommendation(request);
    },
    enabled: enabled && !!request,
    staleTime,
    gcTime,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export type { WalkRecommendationRequest, WalkRecommendationResponse };