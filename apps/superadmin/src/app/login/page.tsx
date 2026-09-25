"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { loginUser } from "@bustrack/api-client/services/auth-service"
import { AuthProvider } from "@/store/auth-context"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: (body: LoginFormValues) => loginUser(body),
    onSuccess: (res) => {
      const { accessToken, user } = res.data
      localStorage.setItem("auth_token", accessToken!)
      localStorage.setItem("auth_user", JSON.stringify(user))
      window.dispatchEvent(new StorageEvent("storage"))
      toast.success("Welcome back")
      router.replace("/")
    },
    onError: (err) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Login failed"
      toast.error(message)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-sheet">
        <div className="card-body items-center gap-6 py-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-content text-2xl font-bold shadow-sm">
            S
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">BusTrack</h1>
            <p className="mt-1 text-sm text-base-content/60">Super Admin Console</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4"
          >
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@schoolbus.com"
                className="input input-bordered w-full"
              />
              {errors.email && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </div>
              )}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full"
              />
              {errors.password && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </div>
              )}
            </label>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
