"use client"

import { useState, useCallback } from "react"
import { Plus, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react"
import { toast } from "sonner"
import type { CheckpointResponse, CheckpointRequest } from "@bustrack/types/models/bus"

interface CheckpointEditorProps {
  checkpoints: CheckpointResponse[]
  savePending?: boolean
  onSave: (data: CheckpointRequest) => Promise<void>
}

interface EditableCheckpoint {
  id?: number
  label: string
}

function initItems(cps: CheckpointResponse[]): EditableCheckpoint[] {
  return cps.map((cp) => ({ id: cp.id, label: cp.label }))
}

export function CheckpointEditor({ checkpoints, savePending, onSave }: CheckpointEditorProps) {
  const [items, setItems] = useState<EditableCheckpoint[]>(() => initItems(checkpoints))
  const [dirty, setDirty] = useState(false)

  const updateLabel = useCallback((index: number, label: string) => {
    setItems((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], label }
      return next
    })
    setDirty(true)
  }, [])

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, { label: "" }])
    setDirty(true)
  }, [])

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
    setDirty(true)
  }, [])

  const moveUp = useCallback((index: number) => {
    if (index === 0) return
    setItems((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
    setDirty(true)
  }, [])

  const moveDown = useCallback((index: number) => {
    setItems((prev) => {
      if (index === prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
    setDirty(true)
  }, [])

  const handleSave = useCallback(async () => {
    const valid = items.filter((i) => i.label.trim())
    if (valid.length === 0) {
      toast.error("At least one checkpoint with a label is required")
      return
    }
    try {
      await onSave({
        checkpoints: valid.map((i) => (i.id ? { id: i.id, label: i.label.trim() } : { label: i.label.trim() })),
      })
      setDirty(false)
      toast.success("Checkpoints saved")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to save checkpoints"
      toast.error(msg)
    }
  }, [items, onSave])

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-xs text-base-content/30 w-4 shrink-0 text-right">{i + 1}.</span>
          <input
            className="input input-sm flex-1 min-w-0"
            placeholder="Checkpoint label"
            value={item.label}
            onChange={(e) => updateLabel(i, e.target.value)}
          />
          <button
            className="btn btn-ghost btn-xs btn-square text-base-content/20 hover:text-base-content/50"
            aria-label="Move up"
            disabled={i === 0}
            onClick={() => moveUp(i)}
          >
            <ArrowUp size={13} />
          </button>
          <button
            className="btn btn-ghost btn-xs btn-square text-base-content/20 hover:text-base-content/50"
            aria-label="Move down"
            disabled={i === items.length - 1}
            onClick={() => moveDown(i)}
          >
            <ArrowDown size={13} />
          </button>
          <button
            className="btn btn-ghost btn-xs btn-square text-base-content/20 hover:text-error"
            aria-label="Remove checkpoint"
            onClick={() => removeItem(i)}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between pt-1">
        <button className="btn btn-ghost btn-xs gap-1 text-base-content/40" onClick={addItem}>
          <Plus size={13} />
          Add Checkpoint
        </button>

        {dirty && (
          <button
            className="btn btn-primary btn-xs gap-1"
            disabled={savePending}
            onClick={handleSave}
          >
            {savePending ? <span className="loading loading-spinner loading-xs" /> : <Save size={13} />}
            Save Changes
          </button>
        )}
      </div>
    </div>
  )
}
