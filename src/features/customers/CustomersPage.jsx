import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import http from '@/api/http'
import {
  Plus, Trash2, Building2, Phone, Mail, Globe, User2,
  IndianRupee, Star, Tag, MapPin, FileText, Users, X,
  Briefcase, CreditCard,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Tier badge colors ────────────────────────────────────────────────────────
const TIER_COLORS = {
  bronze: 'bg-amber-700/20 text-amber-700 border-amber-700/30',
  silver: 'bg-slate-400/20 text-slate-500 border-slate-400/30',
  gold:   'bg-yellow-400/20 text-yellow-600 border-yellow-400/30',
  platinum: 'bg-purple-400/20 text-purple-600 border-purple-400/30',
}

// ─── Customer Form ─────────────────────────────────────────────────────────────
function CustomerForm({ onClose, onSaved, initial = {} }) {
  const { user } = useAuthStore()
  const [form, setForm] = useState({
    customerName: initial.customerName || '',
    companyName:  initial.companyName  || '',
    industry:     initial.industry     || '',
    website:      initial.website      || '',
    mobile:       initial.mobile       || '',
    email:        initial.email        || '',
    gstNumber:    initial.gstNumber    || '',
    pan:          initial.pan          || '',
    tier:         initial.tier         || 'silver',
    billingAddress:  initial.billingAddress  || '',
    shippingAddress: initial.shippingAddress || '',
    dealAmount:       initial.dealAmount      || '',
    annualRevenue:    initial.annualRevenue   || '',
    paymentTerms:     initial.paymentTerms   || '',
    accountManager: initial.accountManager?._id || initial.accountManager || user?._id || '',
    notes:  initial.notes  || '',
    tags:   initial.tags?.join(', ') || '',
    // Contact persons — up to 3
    cp1Name: initial.contactPersons?.[0]?.name || '',
    cp1Designation: initial.contactPersons?.[0]?.designation || '',
    cp1Mobile: initial.contactPersons?.[0]?.mobile || '',
    cp1Email:  initial.contactPersons?.[0]?.email  || '',
    cp2Name: initial.contactPersons?.[1]?.name || '',
    cp2Designation: initial.contactPersons?.[1]?.designation || '',
    cp2Mobile: initial.contactPersons?.[1]?.mobile || '',
    cp2Email:  initial.contactPersons?.[1]?.email  || '',
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => http.get('/users'),
    select: (r) => Array.isArray(r.data) ? r.data : [],
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const buildPayload = () => {
    const contactPersons = []
    if (form.cp1Name) contactPersons.push({ name: form.cp1Name, designation: form.cp1Designation, mobile: form.cp1Mobile, email: form.cp1Email })
    if (form.cp2Name) contactPersons.push({ name: form.cp2Name, designation: form.cp2Designation, mobile: form.cp2Mobile, email: form.cp2Email })

    return {
      customerName:    form.customerName,
      companyName:     form.companyName  || undefined,
      industry:        form.industry     || undefined,
      website:         form.website      || undefined,
      mobile:          form.mobile,
      email:           form.email        || undefined,
      gstNumber:       form.gstNumber    || undefined,
      pan:             form.pan          || undefined,
      tier:            form.tier,
      billingAddress:  form.billingAddress  || undefined,
      shippingAddress: form.shippingAddress || undefined,
      dealAmount:      form.dealAmount   ? Number(form.dealAmount)   : 0,
      annualRevenue:   form.annualRevenue ? Number(form.annualRevenue) : 0,
      paymentTerms:    form.paymentTerms || undefined,
      accountManager:  form.accountManager || undefined,
      notes:           form.notes        || undefined,
      tags:            form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      contactPersons,
    }
  }

  const INDUSTRIES = [
    'Technology', 'Manufacturing', 'Retail', 'Healthcare', 'Finance & Banking',
    'Real Estate', 'Education', 'Hospitality', 'Logistics', 'Construction',
    'Automotive', 'Media & Entertainment', 'Agriculture', 'Pharmaceuticals', 'Other',
  ]

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">

      {/* ── Section 1: Core Identity ── */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" /> Company & Client Identity
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Client / Contact Name *" value={form.customerName} onChange={(e) => set('customerName', e.target.value)} placeholder="e.g. Rajesh Sharma" />
          <Input label="Company Name" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="e.g. Infosys Ltd." />
          <Select
            label="Industry"
            value={form.industry}
            onChange={(e) => set('industry', e.target.value)}
            options={[{ value: '', label: 'Select industry…' }, ...INDUSTRIES.map(i => ({ value: i, label: i }))]}
          />
          <Input label="Website" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://company.com" />
        </div>
      </div>

      {/* ── Section 2: Contact Details ── */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" /> Primary Contact
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Mobile *" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="+91 98765 43210" />
          <Input label="Email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="contact@company.com" type="email" />
        </div>
      </div>

      {/* ── Section 3: Business Details ── */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" /> Business & Compliance
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="GST Number" value={form.gstNumber} onChange={(e) => set('gstNumber', e.target.value)} placeholder="22AAAAA0000A1Z5" />
          <Input label="PAN" value={form.pan} onChange={(e) => set('pan', e.target.value)} placeholder="ABCDE1234F" />
          <Select
            label="Client Tier"
            value={form.tier}
            onChange={(e) => set('tier', e.target.value)}
            options={[
              { value: 'bronze', label: '🥉 Bronze' },
              { value: 'silver', label: '🥈 Silver' },
              { value: 'gold', label: '🥇 Gold' },
              { value: 'platinum', label: '💎 Platinum' },
            ]}
          />
          <Input label="Payment Terms" value={form.paymentTerms} onChange={(e) => set('paymentTerms', e.target.value)} placeholder="Net 30, 50% advance…" />
        </div>
      </div>

      {/* ── Section 4: Financials ── */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-1.5">
          <IndianRupee className="h-3.5 w-3.5" /> Deal & Financials
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Deal Amount (₹)" value={form.dealAmount} onChange={(e) => set('dealAmount', e.target.value)} placeholder="0" type="number" />
          <Input label="Annual Revenue Potential (₹)" value={form.annualRevenue} onChange={(e) => set('annualRevenue', e.target.value)} placeholder="0" type="number" />
        </div>
      </div>

      {/* ── Section 5: Addresses ── */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> Addresses
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Textarea label="Billing Address" value={form.billingAddress} onChange={(e) => set('billingAddress', e.target.value)} rows={2} placeholder="123 Street, City, State - PIN" />
          <Textarea label="Shipping Address" value={form.shippingAddress} onChange={(e) => set('shippingAddress', e.target.value)} rows={2} placeholder="Same as billing / Different…" />
        </div>
      </div>

      {/* ── Section 6: Contact Persons ── */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> Key Contact Persons
        </h4>
        <div className="space-y-3">
          {/* CP 1 */}
          <div className="rounded-xl border border-border bg-surface-2 p-3 grid grid-cols-2 gap-2">
            <p className="col-span-2 text-[11px] font-bold text-text-muted uppercase mb-1">Contact Person 1</p>
            <Input placeholder="Name" value={form.cp1Name} onChange={(e) => set('cp1Name', e.target.value)} />
            <Input placeholder="Designation" value={form.cp1Designation} onChange={(e) => set('cp1Designation', e.target.value)} />
            <Input placeholder="Mobile" value={form.cp1Mobile} onChange={(e) => set('cp1Mobile', e.target.value)} />
            <Input placeholder="Email" value={form.cp1Email} onChange={(e) => set('cp1Email', e.target.value)} type="email" />
          </div>
          {/* CP 2 */}
          <div className="rounded-xl border border-border bg-surface-2 p-3 grid grid-cols-2 gap-2">
            <p className="col-span-2 text-[11px] font-bold text-text-muted uppercase mb-1">Contact Person 2</p>
            <Input placeholder="Name" value={form.cp2Name} onChange={(e) => set('cp2Name', e.target.value)} />
            <Input placeholder="Designation" value={form.cp2Designation} onChange={(e) => set('cp2Designation', e.target.value)} />
            <Input placeholder="Mobile" value={form.cp2Mobile} onChange={(e) => set('cp2Mobile', e.target.value)} />
            <Input placeholder="Email" value={form.cp2Email} onChange={(e) => set('cp2Email', e.target.value)} type="email" />
          </div>
        </div>
      </div>

      {/* ── Section 7: Relationships & Notes ── */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" /> Notes & Assignment
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {users.length > 0 && (
            <Select
              label="Account Manager"
              value={form.accountManager}
              onChange={(e) => set('accountManager', e.target.value)}
              options={users.map((u) => ({ value: u._id, label: u.name }))}
            />
          )}
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="enterprise, insurance, key-account" />
          <Textarea label="Notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Any special notes about this client…" className="sm:col-span-2" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-surface border-t border-border -mx-1 px-1 py-3">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="solid" disabled={!form.customerName || !form.mobile} onClick={() => onSaved(buildPayload())}>
          Save Customer
        </Button>
      </div>
    </div>
  )
}

// ─── Customer Card ─────────────────────────────────────────────────────────────
function CustomerCard({ customer, onDelete }) {
  return (
    <Card className="p-5 bg-surface border-border hover:border-brand/40 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar */}
          <div className="h-11 w-11 shrink-0 rounded-xl bg-brand/10 flex items-center justify-center text-brand font-black text-lg">
            {(customer.companyName || customer.customerName || 'C').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-text text-sm">{customer.customerName}</h3>
              {customer.tier && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TIER_COLORS[customer.tier] || ''}`}>
                  {customer.tier.toUpperCase()}
                </span>
              )}
            </div>
            {customer.companyName && (
              <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                <Building2 className="h-3 w-3 shrink-0" /> {customer.companyName}
                {customer.industry && <span>· {customer.industry}</span>}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(customer._id)}
          className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Contact row */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-muted">
        {customer.mobile && (
          <a href={`tel:${customer.mobile}`} className="flex items-center gap-1 hover:text-brand transition-colors">
            <Phone className="h-3 w-3" /> {customer.mobile}
          </a>
        )}
        {customer.email && (
          <a href={`mailto:${customer.email}`} className="flex items-center gap-1 hover:text-brand transition-colors">
            <Mail className="h-3 w-3" /> {customer.email}
          </a>
        )}
        {customer.website && (
          <a href={customer.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand transition-colors">
            <Globe className="h-3 w-3" /> {customer.website.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>

      {/* Financials + Manager */}
      <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap gap-4 text-xs">
        {customer.dealAmount > 0 && (
          <div>
            <span className="text-text-muted">Deal</span>
            <p className="font-bold text-text">₹{Number(customer.dealAmount).toLocaleString('en-IN')}</p>
          </div>
        )}
        {customer.annualRevenue > 0 && (
          <div>
            <span className="text-text-muted">Annual Revenue</span>
            <p className="font-bold text-text">₹{Number(customer.annualRevenue).toLocaleString('en-IN')}</p>
          </div>
        )}
        {customer.accountManager && (
          <div>
            <span className="text-text-muted">Account Manager</span>
            <p className="font-semibold text-text flex items-center gap-1">
              <User2 className="h-3 w-3" /> {customer.accountManager?.name || '—'}
            </p>
          </div>
        )}
        {customer.paymentTerms && (
          <div>
            <span className="text-text-muted">Payment Terms</span>
            <p className="font-semibold text-text">{customer.paymentTerms}</p>
          </div>
        )}
      </div>

      {/* Contact persons */}
      {customer.contactPersons?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {customer.contactPersons.map((cp, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-[11px] text-text">
              <User2 className="h-3 w-3 text-text-muted" />
              {cp.name}{cp.designation ? ` · ${cp.designation}` : ''}
            </span>
          ))}
        </div>
      )}

      {/* Tags */}
      {customer.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {customer.tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-semibold">
              <Tag className="h-2.5 w-2.5" /> {tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {customer.notes && (
        <p className="mt-2 text-[11px] text-text-muted line-clamp-2 italic">{customer.notes}</p>
      )}
    </Card>
  )
}

import { useSearchParams } from 'react-router-dom'

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function CustomersPage() {
  const qc = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen] = useState(() => searchParams.get('add') === '1')
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('')

  const handleCloseModal = () => {
    setModalOpen(false)
    if (searchParams.get('add')) {
      searchParams.delete('add')
      setSearchParams(searchParams, { replace: true })
    }
  }

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['/customers'],
    queryFn: () => http.get('/customers'),
    select: (res) => Array.isArray(res.data) ? res.data : (res.data?.items || []),
  })

  const createMutation = useMutation({
    mutationFn: (payload) => http.post('/customers', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/customers'] })
      handleCloseModal()
      toast.success('Customer added successfully!')
    },
    onError: (err) => toast.error(err.message || 'Failed to add customer'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => http.delete(`/customers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/customers'] })
      toast.success('Customer deleted')
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  })

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.customerName?.toLowerCase().includes(q) ||
      c.companyName?.toLowerCase().includes(q) ||
      c.mobile?.includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.industry?.toLowerCase().includes(q)
    const matchTier = !tierFilter || c.tier === tierFilter
    return matchSearch && matchTier
  })

  return (
    <Page>
      <PageHeader
        title="Customer Accounts"
        marker="Clients"
        description="All business clients and enterprise accounts"
        actions={
          <Button variant="solid" onClick={() => setModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Client
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, mobile…"
          className="w-64"
        />
        <Select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          options={[
            { value: '', label: 'All Tiers' },
            { value: 'platinum', label: '💎 Platinum' },
            { value: 'gold', label: '🥇 Gold' },
            { value: 'silver', label: '🥈 Silver' },
            { value: 'bronze', label: '🥉 Bronze' },
          ]}
        />
        {(search || tierFilter) && (
          <Button variant="ghost" onClick={() => { setSearch(''); setTierFilter('') }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <span className="ml-auto text-xs text-text-muted self-center">
          {filtered.length} of {customers.length} clients
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No customers found"
          description={search || tierFilter ? 'Try adjusting your filters.' : 'Add your first business client to get started.'}
          action={
            !search && !tierFilter && (
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" /> Add First Client
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CustomerCard
              key={c._id}
              customer={c}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title="Add New Client"
        className="max-w-2xl"
      >
        <CustomerForm
          onClose={handleCloseModal}
          onSaved={(payload) => createMutation.mutate(payload)}
        />
      </Modal>
    </Page>
  )
}
