import Link from 'next/link'
import type { SiteSettings } from '@/lib/settings'

type Props = {
  settings: SiteSettings
}

export default function Footer({ settings }: Props) {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 px-4 py-10 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          <div>
            <div className="flex items-center gap-2 mb-3">
              {settings.site_logo_url && (
                <img src={settings.site_logo_url} alt={settings.site_name}
                  className="w-8 h-8 rounded-lg object-cover" />
              )}
              <h3 className="text-white font-bold text-sm">{settings.site_name}</h3>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">{settings.site_tagline}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Quick Links</h3>
            <ul className="space-y-2">
              {([['/', 'Home'], ['/movies', 'Movies'], ['/material', 'Materials']] as const).map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-500 hover:text-purple-400 text-xs transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Telegram</h3>
            <ul className="space-y-2">
              <li>
                <a href={settings.social_telegram_movies} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-400 text-xs transition-colors">
                  🎬 Movies Channel
                </a>
              </li>
              <li>
                <a href={settings.social_telegram_material} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-400 text-xs transition-colors">
                  📚 MaterialVerse
                </a>
              </li>
              <li>
                <a href={settings.contact_telegram} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-400 text-xs transition-colors">
                  💬 Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <a href={settings.social_youtube_main} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-400 text-xs transition-colors">
                  ▶️ YouTube
                </a>
              </li>
              <li>
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-400 text-xs transition-colors">
                  📸 Instagram
                </a>
              </li>
              <li>
                <a href={settings.social_youtube_gaming} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-400 text-xs transition-colors">
                  🎮 Gaming Channel
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Terms
            </Link>
            <a href={`mailto:${settings.contact_email}`}
              className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}