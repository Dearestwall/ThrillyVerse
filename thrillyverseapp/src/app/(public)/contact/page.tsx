// src/app/(public)/contact/page.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Send via Formspree
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      content: 'thrillyverse@gmail.com',
      link: 'mailto:thrillyverse@gmail.com',
    },
    {
      icon: Phone,
      title: 'Telegram',
      content: '@ThrillyVerse',
      link: 'https://t.me/+LniQHT_ltBsyNmE1',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Ludhiana, Punjab, India',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you. Reach out to us using
            any of the methods below.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <a
                key={idx}
                href={method.link}
                target={method.link.startsWith('http') ? '_blank' : undefined}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 break-all">{method.content}</p>
              </a>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Send us a Message
          </h2>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              ✓ Thank you for your message! We'll get back to you soon.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="bug">Report a Bug</option>
                <option value="feature">Feature Request</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Social Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600 mb-4">Connect with us on social media</p>
            <div className="flex justify-center gap-4">
              <a
                href="https://t.me/thrillmoviesverse"
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                📱 Telegram
              </a>
              <a
                href="https://youtube.com/@ThrillyVerse"
                className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                📺 YouTube
              </a>
              <a
                href="https://instagram.com/thrillyverse"
                className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                📷 Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}