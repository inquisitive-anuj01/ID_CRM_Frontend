import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File, Image, Music } from 'lucide-react'
import { cn } from '@/lib/cn'

const ACCEPTED = {
  'image/*': [],
  'video/*': [],
  'application/pdf': [],
  'application/msword': [],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
  'application/vnd.ms-excel': [],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
  'application/vnd.ms-powerpoint': [],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
  'text/plain': [],
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function FileDrop({ value = [], onChange, label, error, maxFiles = 5 }) {
  const [fileErrors, setFileErrors] = useState([])

  const onDrop = useCallback((accepted, rejected) => {
    const errors = rejected.map((f) => `${f.file.name}: ${f.errors[0]?.message}`)
    setFileErrors(errors)
    const next = [...value, ...accepted].slice(0, maxFiles)
    onChange?.(next)
  }, [value, onChange, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
  })

  const remove = (idx) => {
    const next = value.filter((_, i) => i !== idx)
    onChange?.(next)
  }

  const getIcon = (file) => {
    if (file.type?.startsWith('image/')) return <Image size={14} />
    if (file.type?.startsWith('audio/')) return <Music size={14} />
    return <File size={14} />
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-widest text-muted">
          {label}
        </label>
      )}

      <div
        {...getRootProps()}
        className={cn(
          'rounded-xl border-2 border-dashed border-line p-6 text-center cursor-pointer',
          'transition-all duration-150 hover:border-brand hover:bg-brand/5',
          isDragActive && 'border-brand bg-brand/10 scale-[0.99]'
        )}
      >
        <input {...getInputProps()} />
        <Upload size={20} className="mx-auto mb-2 text-muted" />
        <p className="text-sm font-semibold text-ink">Drop files here or click to upload</p>
        <p className="mt-1 text-xs text-muted">
          Images, Videos, PDF, DOC, EXCEL, PPT, TEXT · max 5 MB each
        </p>
      </div>

      {/* Preview */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-xs"
            >
              {file.type?.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-6 w-6 rounded object-cover"
                />
              ) : (
                <span className="text-muted">{getIcon(file)}</span>
              )}
              <span className="max-w-[120px] truncate text-ink">{file.name}</span>
              <button onClick={() => remove(idx)} className="text-muted hover:text-[var(--danger)]">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {fileErrors.map((e, i) => (
        <p key={i} className="text-xs text-[var(--danger)]">{e}</p>
      ))}
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  )
}
