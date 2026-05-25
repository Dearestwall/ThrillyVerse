'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { EMAILJS_CONFIG } from '@/lib/emailjs';
import { Send, Mail, MessageCircle, MapPin, Clock3, ArrowUpRight } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'thrillyverse@gmail.com', href: 'mailto:thrillyverse@gmail.com' },
  { icon: MessageCircle, label: 'Telegram', value: '@ThrillyVerse', href: 'https://t.me/+LniQHT_ltBsyNmE1' },
  { icon: MapPin, label: 'Based in', value: 'Punjab, India', href: '#' },
  { icon: Clock3, label: 'Availability', value: 'Usually replies within 24 hours', href: '#' },
];

const SOCIALS = [
  {
    label: 'YouTube', sub: 'Main channel', href: 'https://www.youtube.com/@ThrillyVerse', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z"/></svg>
    )
  },
  {
    label: 'Instagram', sub: 'Behind the scenes', href: 'https://www.instagram.com/thrillyverse/', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
    )
  },
  {
    label: 'Telegram', sub: 'Fast updates', href: 'https://t.me/thrillmoviesverse', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
    )
  },
];

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  const isConfigured = useMemo(
    () => Boolean(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey),
    [],
  );

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.from('contacts').insert({ ...values, source: 'website' });
      if (isConfigured) {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name: values.name,
            from_email: values.email,
            phone: values.phone,
            subject: values.subject,
            message: values.message,
          },
          EMAILJS_CONFIG.publicKey,
        );
      }
      toast.success("Message sent! We'll get back to you soon 🎉");
      form.reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="home-section contact-section-pro">
      <div className="container-narrow">
        <div className="text-center mb-12 fade-up">
          <div className="section-eyebrow">Get in Touch</div>
          <h2 className="section-title contact-title">Contact ThrillyVerse</h2>
          <p className="section-description">Questions, ideas, feedback or collaboration — reach out through the form or our official social channels.</p>
        </div>

        <div className="contact-shell">
          <div className="contact-side-panel slide-in-left">
            <div className="contact-panel-top">
              <div className="contact-panel-kicker">Official Contact</div>
              <h3>We would love to hear from you</h3>
              <p>Use your preferred channel and we will guide you to the right place quickly.</p>
            </div>

            <div className="contact-info-grid">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="contact-info-item contact-info-item--compact group">
                  <div className="contact-info-icon group-hover:scale-110 transition-transform">
                    <Icon size={16} />
                  </div>
                  <div className="contact-info-content">
                    <p className="contact-info-meta">{label}</p>
                    <p className="contact-info-main">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="contact-social-card card">
              <div className="contact-social-title">Follow ThrillyVerse</div>
              <div className="contact-social-list contact-social-list--compact">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-item social-link-item--compact"
                  >
                    <span className="social-link-icon">{s.icon}</span>
                    <span className="social-link-copy">
                      <span className="social-link-label">{s.label}</span>
                      <span className="social-link-sub">{s.sub}</span>
                    </span>
                    <ArrowUpRight size={14} className="social-link-arrow" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="contact-form-pro card section-reveal">
            <div className="contact-form-head">
              <div>
                <div className="contact-form-kicker">Send a message</div>
                <h3>Tell us what you need</h3>
              </div>
              {!isConfigured && <span className="contact-config-pill">EmailJS optional</span>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" placeholder="Your name" {...form.register('name')} />
                {form.formState.errors.name && <p className="form-error">{form.formState.errors.name.message}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" placeholder="you@email.com" {...form.register('email')} />
                {form.formState.errors.email && <p className="form-error">{form.formState.errors.email.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 XXXXX XXXXX" {...form.register('phone')} />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" placeholder="What's it about?" {...form.register('subject')} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea className="form-input" rows={5} placeholder="Write your message here…" {...form.register('message')} />
              {form.formState.errors.message && <p className="form-error">{form.formState.errors.message.message}</p>}
            </div>

            <div className="contact-form-actions">
              <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    Sending…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send size={16} />
                    Send Message
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}