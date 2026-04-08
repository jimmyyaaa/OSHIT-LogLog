import type { RewardAction } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export const tokenService = {
  async dispatchReward(userId: string, action: RewardAction): Promise<void> {
    try {
      await fetch(`${API_BASE}/api/token/reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
    } catch {
      // Non-blocking: token reward failure should not interrupt the user flow
    }
  },
}
