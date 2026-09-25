"use client"

import { useRef, type ChangeEvent } from "react"
import { Upload } from "lucide-react"

interface FileUploadBtnProps {
  label?: string
  accept?: string
  loading?: boolean
  disabled?: boolean
  onFile: (file: File) => void
}

export function FileUploadBtn({
  label = "Upload XLSX",
  accept = ".xlsx,.xls",
  loading,
  disabled,
  onFile,
}: FileUploadBtnProps) {
  const ref = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFile(file)
      e.target.value = ""
    }
  }

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        className="btn btn-outline btn-sm gap-1.5"
        disabled={disabled || loading}
        onClick={() => ref.current?.click()}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <Upload size={14} />
        )}
        {label}
      </button>
    </>
  )
}
