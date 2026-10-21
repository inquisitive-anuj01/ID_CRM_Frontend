import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileDrop } from '@/components/ui/FileDrop'
import { leadsApi } from '@/api/leads.api'
import { Upload, Download, CheckCircle2, AlertTriangle, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'

export function ImportPage() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select an Excel file to import')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', files[0])

      const res = await leadsApi.import(formData)
      setResult(res.data)
      toast.success('Leads imported successfully!')
      setFiles([])
    } catch (err) {
      toast.error(err.message || 'Import failed. Check file format.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Page>
      <PageHeader
        title="Excel Lead Import"
        marker="Bulk"
        description="Upload .xlsx spreadsheets to mass-create or update CRM leads"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 bg-surface border-border">
            <h3 className="text-sm font-bold text-text mb-2">Upload Excel Spreadsheet</h3>
            <p className="text-xs text-text-muted mb-4">
              Select or drop your .xlsx or .xls file. Columns supported: Name, Mobile, Email, Company, Service, Source, Estimate.
            </p>

            <FileDrop
              files={files}
              onChange={setFiles}
              maxFiles={1}
              accept={{
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'application/vnd.ms-excel': ['.xls'],
              }}
            />

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="solid"
                disabled={files.length === 0 || uploading}
                onClick={handleUpload}
              >
                <Upload className="mr-1.5 h-4 w-4" />
                {uploading ? 'Processing File...' : 'Start Import'}
              </Button>
            </div>
          </Card>

          {result && (
            <Card className="p-6 bg-surface border-border">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <h3 className="text-sm font-bold text-text">Import Results</h3>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <p className="text-xs text-text-muted">Total Processed</p>
                  <p className="text-lg font-bold text-text mt-1">{result.total || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-xs text-success">Imported</p>
                  <p className="text-lg font-bold text-success mt-1">{result.created || result.imported || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-warn/10 border border-warn/20">
                  <p className="text-xs text-warn">Duplicates / Skipped</p>
                  <p className="text-lg font-bold text-warn mt-1">{result.skipped || result.duplicates || 0}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-5 bg-surface border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-brand" />
              Column Guidelines
            </h4>
            <div className="mt-3 space-y-2 text-xs text-text-muted">
              <p>• <strong>Name:</strong> Client or contact person name (Required)</p>
              <p>• <strong>Mobile:</strong> 10-digit phone number with or without +91 (Required)</p>
              <p>• <strong>Email:</strong> Valid email address (Optional)</p>
              <p>• <strong>Company:</strong> Business or organization name</p>
              <p>• <strong>Source:</strong> Matches an active inbound source</p>
              <p>• <strong>Estimate:</strong> Numeric budget / contract value in ₹</p>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}
