"use client"

import { useMemo, useCallback, useRef, useEffect } from "react"
import { useJsApiLoader, GoogleMap, OverlayView } from "@react-google-maps/api"
import { Bus } from "lucide-react"
import type { BusLiveResponse } from "@/types/models/bus"

const containerStyle = {
  width: "100%",
  height: "100%",
}

const DEFAULT_CENTER = { lat: 42.36, lng: -71.06 }
const DEFAULT_ZOOM = 13

interface DashboardMapProps {
  buses: BusLiveResponse[]
  selectedBusId?: number | null
  onBusSelect?: (busId: number) => void
}

function BusMapMarker({
  bus,
  selected,
  onClick,
}: {
  bus: BusLiveResponse & { latitude: number; longitude: number }
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <OverlayView
      position={{ lat: bus.latitude, lng: bus.longitude }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({ x: -(width / 2), y: -height })}
    >
      <button
        type="button"
        className="flex flex-col items-center cursor-pointer"
        aria-label={`Select ${bus.displayId}`}
        onClick={onClick}
      >
        <div className="relative">
          <div
            className={`absolute -inset-2 rounded-full transition-all duration-300 ${
              selected ? "bg-primary/20 scale-150" : "bg-primary/10"
            }`}
          />
          <div
            className={`relative flex items-center justify-center rounded-full shadow-sm transition-all duration-300 ${
              selected ? "h-10 w-10 bg-primary shadow-lg scale-110" : "h-8 w-8 bg-primary shadow-sm"
            }`}
          >
            <Bus size={selected ? 18 : 16} className="text-white" />
          </div>
        </div>
        <span
          className={`mt-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium shadow-sm transition-all duration-200 ${
            selected
              ? "bg-primary text-primary-content"
              : "bg-base-100 text-base-content"
          }`}
        >
          {bus.displayId}
        </span>
      </button>
    </OverlayView>
  )
}

export function DashboardMap({ buses, selectedBusId, onBusSelect }: DashboardMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
  })

  const mapOptions = useMemo(
    () => ({
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    }),
    [],
  )

  const positioned = useMemo(() => buses.filter((b) => b.latitude != null && b.longitude != null), [buses])

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedBusId) return
    const bus = positioned.find((b) => b.busId === selectedBusId)
    if (bus && bus.latitude != null && bus.longitude != null) {
      map.panTo({ lat: bus.latitude, lng: bus.longitude })
      map.setZoom(15)
    }
  }, [selectedBusId, positioned])

  if (!isLoaded) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-box bg-base-200 lg:h-[400px]">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-box bg-base-100 shadow-card">
      <div className="h-[300px] lg:h-[400px]">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {positioned.map((b) => (
            <BusMapMarker
              key={b.busId}
              bus={b as BusLiveResponse & { latitude: number; longitude: number }}
              selected={b.busId === selectedBusId}
              onClick={() => onBusSelect?.(b.busId)}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  )
}
