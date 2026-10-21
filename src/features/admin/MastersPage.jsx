import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { MasterTable } from './MasterTable'
import { useStatuses, useSources, useLabels, useCategories } from '@/hooks/useMasters'
import { Layers, Tag, Bookmark, PhoneCall } from 'lucide-react'

export function MastersPage() {
  const [activeTab, setActiveTab] = useState('statuses')

  const {
    statuses,
    createStatus,
    updateStatus,
    deleteStatus,
  } = useStatuses(true)

  const {
    sources,
    createSource,
    updateSource,
    deleteSource,
  } = useSources()

  const {
    labels,
    createLabel,
    updateLabel,
    deleteLabel,
  } = useLabels()

  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories()

  return (
    <Page>
      <PageHeader
        title="Master Data"
        marker="Config"
        description="Configure CRM pipelines, sources, lead categories, and tags"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface border border-border">
          <TabsTrigger value="statuses" className="gap-2">
            <Layers className="h-4 w-4" />
            <span>Lead Statuses ({statuses.length})</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-2">
            <Bookmark className="h-4 w-4" />
            <span>Lead Sources ({sources.length})</span>
          </TabsTrigger>
          <TabsTrigger value="labels" className="gap-2">
            <Tag className="h-4 w-4" />
            <span>Labels ({labels.length})</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <PhoneCall className="h-4 w-4" />
            <span>Followup Categories ({categories.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="statuses">
          <MasterTable
            title="Pipeline Statuses"
            description="Manage Kanban and list statuses for sales stages"
            items={statuses}
            onCreate={createStatus}
            onUpdate={updateStatus}
            onDelete={deleteStatus}
            hasKey
            hasColor
          />
        </TabsContent>

        <TabsContent value="sources">
          <MasterTable
            title="Lead Inbound Sources"
            description="Sources where leads originate (e.g. Website, Referral, Meta Ads, Google)"
            items={sources}
            onCreate={createSource}
            onUpdate={updateSource}
            onDelete={deleteSource}
          />
        </TabsContent>

        <TabsContent value="labels">
          <MasterTable
            title="Lead Labels & Tags"
            description="Visual badges to categorize priority, client types, or product interests"
            items={labels}
            onCreate={createLabel}
            onUpdate={updateLabel}
            onDelete={deleteLabel}
            hasColor
          />
        </TabsContent>

        <TabsContent value="categories">
          <MasterTable
            title="Followup Activity Categories"
            description="Categories used when logging followup interactions"
            items={categories}
            onCreate={createCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        </TabsContent>
      </Tabs>
    </Page>
  )
}
