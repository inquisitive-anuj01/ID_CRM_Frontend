import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Marker } from '@/components/ui/Marker'

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="h-16 w-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-6">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-text">
        404 — Page <Marker>Not Found</Marker>
      </h1>
      <p className="mt-3 text-xs sm:text-sm text-text-muted max-w-md">
        The requested screen does not exist or has been moved. Check the URL or return to your CRM workspace.
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
