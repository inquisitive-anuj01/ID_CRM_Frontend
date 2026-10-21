import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { Marker } from '@/components/ui/Marker'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export function LoginPage() {
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      setSubmitting(true)
      const res = await authApi.login(values)
      const { user, accessToken } = res.data || {}
      setToken(accessToken)
      if (user) setUser(user)
      toast.success(`Welcome back, ${user?.name || 'User'}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0A] overflow-hidden selection:bg-brand selection:text-black">
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

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Inquisitive Digital Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            ID <Marker>CRM</Marker>
          </h1>
          <p className="mt-3 text-sm text-[#CAD5E2]">
            High-velocity sales management & pipeline acceleration
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#262626] bg-[#121212]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/90 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="your email address"
                  error={errors.email?.message}
                  className="pl-10 bg-[#181818] border-[#2E2E2E] text-white focus:border-brand"
                />
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#CAD5E2]/50 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/90 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="your password"
                  error={errors.password?.message}
                  className="pl-10 pr-10 bg-[#181818] border-[#2E2E2E] text-white focus:border-brand"
                />
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#CAD5E2]/50 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#CAD5E2]/60 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="solid"
                disabled={submitting}
                className="w-full justify-center h-11 text-sm font-bold bg-brand text-black hover:bg-brand-hover shadow-[4px_4px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
              >
                {submitting ? 'Authenticating...' : (
                  <>
                    Sign In to Workspace
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Secure access note */}
          <div className="mt-6 pt-5 border-t border-[#262626] flex items-center justify-center text-xs text-[#CAD5E2]">
            <span className="flex items-center gap-1.5 text-xs text-white/70">
              <ShieldCheck className="h-4 w-4 text-brand" />
              Role-based secure access
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
