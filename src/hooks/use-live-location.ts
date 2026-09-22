"use client"

import { useCallback, useEffect, useState } from "react"
import { locationSocket } from "@/lib/location-socket"
import type { BusLocationUpdate } from "@/types/models/location"

const useLiveLocation = () => {
  const useLiveLocationUpdates = (busIds: number[]) => {
    const [positions, setPositions] = useState<Record<number, BusLocationUpdate>>({})

    const handleUpdate = useCallback((update: BusLocationUpdate) => {
      setPositions((prev) => ({ ...prev, [update.busId]: update }))
    }, [])

    useEffect(() => {
      if (busIds.length === 0) return
      for (const busId of busIds) {
        locationSocket.subscribe(busId, handleUpdate)
      }
      return () => {
        for (const busId of busIds) {
          locationSocket.unsubscribe(busId, handleUpdate)
        }
      }
    }, [busIds, handleUpdate])

    return positions
  }

  return { useLiveLocationUpdates }
}

export default useLiveLocation
