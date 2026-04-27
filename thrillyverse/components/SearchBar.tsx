'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { useCallback } from 'react'

interface Props {
  defaultValue?: string
  placeholder?: string
}

export default function SearchBar({ defaultValue = '', placeholder = 'Search...' }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set('q', term)
      } else {
        params.delete('q')
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex gap-2 mb-6 max-w-xl mx-auto">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          🔍
        </span>
        <input
          type="search"
          defaultValue={defaultValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors"
        />
      </div>
    </div>
  )
}