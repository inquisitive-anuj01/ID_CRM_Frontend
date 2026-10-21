import { Search, X, Filter, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useStatuses, useSources } from '@/hooks/useMasters'
import { useUsers } from '@/hooks/useUsers'

export function LeadFilters({ filters, onChange, onReset }) {
  const { statuses } = useStatuses()
  const { sources } = useSources()
  const { userOptions } = useUsers()

  const handleField = (key, val) => {
    onChange({ ...filters, [key]: val, page: 1 })
  }

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status ||
    filters.source ||
    filters.assignedTo ||
    filters.overdue
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative min-w-[200px] flex-1">
        <Input
          value={filters.search || ''}
          onChange={(e) => handleField('search', e.target.value)}
          placeholder="Search by name, phone, email or company..."
          className="pl-9 h-9 text-xs"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted pointer-events-none" />
        {filters.search && (
          <button
            onClick={() => handleField('search', '')}
            className="absolute right-2.5 top-2.5 text-text-muted hover:text-text"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="w-36">
        <Select
          value={filters.status || ''}
          onChange={(e) => handleField('status', e.target.value)}
          className="h-9 text-xs"
          options={[
            { value: '', label: 'All Statuses' },
            ...statuses.map((s) => ({ value: s.key, label: s.name })),
          ]}
        />
      </div>

      {/* Source filter */}
      <div className="w-36">
        <Select
          value={filters.source || ''}
          onChange={(e) => handleField('source', e.target.value)}
          className="h-9 text-xs"
          options={[
            { value: '', label: 'All Sources' },
            ...sources.map((s) => ({ value: s._id, label: s.name })),
          ]}
        />
      </div>

      {/* AssignedTo filter */}
      <div className="w-36">
        <Select
          value={filters.assignedTo || ''}
          onChange={(e) => handleField('assignedTo', e.target.value)}
          className="h-9 text-xs"
          options={[
            { value: '', label: 'All Owners' },
            ...userOptions.map((u) => ({ value: u._id, label: u.name })),
          ]}
        />
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 text-xs text-text-muted hover:text-text gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  )
}
