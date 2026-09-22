export interface BusLocationUpdate {
  busId: number
  latitude: number
  longitude: number
  speed: number | null
  recordedAt: string
  tripStatus: string | null
}
