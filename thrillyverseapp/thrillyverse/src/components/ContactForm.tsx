import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { sendContactEmail } from '../lib/email'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const initialState = {
  name: '',
  email: '',
  subject: '',
  message: ''
}

export function ContactForm() {
  const [form, setForm] = useState(initialState)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('contact_submissions').insert({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message
        })

        if (error) {
          throw new Error(error.message)
        }
      }

      const emailResult = await sendContactEmail(form)

      if (!emailResult.ok) {
        toast.warning('Message saved, but email delivery needs EmailJS setup')
      } else {
        toast.success('Message sent successfully')
      }

      setForm(initialState)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="field-grid card contact-form-card" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </label>

      <label>
        <span>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
      </label>

      <label>
        <span>Subject</span>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
          required
        />
      </label>

      <label>
        <span>Message</span>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          required
        />
      </label>

      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}