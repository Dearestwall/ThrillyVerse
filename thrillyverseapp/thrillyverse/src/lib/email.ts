import emailjs from '@emailjs/browser'

export type ContactPayload = {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(payload: ContactPayload) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
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
        reply_to: payload.email,
        to_name: 'ThrillyVerse'
      },
      { publicKey }
    )

    return { ok: true as const }
  } catch {
    return { ok: false as const, reason: 'send_failed' as const }
  }
}