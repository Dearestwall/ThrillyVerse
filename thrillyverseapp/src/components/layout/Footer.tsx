// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Youtube, Send, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Telegram - Movies',
      href: 'https://t.me/thrillmoviesverse',
      icon: Send,
    },
    {
      name: 'Telegram - Materials',
      href: 'https://t.me/icseverse',
      icon: Send,
    },
    {
      name: 'YouTube - Gaming',
      href: 'https://youtube.com/channel/UCGSsWtRJ5ciemRsuFfixmvQ',
      icon: Youtube,
    },
    {
      name: 'YouTube - ThrillyVerse',
      href: 'https://www.youtube.com/@ThrillyVerse',
      icon: Youtube,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/thrillyverse/',
      icon: Instagram,
    },
  ];

  const tools = [
    { name: 'Percentage Calculator', href: '/projects/percentage-calculator' },
    { name: 'Tic Tac Toe', href: '/projects/tic-tac-toe' },
    { name: 'Calculator', href: '/projects/calculator' },
    { name: 'URL Shortener', href: 'https://urls.thrillyverse.workers.dev/' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tools Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <span>🛠️</span>
              <span>Tools</span>
            </h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    target={tool.href.startsWith('http') ? '_blank' : undefined}
                    rel={tool.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <span>🌐</span>
              <span>Social Media</span>
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <span>📧</span>
              <span>Contact Us</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:thrillyverse@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Email: thrillyverse@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/+LniQHT_ltBsyNmE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Telegram: Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} ThrillyVerse. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Made with ❤️ by ThrillyVerse Team
          </p>
        </div>
      </div>
    </footer>
  );
}