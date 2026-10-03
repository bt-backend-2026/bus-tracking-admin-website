"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Breadcrumbs } from "@bustrack/ui"
import useSchool from "@bustrack/hooks/use-school"
import { getApiErrorMessage } from "../../auth-errors"

// Mirrors the backend CreateSchoolRequest constraints: name is @NotBlank with
// @Size(max = 150); contactEmail is @Email; everything else is length-capped
// and optional. The server does NOT trim, so trim client-side.
const createSchoolSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150, "Max 150 characters"),
  address: z.string().trim().max(255, "Max 255 characters").optional(),
  city: z.string().trim().max(100, "Max 100 characters").optional(),
  contactName: z.string().trim().max(150, "Max 150 characters").optional(),
  contactPhone: z.string().trim().max(30, "Max 30 characters").optional(),
  contactEmail: z
    .string()
    .trim()
    .max(255, "Max 255 characters")
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Invalid email")
    .optional(),
})

type CreateSchoolFormValues = z.infer<typeof createSchoolSchema>

const emptyToUndefined = (v?: string) => (v && v.length > 0 ? v : undefined)

export default function NewSchoolPage() {
  const router = useRouter()
  const { useCreateSchool } = useSchool()
  const createMutation = useCreateSchool()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSchoolFormValues>({
    resolver: zodResolver(createSchoolSchema),
  })

  const onSubmit = (values: CreateSchoolFormValues) => {
    createMutation.mutate(
      {
        name: values.name,
        address: emptyToUndefined(values.address),
        city: emptyToUndefined(values.city),
        contactName: emptyToUndefined(values.contactName),
        contactPhone: emptyToUndefined(values.contactPhone),
        contactEmail: emptyToUndefined(values.contactEmail),
      },
      {
        onSuccess: (res) => {
          toast.success("School created")
          router.push(`/schools/${res.data.id}`)
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to create school")),
      }
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Platform", href: "/" }, { label: "Schools", href: "/schools" }, { label: "New" }]}
      />

      <div>
        <h1 className="t-h1">New School</h1>
        <p className="t-body text-base-content/50 mt-1">
          Onboards a school. It is created as Active — suspension and archiving are separate actions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-box bg-base-100 shadow-card p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="form-control sm:col-span-2">
            <div className="label">
              <span className="label-text">School name *</span>
            </div>
            <input
              {...register("name")}
              placeholder="Springfield Elementary School"
              className="input input-md w-full bg-base-100"
            />
            {errors.name && (
              <div className="label">
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </div>
            )}
          </label>

          <label className="form-control sm:col-span-2">
            <div className="label">
              <span className="label-text">Address</span>
            </div>
            <input {...register("address")} placeholder="123 Main St" className="input input-md w-full bg-base-100" />
            {errors.address && (
              <div className="label">
                <span className="label-text-alt text-error">{errors.address.message}</span>
              </div>
            )}
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">City</span>
            </div>
            <input {...register("city")} placeholder="Springfield" className="input input-md w-full bg-base-100" />
            {errors.city && (
              <div className="label">
                <span className="label-text-alt text-error">{errors.city.message}</span>
              </div>
            )}
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Contact name</span>
            </div>
            <input {...register("contactName")} placeholder="Jane Principal" className="input input-md w-full bg-base-100" />
            {errors.contactName && (
              <div className="label">
                <span className="label-text-alt text-error">{errors.contactName.message}</span>
              </div>
            )}
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Contact phone</span>
            </div>
            <input {...register("contactPhone")} placeholder="+1 555 0100" className="input input-md w-full bg-base-100" />
            {errors.contactPhone && (
              <div className="label">
                <span className="label-text-alt text-error">{errors.contactPhone.message}</span>
              </div>
            )}
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Contact email</span>
            </div>
            <input
              {...register("contactEmail")}
              type="email"
              placeholder="office@school.edu"
              className="input input-md w-full bg-base-100"
            />
            {errors.contactEmail && (
              <div className="label">
                <span className="label-text-alt text-error">{errors.contactEmail.message}</span>
              </div>
            )}
          </label>
        </div>

        <div className="mt-5 flex gap-2">
          <button type="submit" className="btn btn-primary btn-sm" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Create School"
            )}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => router.push("/schools")}
            disabled={createMutation.isPending}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
