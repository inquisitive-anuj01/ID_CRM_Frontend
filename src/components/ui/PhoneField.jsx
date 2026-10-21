import PhoneInputLib from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/cn'

export function PhoneField({ label, error, required, value, onChange, className }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-widest text-muted">
          {label}
          {required && <span className="ml-1 text-brand">*</span>}
        </label>
      )}
      <div
        className={cn(
          'flex items-center rounded-xl border border-line bg-surface-2 px-3 overflow-hidden',
          'focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
          error && 'border-[var(--danger)]',
          '[&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:border-none',
          '[&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:text-ink',
          '[&_.PhoneInputInput]:py-2.5 [&_.PhoneInputInput]:pl-2',
          '[&_.PhoneInputCountrySelect]:bg-surface-2 [&_.PhoneInputCountrySelect]:text-ink',
          className
        )}
      >
        <PhoneInputLib
          defaultCountry="IN"
          value={value}
          onChange={onChange}
          international
          countryCallingCodeEditable={false}
        />
      </div>
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  )
}
