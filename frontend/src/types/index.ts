export type ShapeType =
  | 'type_lumpy'
  | 'type_ideal'
  | 'type_mushy'
  | 'type_watery'

export type ColorType =
  | 'color_brown'
  | 'color_yellow'
  | 'color_green'
  | 'color_black'
  | 'color_red'

export type FeelingType =
  | 'feel_smooth'
  | 'feel_leftover'
  | 'feel_struggle'
  | 'feel_explosive'
  | 'feel_stealth'

export type CauseType =
  | 'cause_spicy'
  | 'cause_caffeine_alcohol'
  | 'cause_stress_sleep'
  | 'cause_meds'
  | 'cause_travel'
  | 'cause_other'

export type LocationType =
  | 'place_home'
  | 'place_office'
  | 'place_public'
  | 'place_mall'
  | 'place_transit'
  | 'place_outdoor'

export interface LogEntry {
  id: string
  userId: string
  timestamp: string
  shape: ShapeType
  color?: ColorType
  feeling?: FeelingType
  contributingFactors?: CauseType[]
  location?: LocationType
}

export interface CreateLogPayload {
  shape: ShapeType
  color?: ColorType
  feeling?: FeelingType
  contributingFactors?: CauseType[]
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
