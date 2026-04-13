export type ShapeType =
  | 'rabbit_pellets'
  | 'twisted_rope'
  | 'banana_bro'
  | 'soft_serve'
  | 'splash_zone'

export type ColorType =
  | 'golden_standard'
  | 'dark_roast'
  | 'clay_warning'

export type FeelingType =
  | 'effortless'
  | 'could_have_been_more'
  | 'hard_won'

export type LocationType =
  | 'home'
  | 'office'
  | 'school'
  | 'outdoors'
  | 'car'
  | 'plane'
  | 'boat'

export interface LogEntry {
  id: string
  userId: string
  timestamp: string
  shape: ShapeType
  color?: ColorType
  feeling?: FeelingType
  contributingFactors?: string[]
  location?: LocationType
}

export interface CreateLogPayload {
  shape: ShapeType
  color?: ColorType
  feeling?: FeelingType
  contributingFactors?: string[]
  location?: LocationType
}

export interface ClaimPointsPayload {
  userId: string
  points: number
}

export interface ClaimPointsResponse {
  success: boolean
  error?: string
}
