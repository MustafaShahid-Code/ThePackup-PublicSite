import { useState, type FormEvent } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Button from './Button'
import { site } from '../data/site'
import { enquiryCategories } from '../data/content'

export type FormMode = 'contact' | 'vendor'

type Values = Record<string, string>
type Errors = Record<string, string>

const vendorSupplies = [
  'Pizza & corrugated boxes',
  'Food containers & bowls',
  'Paper bags',
  'Paper cups & sleeves',
  'Eco-friendly / fibre packaging',
  'Printing & finishing',
  'Other',
]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\-\s\d]{6,20}$/

function validate(mode: FormMode, v: Values, supplies: string[]): Errors {
  const e: Errors = {}
  if (!v.name?.trim()) e.name = 'Please enter your name.'
  if (mode === 'vendor' && !v.company?.trim()) e.company = 'Please enter your company name.'
  if (!v.email?.trim()) e.email = 'Please enter your email address.'
  else if (!EMAIL.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.phone?.trim() && !PHONE.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.'
  if (mode === 'contact' && !v.category) e.category = 'Please choose a packaging category.'
  if (mode === 'vendor' && supplies.length === 0) e.supplies = 'Select at least one product area.'
  if (!v.message?.trim() || v.message.trim().length < 10) e.message = 'Please add a short message (at least 10 characters).'
  return e
}

export default function EnquiryForm({ mode, defaultCategory = '' }: { mode: FormMode; defaultCategory?: string }) {
  const [values, setValues] = useState<Values>({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: enquiryCategories.includes(defaultCategory) ? defaultCategory : '',
    message: '',
    website: '', // honeypot
  })
  const [supplies, setSupplies] = useState<string[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const set = (k: string, val: string) => {
    const next = { ...values, [k]: val }
    setValues(next)
    if (touched[k]) setErrors(validate(mode, next, supplies))
  }
  const blur = (k: string) => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(mode, values, supplies))
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const errs = validate(mode, values, supplies)
    setErrors(errs)
    setTouched({ name: true, company: true, email: true, phone: true, category: true, message: true, supplies: true })
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`${mode}-${first}`)?.focus()
      return
    }
    if (values.website) {
      setStatus('success') // bot: pretend success
      return
    }
    setStatus('sending')
    try {
      if (site.formEndpoint) {
        const res = await fetch(site.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            formType: mode === 'vendor' ? 'Vendor enquiry' : 'Customer enquiry',
            name: values.name,
            company: values.company,
            email: values.email,
            phone: values.phone,
            category: mode === 'contact' ? values.category : undefined,
            supplies: mode === 'vendor' ? supplies.join(', ') : undefined,
            message: values.message,
          }),
        })
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
      } else {
        await new Promise((r) => setTimeout(r, 700))
      }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="card p-10 text-center" role="status">
        <CheckCircle2 className="mx-auto text-gold" size={44} aria-hidden="true" />
        <h3 className="mt-5 font-display text-3xl">Thank you{values.name ? `, ${values.name.split(' ')[0]}` : ''}.</h3>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-charcoal/70">
          {mode === 'vendor' ? 'Your vendor enquiry has been received.' : 'Your enquiry has been received.'} Our team will get back to you shortly.
        </p>
        {!site.formEndpoint && (
          <p className="mx-auto mt-5 max-w-md rounded-2xl border border-dashed border-gold p-3 text-[12.5px] text-charcoal/65">
            Demo mode: no submission endpoint is configured yet, so nothing was actually sent. See README.md to connect this form.
          </p>
        )}
        <div className="mt-7">
          <Button
            variant="outlineDark"
            arrow={false}
            onClick={() => {
              setStatus('idle')
              setValues((v) => ({ ...v, message: '' }))
              setTouched({})
            }}
          >
            Send another enquiry
          </Button>
        </div>
      </div>
    )
  }

  const id = (k: string) => `${mode}-${k}`
  const fieldProps = (k: string) => ({
    id: id(k),
    name: k,
    value: values[k],
    onChange: (e: { target: { value: string } }) => set(k, e.target.value),
    onBlur: () => blur(k),
    'aria-invalid': errors[k] && touched[k] ? true : undefined,
    'aria-describedby': errors[k] && touched[k] ? `${id(k)}-err` : undefined,
  })
  const Err = ({ k }: { k: string }) =>
    errors[k] && touched[k] ? (
      <p id={`${id(k)}-err`} className="mt-1.5 text-[12.5px] text-[#B3261E]">
        {errors[k]}
      </p>
    ) : null
  const Label = ({ k, children, req }: { k: string; children: string; req?: boolean }) => (
    <label htmlFor={id(k)} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/60">
      {children}
      {req && <span className="text-gold"> *</span>}
    </label>
  )

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-7 sm:grid-cols-2" aria-label={mode === 'vendor' ? 'Vendor enquiry form' : 'Contact enquiry form'}>
      <div>
        <Label k="name" req>Name</Label>
        <input {...fieldProps('name')} type="text" autoComplete="name" className="field" placeholder="Your full name" />
        <Err k="name" />
      </div>
      <div>
        <Label k="company" req={mode === 'vendor'}>Company name</Label>
        <input {...fieldProps('company')} type="text" autoComplete="organization" className="field" placeholder={mode === 'vendor' ? 'Your company' : 'Restaurant or company'} />
        <Err k="company" />
      </div>
      <div>
        <Label k="email" req>Email address</Label>
        <input {...fieldProps('email')} type="email" autoComplete="email" className="field" placeholder="name@company.com" />
        <Err k="email" />
      </div>
      <div>
        <Label k="phone">Phone number</Label>
        <input {...fieldProps('phone')} type="tel" autoComplete="tel" className="field" placeholder="+000 0000 0000" />
        <Err k="phone" />
      </div>

      {mode === 'contact' ? (
        <div className="sm:col-span-2">
          <Label k="category" req>Interested packaging category</Label>
          <select {...fieldProps('category')} className="field cursor-pointer">
            <option value="">Select a category…</option>
            {enquiryCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Err k="category" />
        </div>
      ) : (
        <fieldset className="sm:col-span-2" aria-describedby={errors.supplies && touched.supplies ? 'vendor-supplies-err' : undefined}>
          <legend className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/60">
            What do you supply?<span className="text-gold"> *</span>
          </legend>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {vendorSupplies.map((s) => {
              const on = supplies.includes(s)
              return (
                <label
                  key={s}
                  className={`cursor-pointer rounded-full border px-4 py-2.5 text-[13px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                    on ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/25 bg-white/50 hover:border-gold'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => {
                      const next = on ? supplies.filter((x) => x !== s) : [...supplies, s]
                      setSupplies(next)
                      setTouched((t) => ({ ...t, supplies: true }))
                      setErrors(validate(mode, values, next))
                    }}
                  />
                  {s}
                </label>
              )
            })}
          </div>
          {errors.supplies && touched.supplies && (
            <p id="vendor-supplies-err" className="mt-2 text-[12.5px] text-[#B3261E]">
              {errors.supplies}
            </p>
          )}
        </fieldset>
      )}

      <div className="sm:col-span-2">
        <Label k="message" req>{mode === 'vendor' ? 'Tell us about your products and capabilities' : 'Message'}</Label>
        <textarea {...fieldProps('message')} rows={4} className="field resize-y" placeholder={mode === 'vendor' ? 'Products, typical order sizes, print capabilities, locations served…' : 'Tell us what you need — items, quantities, merchants, timelines.'} />
        <Err k="message" />
      </div>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
        </label>
      </div>

      <div className="sm:col-span-2">
        {status === 'error' && (
          <p className="mb-5 flex items-start gap-2 text-[14px] text-[#B3261E]" role="alert">
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            Something went wrong sending your enquiry. Please try again in a moment.
          </p>
        )}
        <Button type="submit" variant="dark" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : mode === 'vendor' ? 'Submit Vendor Enquiry' : 'Submit Enquiry'}
        </Button>
      </div>
    </form>
  )
}
