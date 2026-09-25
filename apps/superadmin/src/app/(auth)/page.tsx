"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Building2, School, Users, ShieldCheck, Menu } from "lucide-react"
import { createSchoolAdmin } from "@bustrack/api-client/services/superadmin-users-service"
import type { CreateSchoolAdminRequest } from "@bustrack/types/models/platform-user"
import { useAuth } from "@/store/auth-context"

const createAdminSchema = z.object({
  schoolId: z.number().int().positive("School ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type CreateAdminFormValues = z.infer<typeof createAdminSchema>

export default function SuperAdminConsole() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (body: CreateSchoolAdminRequest) => createSchoolAdmin(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["superadmin", "schools"] })
      toast.success("School admin created")
      reset()
    },
    onError: () => toast.error("Failed to create school admin"),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
  })

  const onSubmit = (data: CreateAdminFormValues) => {
    createMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/80 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-content text-sm font-bold">
              S
            </div>
            <span className="font-semibold">BusTrack</span>
            <span className="badge badge-outline badge-sm">Super Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-base-content/60 sm:block">{user?.email}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral text-neutral-content text-xs font-semibold">
              {user?.email?.charAt(0)?.toUpperCase() ?? "S"}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid w-full gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:flex flex-col gap-0.5">
            <div className="flex items-center gap-2 rounded-lg bg-base-100 px-3 py-2.5 text-sm font-medium">
              <School size={16} className="text-primary" />
              Schools
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-base-content/50 hover:bg-base-100/50 rounded-lg text-sm">
              <Users size={16} />
              School Admins
            </div>
          </aside>

          <main className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="card bg-base-100">
                <div className="card-body gap-0 p-4">
                  <div className="flex items-center gap-2 text-base-content/50">
                    <Building2 size={16} />
                    <span className="t-micro">Total Schools</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">—</p>
                </div>
              </div>
              <div className="card bg-base-100">
                <div className="card-body gap-0 p-4">
                  <div className="flex items-center gap-2 text-base-content/50">
                    <Users size={16} />
                    <span className="t-micro">School Admins</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">—</p>
                </div>
              </div>
              <div className="card bg-base-100">
                <div className="card-body gap-0 p-4">
                  <div className="flex items-center gap-2 text-base-content/50">
                    <ShieldCheck size={16} />
                    <span className="t-micro">Platform Health</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-success">Ok</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sheet">
              <div className="card-body gap-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">Create School Admin</h1>
                    <p className="mt-1 text-sm text-base-content/60">
                      Provision an admin account scoped to a single school.
                    </p>
                  </div>
                  <div className="badge badge-outline gap-1">
                    <span className="badge badge-primary badge-xs">SUPER_ADMIN</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">School ID</span>
                      </div>
                      <input
                        {...register("schoolId", { valueAsNumber: true })}
                        type="number"
                        placeholder="123"
                        className="input input-bordered w-full"
                      />
                      {errors.schoolId && (
                        <div className="label">
                          <span className="label-text-alt text-error">{errors.schoolId.message}</span>
                        </div>
                      )}
                    </label>
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Admin name</span>
                      </div>
                      <input
                        {...register("name")}
                        placeholder="Jane Admin"
                        className="input input-bordered w-full"
                      />
                      {errors.name && (
                        <div className="label">
                          <span className="label-text-alt text-error">{errors.name.message}</span>
                        </div>
                      )}
                    </label>
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Email</span>
                      </div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="admin@school.edu"
                        className="input input-bordered w-full"
                      />
                      {errors.email && (
                        <div className="label">
                          <span className="label-text-alt text-error">{errors.email.message}</span>
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
                        placeholder="Min 6 characters"
                        className="input input-bordered w-full"
                      />
                      {errors.password && (
                        <div className="label">
                          <span className="label-text-alt text-error">{errors.password.message}</span>
                        </div>
                      )}
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary mt-2 w-full sm:w-auto" disabled={createMutation.isPending}>
                    {createMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Create School Admin"}
                  </button>
                </form>
              </div>
            </div>

            <p className="t-micro text-base-content/40">
              Platform-wide school CRUD and district KPIs are not yet part of the API contract —
              only <code className="rounded bg-black/5 px-1 py-0.5">create-admin</code> is live.
            </p>
          </main>
        </div>
      </div>
    </div>
  )
}
