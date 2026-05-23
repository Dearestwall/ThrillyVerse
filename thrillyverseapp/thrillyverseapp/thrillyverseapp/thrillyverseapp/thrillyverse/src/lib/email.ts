import emailjs from '@emailjs/browser'
import type { ContactSubmission } from '../types'

type ContactPayload = Omit<ContactSubmission, 'id' | 'created_at'>

export async function sendContactEmail(payload: ContactPayload) {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

  if (!publicKey || !serviceId || !templateId) {
    return { ok: false as const, reason: 'missing_env' as const }
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: payload.name,
        from_email: payload.email,
        subject: payload.subject,
        message: payload.message,
        to_email: 'thrillyverse@gmail.com'
      },
      {
        publicKey
      }
    )

    return { ok: true as const }
  } catch {
    return { ok: false as const, reason: 'send_failed' as const }
  }
}