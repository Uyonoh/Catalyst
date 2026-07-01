import { useUser } from "../context/AuthContext";
import { FREE_WEEKLY_LIMIT, BASIC_WEEKLY_LIMIT, PLUS_WEEKLY_LIMIT, PRO_WEEKLY_LIMIT, tierLimits } from "../lib/tokens";

export function useTokens() {
  const { profile, refreshProfile } = useUser();

  const isUltra = profile?.plan === 'ultra';
  const isSubscribed        = profile?.plan !== 'free';
  const weeklyLimit   = tierLimits[profile?.plan ?? "free"]; 
  const used         = profile?.tokens_used ?? 0;
  const bonusTokens  = profile?.bonus_tokens ?? 0;
  const remaining    = isUltra ? Infinity : Math.max(0, weeklyLimit - used + bonusTokens);
  const percentage   = isUltra ? 100 : Math.round((used / weeklyLimit) * 100);
  const isExhausted  = !isUltra && remaining === 0;

  return { isSubscribed, isUltra, weeklyLimit, used, bonusTokens, remaining, percentage, isExhausted, refreshProfile };
}
