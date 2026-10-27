import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Building2,
  Users,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { workspaceApi } from '@/api/workspace.api'
import { useAuthStore } from '@/store/auth.store'
import { Marker } from '@/components/ui/Marker'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

const registerSchema = z
  .object({
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    companySize: z.string().optional(),
    name: z.string().min(2, 'Your name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function RegisterPage() {
  const navigate = useNavigate()
  const { setToken, setUser, setWorkspace } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      companySize: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      setSubmitting(true)
      const res = await workspaceApi.create({
        companyName: values.companyName,
        companySize: values.companySize,
        name: values.name,
        email: values.email,
        password: values.password,
      })
      const { user, workspace, accessToken } = res.data || {}
      setToken(accessToken)
      if (user) setUser(user)
      if (workspace) setWorkspace(workspace)
      toast.success(`Workspace "${workspace?.name || values.companyName}" registered successfully!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Failed to create workspace. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0A] overflow-hidden selection:bg-brand selection:text-black py-12">
      {/* Background ambient glow circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand/10 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #DEB104 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full max-w-lg">
        {/* Brand header */}
        <div className="mb-6 text-center flex flex-col items-center">
          <img
            src="/ID.png"
            alt="Inquisitive Digital"
            className="h-28 w-28 object-contain mb-3 drop-shadow-[0_4px_12px_rgba(222,177,4,0.2)]"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-semibold mb-4">
            <span>Inquisitive Digital Platform</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Create Your <Marker>Workspace</Marker>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#CAD5E2]">
            Setup your company space, invite your sales team & start closing leads
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-[#262626] bg-[#121212]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Company Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/90 mb-1.5">
                  Company Name <span className="text-brand">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('companyName')}
                    placeholder="e.g. Acme Corp"
                    error={errors.companyName?.message}
                    className="pl-10 bg-[#181818] border-[#2E2E2E] text-white focus:border-brand"
                  />
                  <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-[#CAD5E2]/50 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/90 mb-1.5">
                  Company Size
                </label>
                <div className="relative">
                  <select
                    {...register('companySize')}
                    className="w-full h-10 px-3 pl-10 rounded-lg bg-[#181818] border border-[#2E2E2E] text-white text-sm focus:outline-none focus:border-brand"
                  >
                    <option value="">Select size (optional)</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                  <Users className="absolute left-3.5 top-3 h-4 w-4 text-[#CAD5E2]/50 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Admin Info */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/90 mb-1.5">
                Admin Full Name <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <Input
                  {...register('name')}
                  placeholder="e.g. John Doe"
                  error={errors.name?.message}
                  className="pl-10 bg-[#181818] border-[#2E2E2E] text-white focus:border-brand"
                />
                <User className="absolute left-3.5 top-3 h-4 w-4 text-[#CAD5E2]/50 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/90 mb-1.5">
                Work Email <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="admin@company.com"
                  error={errors.email?.message}
                  className="pl-10 bg-[#181818] border-[#2E2E2E] text-white focus:border-brand"
                />
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#CAD5E2]/50 pointer-events-none" />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/90 mb-1.5">
                  Password <span className="text-brand">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    error={errors.password?.message}
                    className="pl-10 pr-9 bg-[#181818] border-[#2E2E2E] text-white focus:border-brand"
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#CAD5E2]/50 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-[#CAD5E2]/60 hover:text-white cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/90 mb-1.5">
                  Confirm Password <span className="text-brand">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    error={errors.confirmPassword?.message}
                    className="pl-10 pr-9 bg-[#181818] border-[#2E2E2E] text-white focus:border-brand"
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#CAD5E2]/50 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-[#CAD5E2]/60 hover:text-white cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="solid"
                disabled={submitting}
                className="w-full justify-center h-11 text-sm font-bold bg-brand text-black hover:bg-brand-hover shadow-[4px_4px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
              >
                {submitting ? 'Creating Workspace...' : (
                  <>
                    Create Workspace & Launch Dashboard
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Already have workspace link */}
          <div className="mt-6 pt-5 border-t border-[#262626] text-center space-y-3">
            <p className="text-sm text-neutral-300">
              Already have a workspace?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-brand hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                Sign In to existing workspace →
              </button>
            </p>

            <div className="flex items-center justify-center text-xs text-white/60 gap-1.5 pt-1">
              <ShieldCheck className="h-4 w-4 text-brand" />
              Isolated multi-tenant workspace with full admin control
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
