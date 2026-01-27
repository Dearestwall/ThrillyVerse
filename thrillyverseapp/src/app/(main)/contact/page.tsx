// src/app/(main)/contact/page.tsx - CONTACT PAGE
'use client';

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Clock,
  Zap
} from 'lucide-react';
// load firestore helper dynamically to avoid compile-time export mismatch

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
    // dynamically import the firestore helper at runtime to avoid TypeScript compile errors
    const firestoreModule = await import('@/lib/firebase/firestore');
    // support different export shapes: named export 'addDocument', named 'addDoc', or default export
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addDocument: (collection: string, data: any) => Promise<any> =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (firestoreModule as any).addDocument ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (firestoreModule as any).addDoc ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (firestoreModule as any).default?.addDocument ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (firestoreModule as any).default?.addDoc ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (firestoreModule as any).default ||
      undefined;

    if (!addDocument) {
      throw new Error('addDocument function not found in firestore helper');
    }

    await addDocument('contact_messages', {
      ...formData,
      createdAt: new Date(),
      read: false,
    });

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@thrillyverse.com',
      link: 'mailto:contact@thrillyverse.com',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 98765 43210',
      link: 'tel:+919876543210',
      gradient: 'from-green-600 to-emerald-600',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Ludhiana, Punjab, India',
      link: '#',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      value: 'Mon-Sat: 9 AM - 6 PM',
      link: '#',
      gradient: 'from-orange-600 to-red-600',
    },
  ];

  const socialLinks = [
    { icon: Github, name: 'GitHub', link: 'https://github.com/Dearestwall', color: 'hover:text-gray-900' },
    { icon: Linkedin, name: 'LinkedIn', link: 'https://linkedin.com', color: 'hover:text-blue-600' },
    { icon: Twitter, name: 'Twitter', link: 'https://twitter.com', color: 'hover:text-sky-500' },
    { icon: Instagram, name: 'Instagram', link: 'https://instagram.com', color: 'hover:text-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">Get In Touch</span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 mt-2">
            Let&apos;s Work <span className="text-gradient">Together</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s discuss how I can help bring your ideas to life
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 animate-slide-in-left">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Send className="w-6 h-6 text-indigo-600" />
                Send a Message
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-slide-down">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-semibold">Message sent successfully!</p>
                  </div>
                  <p className="text-sm text-green-700 mt-1">I&apos;ll get back to you soon.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input"
                    placeholder="Web Development Project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="input resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full text-lg py-4"
                >
                  {loading ? (
                    <>
                      <div className="spinner spinner-sm" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                      <Zap className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <a
                key={info.title}
                href={info.link}
                className={`card-interactive p-6 block animate-scale-in animate-delay-${(index + 1) * 100}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-gradient-to-br ${info.gradient} rounded-xl flex-shrink-0`}>
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  </div>
                </div>
              </a>
            ))}

            {/* Social Links */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Follow Me</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <div className="card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h3 className="font-semibold text-gray-900">Quick Response</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                I typically respond within 24 hours during business days
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-success">Fast Reply</span>
                <span className="badge badge-info">Professional</span>
                <span className="badge badge-warning">Flexible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}