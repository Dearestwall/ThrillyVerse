import { FormEvent, useState } from 'react'
import { sendContactEmail } from '../lib/email'
import { useContacts } from '../hooks/resources'

export function ContactForm() {
  const { createItem } = useContacts()
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      subject: String(form.get('subject') || ''),
      message: String(form.get('message') || '')
    }

    setPending(true)
    await createItem(payload as any)
    const email = await sendContactEmail(payload as any)

    setStatus(
      email.ok
        ? 'Message sent successfully.'
        : 'Saved successfully. Connect EmailJS keys to enable live email sending.'
    )

    event.currentTarget.reset()
    setPending(false)
  }

  return (
    <form className="contact-form card" onSubmit={handleSubmit}>
      <div className="field-grid two">
        <label>
          <span>Name</span>
          <input name="name" required placeholder="Your name" />
        </label>

        <label>
          <span>Email</span>
          <input name="email" type="email" required placeholder="Your email" />
        </label>
      </div>

      <label>
        <span>Subject</span>
        <input name="subject" required placeholder="Subject" />
      </label>

      <label>
        <span>Message</span>
        <textarea name="message" rows={6} required placeholder="Tell us what you need" />
      </label>

      <div className="form-actions">
        <button className="button button-primary" disabled={pending}>
          {pending ? 'Sending...' : 'Send message'}
        </button>
        {status && <p className="status-text">{status}</p>}
      </div>
    </form>
  )
}