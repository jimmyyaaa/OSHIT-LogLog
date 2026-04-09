import type { RewardAction } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

const REWARD_TOAST: Record<RewardAction, string> = {
  daily_log:           '🪙 +1 SHIT 已到账',
  streak_3:            '🔥 连续3天！+3 SHIT',
  streak_7:            '⚡ 连续7天！+7 SHIT',
  streak_30:           '👑 连续30天！+30 SHIT',
  first_ideal_shape:   '🍌 首次香蕉君！+5 SHIT',
  week_complete:       '📅 本周全勤！+10 SHIT',
  first_report_shared: '📊 首次分享周报！+15 SHIT',
}

export const tokenService = {
  // Returns the toast message if reward succeeded, null if failed
  async dispatchReward(userId: string, action: RewardAction): Promise<string | null> {
    try {
      const res = await fetch(`${API_BASE}/token/reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      const data = await res.json()
      if (data.success) return REWARD_TOAST[action]
      return null
    } catch {
      return null
    }
  },
}
