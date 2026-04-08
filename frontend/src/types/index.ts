export type ShapeType =
  | 'rabbit_pellets'
  | 'twisted_rope'
  | 'banana_bro'
  | 'soft_serve'
  | 'splash_zone'

export type FeelingType =
  | 'effortless'
  | 'could_have_been_more'
  | 'hard_won'

export interface LogEntry {
  id: string
  timestamp: number
  shape: ShapeType
  feeling?: FeelingType
}

export type RewardAction =
  | 'daily_log'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'first_ideal_shape'
  | 'week_complete'
  | 'first_report_shared'
