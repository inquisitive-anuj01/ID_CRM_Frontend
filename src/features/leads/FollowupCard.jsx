import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PolicyBadge } from '@/components/shared/PolicyBadge'
import { UserChip } from '@/components/shared/UserChip'
import { fmtDateTime, fmtTimeAgo } from '@/lib/dates'
import { Calendar, Paperclip, Music, FileText } from 'lucide-react'

export function FollowupCard({ followup }) {
  if (!followup) return null

  const noteText = followup.comment || followup.remarks || ''
  const files = followup.attachments || followup.files || []
  const audioFile = files.find(
    (f) =>
      f.kind === 'voice' ||
      f.mimetype?.includes('audio') ||
      f.mimeType?.includes('audio') ||
      f.filename?.endsWith('.webm') ||
      f.originalName?.endsWith('.webm') ||
      f.url?.endsWith('.webm')
  )
  const otherFiles = files.filter((f) => f !== audioFile)

  return (
    <Card className="p-4 bg-surface border-border hover:border-brand/30 transition-all space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <UserChip user={followup.createdBy || followup.user} size="xs" />
          <Badge variant="outline" className="text-[10px]">
            {typeof followup.category === 'object' ? followup.category?.name : (followup.category || 'Followup')}
          </Badge>
          <PolicyBadge status={followup.policyStatus} />
        </div>

        <span className="text-[11px] text-text-muted">
          {fmtDateTime ? fmtDateTime(followup.createdAt) : new Date(followup.createdAt).toLocaleString()}
        </span>
      </div>

      {noteText && (
        <p className="text-xs text-text leading-relaxed whitespace-pre-wrap">
          {noteText}
        </p>
      )}

      {/* Audio player if voice note */}
      {audioFile && (
        <div className="p-2 rounded-lg bg-surface-2 border border-border flex items-center gap-2">
          <Music className="h-4 w-4 text-brand shrink-0" />
          <audio
            controls
            src={audioFile.url || `/api/v1/files/${followup._id}/${audioFile._id}`}
            className="w-full h-8 max-w-sm"
          />
        </div>
      )}

      {/* File attachments */}
      {otherFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {otherFiles.map((file, idx) => (
            <a
              key={idx}
              href={file.url || `/api/v1/files/${followup._id}/${file._id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-border text-[11px] font-medium text-text hover:text-brand transition-colors"
            >
              <Paperclip className="h-3 w-3 text-text-muted" />
              <span className="truncate max-w-[140px]">{file.originalName || file.originalname || file.filename || 'Attachment'}</span>
            </a>
          ))}
        </div>
      )}

      {/* Next scheduled followup callout */}
      {followup.nextFollowupDate && (
        <div className="flex items-center gap-1.5 text-[11px] text-brand bg-brand/10 px-2.5 py-1 rounded-md border border-brand/20 w-fit">
          <Calendar className="h-3.5 w-3.5" />
          <span>Next scheduled: {fmtDateTime ? fmtDateTime(followup.nextFollowupDate) : new Date(followup.nextFollowupDate).toLocaleString()}</span>
        </div>
      )}
    </Card>
  )
}
