import { Client, type IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import type { BusLocationUpdate } from "@/types/models/location"

const getWsBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ""
  return apiUrl.replace(/\/+$/, "").replace(/\/api$/, "") + "/ws"
}

type LocationHandler = (update: BusLocationUpdate) => void

class LocationSocket {
  private client: Client | null = null
  private subscribers = new Map<number, LocationHandler[]>()
  private topicSubscriptions = new Map<number, () => void>()

  private getToken() {
    if (typeof window === "undefined") return ""
    return window.localStorage.getItem("auth_token") ?? ""
  }

  private ensureConnected() {
    if (this.client) return
    const token = this.getToken()
    if (!token) return

    const client = new Client({
      webSocketFactory: () => new SockJS(`${getWsBaseUrl()}?token=${token}`) as unknown as WebSocket,
      reconnectDelay: 5000,
      onConnect: () => this.resubscribeAll(),
    })
    this.client = client
    client.activate()
  }

  private resubscribeAll() {
    if (!this.client?.connected) return
    for (const busId of this.subscribers.keys()) {
      this.subscribeTopic(busId)
    }
  }

  private subscribeTopic(busId: number) {
    if (!this.client?.connected) return
    if (this.topicSubscriptions.has(busId)) return

    const subscription = this.client.subscribe(`/topic/bus/${busId}`, (message: IMessage) => {
      this.handleMessage(message)
    })
    this.topicSubscriptions.set(busId, () => subscription.unsubscribe())
  }

  private handleMessage(message: IMessage) {
    try {
      const update = JSON.parse(message.body) as BusLocationUpdate
      if (typeof update?.busId !== "number") return
      const handlers = this.subscribers.get(update.busId)
      if (!handlers) return
      for (const handler of handlers) {
        handler(update)
      }
    } catch {
      // ignore malformed frames
    }
  }

  subscribe(busId: number, handler: LocationHandler) {
    const handlers = this.subscribers.get(busId) ?? []
    handlers.push(handler)
    this.subscribers.set(busId, handlers)

    this.ensureConnected()
    if (this.client?.connected) {
      this.subscribeTopic(busId)
    }
  }

  unsubscribe(busId: number, handler: LocationHandler) {
    const handlers = this.subscribers.get(busId) ?? []
    const next = handlers.filter((h) => h !== handler)
    if (next.length > 0) {
      this.subscribers.set(busId, next)
      return
    }
    this.subscribers.delete(busId)
    const cancel = this.topicSubscriptions.get(busId)
    if (cancel) {
      cancel()
      this.topicSubscriptions.delete(busId)
    }
  }

  disconnect() {
    this.topicSubscriptions.forEach((cancel) => cancel())
    this.topicSubscriptions.clear()
    this.subscribers.clear()
    this.client?.deactivate()
    this.client = null
  }
}

export const locationSocket = new LocationSocket()
