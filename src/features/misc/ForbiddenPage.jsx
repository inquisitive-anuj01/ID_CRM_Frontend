import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Marker } from '@/components/ui/Marker'

export function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="h-16 w-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger mb-6">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-text">
        403 — Access <Marker>Forbidden</Marker>
      </h1>
      <p className="mt-3 text-xs sm:text-sm text-text-muted max-w-md">
        You do not have administrative clearance to access this module. Please contact your system administrator.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="solid">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
