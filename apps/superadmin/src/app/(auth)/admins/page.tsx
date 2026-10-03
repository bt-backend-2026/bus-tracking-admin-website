"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import { Breadcrumbs } from "@bustrack/ui"
import useSuperAdminUsers from "@bustrack/hooks/use-superadmin-users"
import useSchool from "@bustrack/hooks/use-school"
import { getApiErrorMessage } from "../auth-errors"

// Mirrors the backend CreateAdminRequest. password is @Size(min = 8) server
// side, so the client floor must match or short passwords fail only on submit.
const createAdminSchema = z.object({
  schoolId: z.number({ message: "School ID is required" }).int().positive("School ID is required"),
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().trim().optional(),
})

type CreateAdminFormValues = z.infer<typeof createAdminSchema>

function AdminForm({ defaultSchoolId }: { defaultSchoolId?: number }) {
  const { useCreateSchoolAdmin } = useSuperAdminUsers()
  const { useSchoolList } = useSchool()
  const createMutation = useCreateSchoolAdmin()

  // size 100 keeps the picker useful for a platform that will realistically
  // never hold more schools than that in one page; there is no server cap.
  const { data: schoolData } = useSchoolList({ page: 0, size: 100, sortBy: "name", sortDir: "asc" })
  const schools = schoolData?.data.content ?? []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: defaultSchoolId ? { schoolId: defaultSchoolId } : undefined,
  })

  useEffect(() => {
    if (defaultSchoolId) reset({ schoolId: defaultSchoolId })
  }, [defaultSchoolId, reset])

  const onSubmit = (values: CreateAdminFormValues) => {
    createMutation.mutate(
      {
        schoolId: values.schoolId,
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone && values.phone.length > 0 ? values.phone : undefined,
      },
      {
        onSuccess: () => {
          toast.success("School admin created")
          reset(defaultSchoolId ? { schoolId: defaultSchoolId } : undefined)
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to create school admin")),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-box bg-base-100 shadow-card p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserPlus size={18} />
        </div>
        <div>
          <h2 className="t-h3">Create School Admin</h2>
          <p className="t-body text-base-content/50">
            Provision an ADMIN account scoped to a single school.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="form-control">
          <div className="label">
            <span className="label-text">School *</span>
          </div>
          <select
            {...register("schoolId", { valueAsNumber: true })}
            className="select select-md w-full bg-base-100"
          >
            <option value={0}>Select a school…</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.schoolId && (
            <div className="label">
              <span className="label-text-alt text-error">{errors.schoolId.message}</span>
            </div>
          )}
          {schools.length === 0 && (
            <div className="label">
              <span className="label-text-alt text-base-content/40">No schools yet.</span>
            </div>
          )}
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text">Admin name *</span>
          </div>
          <input {...register("name")} placeholder="Jane Admin" className="input input-md w-full bg-base-100" />
          {errors.name && (
            <div className="label">
              <span className="label-text-alt text-error">{errors.name.message}</span>
            </div>
          )}
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text">Email *</span>
          </div>
          <input
            {...register("email")}
            type="email"
            autoComplete="off"
            placeholder="admin@school.edu"
            className="input input-md w-full bg-base-100"
          />
          {errors.email && (
            <div className="label">
              <span className="label-text-alt text-error">{errors.email.message}</span>
            </div>
          )}
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text">Phone</span>
          </div>
          <input {...register("phone")} placeholder="+1 555 0100" className="input input-md w-full bg-base-100" />
          {errors.phone && (
            <div className="label">
              <span className="label-text-alt text-error">{errors.phone.message}</span>
            </div>
          )}
        </label>

        <label className="form-control sm:col-span-2">
          <div className="label">
            <span className="label-text">Password *</span>
          </div>
          <input
            {...register("password")}
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="input input-md w-full bg-base-100"
          />
          {errors.password ? (
            <div className="label">
              <span className="label-text-alt text-error">{errors.password.message}</span>
            </div>
          ) : (
            <div className="label">
              <span className="label-text-alt text-base-content/40">
                The server enforces a minimum of 8 characters.
              </span>
            </div>
          )}
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-sm mt-5"
        disabled={createMutation.isPending || schools.length === 0}
      >
        {createMutation.isPending ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          "Create School Admin"
        )}
      </button>
    </form>
  )
}

function AdminsContent() {
  const searchParams = useSearchParams()
  const schoolId = Number(searchParams.get("schoolId")) || undefined
  const schoolName = searchParams.get("schoolName") ?? undefined

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Platform", href: "/" }, { label: "School Admins" }]} />
      <div>
        <h1 className="t-h1">School Admins</h1>
        <p className="t-body text-base-content/50 mt-1">
          {schoolName ? `Provisioning an admin for ${schoolName}.` : "Provision admin accounts scoped to a single school."}
        </p>
      </div>
      <AdminForm defaultSchoolId={schoolId} />
    </div>
  )
}

export default function AdminsPage() {
  return (
    <Suspense fallback={<div className="loading loading-spinner loading-md text-primary" />}>
      <AdminsContent />
    </Suspense>
  )
}
