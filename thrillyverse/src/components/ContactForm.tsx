// src/components/ContactForm.tsx
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { sendContactEmail } from '../lib/email'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import './ContactForm.css'

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
    <form className="contact-form-card card" onSubmit={handleSubmit}>
      <div className="contact-form-grid">
        <label className="contact-form-field">
          <span>Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Your name"
          />
        </label>

        <label className="contact-form-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
            placeholder="you@example.com"
          />
        </label>

        <label className="contact-form-field">
          <span>Subject</span>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
            required
            placeholder="What is this about?"
          />
        </label>

        <label className="contact-form-field contact-form-field--full">
          <span>Message</span>
          <textarea
            rows={6}
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            required
            placeholder="Write your message"
          />
        </label>
      </div>

      <button type="submit" className="button button-primary contact-form-submit" disabled={pending}>
        {pending ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}