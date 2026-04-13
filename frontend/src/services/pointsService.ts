import { post } from './apiClient'
import type { ClaimPointsPayload, ClaimPointsResponse } from '../types'

export async function claimPoints(payload: ClaimPointsPayload): Promise<ClaimPointsResponse> {
  return post<ClaimPointsResponse>('/points/claim', payload)
}
