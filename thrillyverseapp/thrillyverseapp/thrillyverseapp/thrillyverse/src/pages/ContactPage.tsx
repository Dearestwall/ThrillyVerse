import { ContactForm } from '../components/ContactForm'
import { SectionTitle } from '../components/ui/SectionTitle'

export function ContactPage() {
  return (
    <section className="section">
      <div className="container contact-split">
        <div>
          <SectionTitle
            eyebrow="Contact"
            title="Send a message through the app"
            text="The contact page is built for enquiry capture, email sending, and admin-side submission review."
          />

          <div className="contact-links card">
            <a href="mailto:thrillyverse@gmail.com">thrillyverse@gmail.com</a>
            <a href="https://t.me/+LniQHT_ltBsyNmE1" target="_blank" rel="noopener noreferrer">Telegram contact</a>
            <a href="https://www.instagram.com/thrillyverse/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}