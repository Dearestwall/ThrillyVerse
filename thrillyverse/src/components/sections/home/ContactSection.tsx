'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { EMAILJS_CONFIG } from '@/lib/emailjs';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

const formSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Enter a valid email'),
  phone:   z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type FormValues = z.infer<typeof formSchema>;

const CONTACT_INFO = [
  { icon: Mail,    label: 'Email',    value: 'thrillyverse@gmail.com',      href: 'mailto:thrillyverse@gmail.com' },
  { icon: Phone,   label: 'Telegram', value: '@ThrillyVerse',               href: 'https://t.me/+LniQHT_ltBsyNmE1' },
  { icon: MapPin,  label: 'Based in', value: 'Punjab, India',               href: '#' },
];

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.from('contacts').insert({ ...values, source: 'website' });

      if (EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey) {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          { from_name: values.name, from_email: values.email, phone: values.phone, subject: values.subject, message: values.message },
          EMAILJS_CONFIG.publicKey,
        );
      }

      toast.success('Message sent! We\'ll get back to you soon 🎉');
      form.reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="container-narrow">
        <div className="text-center mb-12 fade-up">
          <div className="section-eyebrow">Get in Touch</div>
          <h2 className="section-title">Contact Us</h2>
          <p className="section-description">Have questions, suggestions, or feedback? We'd love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Info Panel */}
          <div className="md:col-span-2 space-y-4 slide-in-left">
            {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="contact-info-item group">
                <div className="contact-info-icon group-hover:scale-110 transition-transform">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs text-text-faint font-semibold uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold mt-0.5">{value}</p>
                </div>
              </a>
            ))}

            <div className="card p-5 mt-6">
              <p className="text-xs text-text-faint uppercase tracking-wider font-semibold mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: 'YouTube', href: 'https://www.youtube.com/@ThrillyVerse' },
                  { label: 'Instagram', href: 'https://www.instagram.com/thrillyverse/' },
                  { label: 'Telegram', href: 'https://t.me/thrillmoviesverse' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm text-xs">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="md:col-span-3 card p-7 space-y-5 section-reveal">
            <div className="grid md:grid-cols-2 gap-5">
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
            <div className="grid md:grid-cols-2 gap-5">
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
            <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Sending…
                </span>
              ) : (
                <span className="flex items-center gap-2"><Send size={16} /> Send Message</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
