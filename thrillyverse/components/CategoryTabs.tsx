'use client'

import { useTransition } from 'react'                          // ← react, NOT next/navigation
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const TABS = [
  { value: 'hindi',     label: '🇮🇳 Hindi' },
  { value: 'punjabi',   label: '🎵 Punjabi' },
  { value: 'hollywood', label: '🌍 Hollywood' },
  { value: 'webseries', label: '📺 Web Series' },
]

interface Props {
  active: string
}

export default function CategoryTabs({ active }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const setCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', value)
    params.delete('q')
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex gap-2 flex-wrap mb-6 justify-center">
      {TABS.map((tab) => {
        const isActive = active === tab.value
        const baseClass = 'px-5 py-2 rounded-full text-sm font-medium transition-colors'
        const activeClass = 'bg-purple-700 text-white'
        const inactiveClass = 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
        return (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            disabled={isPending}
            className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}