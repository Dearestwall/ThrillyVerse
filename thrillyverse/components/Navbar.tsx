import Link from 'next/link'
import PushNotificationBell from './PushNotificationBell'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="https://i.ibb.co/0pjPXpZy/thrillyverse.png" alt="ThrillyVerse" className="w-9 h-9 rounded-lg" />
          <div>
            <span className="font-bold text-white">ThrillyVerse</span>
            <p className="text-xs text-gray-500 leading-none">Think Beyond The Verse</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/', label: 'Home' },
            { href: '/material', label: 'ICSE Material' },
            { href: '/movies', label: 'Movies' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <PushNotificationBell />
          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-400 hover:text-white" aria-label="Menu">
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}