import { useUser } from "../context/AuthContext";
import { FREE_DAILY_LIMIT, PRO_DAILY_LIMIT } from "../lib/tokens";

export function useTokens() {
  const { profile, refreshProfile } = useUser();

  const isEnterprise = profile?.plan === 'enterprise';
  const isPro        = profile?.plan === 'pro';
  const dailyLimit   = isPro ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT;
  const used         = profile?.daily_tokens_used ?? 0;
  const remaining    = isEnterprise ? Infinity : Math.max(0, dailyLimit - used);
  const percentage   = isEnterprise ? 100 : Math.round((used / dailyLimit) * 100);
  const isExhausted  = !isEnterprise && remaining === 0;

  return { isPro, isEnterprise, dailyLimit, used, remaining, percentage, isExhausted, refreshProfile };
}
