'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { EMAILJS_CONFIG } from '@/lib/emailjs';
import {
  Send,
  Mail,
  MessageCircle,
  MapPin,
  Clock3,
  ArrowUpRight,
  Youtube,
  Instagram,
  SendHorizonal,
} from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

type ContactItem = {
  icon: 'mail' | 'telegram' | 'map' | 'clock';
  label: string;
  value: string;
  href: string;
};

type SocialItem = {
  label: string;
  sub: string;
  href: string;
  icon: 'youtube' | 'instagram' | 'telegram';
};

type SiteSettings = {
  contact_eyebrow?: string | null;
  contact_title?: string | null;
  contact_description?: string | null;
  contact_panel_kicker?: string | null;
  contact_panel_title?: string | null;
  contact_panel_text?: string | null;
  contact_email?: string | null;
  contact_telegram?: string | null;
  contact_location?: string | null;
  contact_availability?: string | null;
  social_youtube?: string | null;
  social_instagram?: string | null;
  social_telegram?: string | null;
  contact_info_items?: ContactItem[] | null;
  social_items?: SocialItem[] | null;
};

const contactIconMap = {
  mail: Mail,
  telegram: MessageCircle,
  map: MapPin,
  clock: Clock3,
};

const socialIconMap = {
  youtube: Youtube,
  instagram: Instagram,
  telegram: SendHorizonal,
};

export function ContactSection({ settings }: { settings?: SiteSettings | null }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  const isConfigured = useMemo(
    () =>
      Boolean(
        EMAILJS_CONFIG.serviceId &&
          EMAILJS_CONFIG.templateId &&
          EMAILJS_CONFIG.publicKey
      ),
    []
  );

  const contactItems: ContactItem[] =
    settings?.contact_info_items?.length
      ? settings.contact_info_items
      : [
          {
            icon: 'mail',
            label: 'Email',
            value: settings?.contact_email?.trim() || 'thrillyverse@gmail.com',
            href: `mailto:${settings?.contact_email?.trim() || 'thrillyverse@gmail.com'}`,
          },
          {
            icon: 'telegram',
            label: 'Telegram',
            value: '@ThrillyVerse',
            href:
              settings?.contact_telegram?.trim() ||
              'https://t.me/+LniQHT_ltBsyNmE1',
          },
          {
            icon: 'map',
            label: 'Based in',
            value: settings?.contact_location?.trim() || 'Punjab, India',
            href: '#',
          },
          {
            icon: 'clock',
            label: 'Availability',
            value:
              settings?.contact_availability?.trim() ||
              'Usually replies within 24 hours',
            href: '#',
          },
        ];

  const socialItems: SocialItem[] =
    settings?.social_items?.length
      ? settings.social_items
      : [
          {
            label: 'YouTube',
            sub: 'Main channel',
            href:
              settings?.social_youtube?.trim() ||
              'https://www.youtube.com/@ThrillyVerse',
            icon: 'youtube',
          },
          {
            label: 'Instagram',
            sub: 'Behind the scenes',
            href:
              settings?.social_instagram?.trim() ||
              'https://www.instagram.com/thrillyverse/',
            icon: 'instagram',
          },
          {
            label: 'Telegram',
            sub: 'Fast updates',
            href:
              settings?.social_telegram?.trim() ||
              'https://t.me/thrillmoviesverse',
            icon: 'telegram',
          },
        ];

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const supabase = createClient();

      await supabase.from('contacts').insert({
        ...values,
        source: 'website',
      });

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
          EMAILJS_CONFIG.publicKey
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
      <div className="container-default">
        <div className="text-center contact-intro-compact fade-up">
          <div className="section-eyebrow">
            {settings?.contact_eyebrow?.trim() || 'Get in Touch'}
          </div>
          <h2 className="section-title contact-title">
            {settings?.contact_title?.trim() || 'Contact ThrillyVerse'}
          </h2>
          <p className="section-description contact-description-compact">
            {settings?.contact_description?.trim() ||
              'Questions, ideas, feedback or collaboration — reach out through the form or our official social channels.'}
          </p>
        </div>

        <div className="contact-shell contact-shell--compact">
          <div className="contact-side-panel slide-in-left">
            <div className="contact-panel-top">
              <div className="contact-panel-kicker">
                {settings?.contact_panel_kicker?.trim() || 'Official Contact'}
              </div>
              <h3>
                {settings?.contact_panel_title?.trim() ||
                  'We would love to hear from you'}
              </h3>
              <p>
                {settings?.contact_panel_text?.trim() ||
                  'Use your preferred channel and we will guide you to the right place quickly.'}
              </p>
            </div>

            <div className="contact-info-grid contact-info-grid--compact">
              {contactItems.map(({ icon, label, value, href }) => {
                const Icon = contactIconMap[icon] ?? Mail;

                return (
                  <a
                    key={label}
                    href={href}
                    className="contact-info-item contact-info-item--compact group"
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <div className="contact-info-icon">
                      <Icon size={16} />
                    </div>

                    <div className="contact-info-content">
                      <p className="contact-info-meta">{label}</p>
                      <p className="contact-info-main">{value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="contact-social-card card">
              <div className="contact-social-title">Follow ThrillyVerse</div>

              <div className="contact-social-grid contact-social-grid--compact">
                {socialItems.map((s) => {
                  const Icon = socialIconMap[s.icon] ?? ArrowUpRight;

                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item social-link-item--compact social-link-item--dense"
                    >
                      <span className="social-link-icon">
                        <Icon size={15} />
                      </span>

                      <span className="social-link-copy">
                        <span className="social-link-label">{s.label}</span>
                        <span className="social-link-sub">{s.sub}</span>
                      </span>

                      <ArrowUpRight size={14} className="social-link-arrow" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="contact-form-pro card section-reveal contact-form-pro--compact"
          >
            <div className="contact-form-head">
              <div>
                <div className="contact-form-kicker">Send a message</div>
                <h3>Tell us what you need</h3>
              </div>

              {!isConfigured && (
                <span className="contact-config-pill">EmailJS optional</span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  className="form-input"
                  placeholder="Your name"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="form-error">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@email.com"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="form-error">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  placeholder="+91 XXXXX XXXXX"
                  {...form.register('phone')}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  className="form-input"
                  placeholder="What's it about?"
                  {...form.register('subject')}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                className="form-input"
                rows={5}
                placeholder="Write your message here…"
                {...form.register('message')}
              />
              {form.formState.errors.message && (
                <p className="form-error">{form.formState.errors.message.message}</p>
              )}
            </div>

            <div className="contact-form-actions">
              <button
                className="btn btn-primary w-full btn-lg"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
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