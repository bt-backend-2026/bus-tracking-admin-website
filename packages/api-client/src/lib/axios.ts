import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"
import { API_ENDPOINTS } from "../constants/api-endpoints"
import { refreshToken } from "../services/auth-service"

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

interface FailedRequest {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

axiosClient.interceptors.request.use((config) => {
  if (config.url?.includes(API_ENDPOINTS.LOGIN)) {
    return config
  }
  const token = localStorage.getItem("auth_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    const isAuthError = error.response?.status === 401
    const isLoginRequest = originalRequest.url?.includes(API_ENDPOINTS.LOGIN)
    const isRefreshRequest = originalRequest.url?.includes(API_ENDPOINTS.REFRESH)
    const alreadyRetried = originalRequest._retry

    if (isAuthError && !isLoginRequest && !isRefreshRequest && !alreadyRetried) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshToken()
        localStorage.setItem("auth_token", newToken)
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
