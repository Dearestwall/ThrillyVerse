'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Material, NewsItem, Quiz } from '@/lib/types'

const CLASS10_SUBJECTS = [
  { value: 'language',               label: 'Language' },
  { value: 'literature',             label: 'Literature' },
  { value: 'maths',                  label: 'Maths' },
  { value: 'physics',                label: 'Physics' },
  { value: 'chemistry',              label: 'Chemistry' },
  { value: 'biology',                label: 'Biology' },
  { value: 'history',                label: 'His/Civics' },
  { value: 'geography',              label: 'Geography' },
  { value: 'computer applications',  label: 'Computer' },
  { value: 'commercial applications', label: 'Commercial' },
  { value: 'secondlanguage',         label: 'Languages' },
  { value: 'hindi',                  label: 'Hindi' },
  { value: 'physical education',     label: 'Phy. Edu' },
  { value: 'economics',              label: 'Economics' },
  { value: 'papers',                 label: 'Q. Papers' },
  { value: 'oswaal',                 label: 'Oswaal' },
]

const CLASS11_SUBJECTS = [
  { value: 'english',          label: 'English' },
  { value: 'maths',            label: 'Maths' },
  { value: 'physics',          label: 'Physics' },
  { value: 'chemistry',        label: 'Chemistry' },
  { value: 'biology',          label: 'Biology' },
  { value: 'accountancy',      label: 'Accountancy' },
  { value: 'business studies', label: 'Business' },
  { value: 'economics',        label: 'Economics' },
  { value: 'computer science', label: 'Computer' },
]

interface Props {
  materials: Material[]
  news: NewsItem[]
  quizzes: Quiz[]
  classLevel: 'class10' | 'class11'
  subject: string
  activeTab: string
}

export default function MaterialTabs({
  materials,
  news,
  quizzes,
  classLevel,
  subject,
  activeTab,
}: Props) {
  const [tab, setTab] = useState(activeTab)
  const [cls, setCls] = useState(classLevel)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const navigate = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => params.set(k, v))
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const subjects = cls === 'class10' ? CLASS10_SUBJECTS : CLASS11_SUBJECTS

  // Tab button style helper
  const tabClass = (value: string) => {
    const base = 'px-4 py-2 text-sm font-medium transition-colors border-b-2'
    const active = 'text-purple-400 border-purple-400'
    const inactive = 'text-gray-400 hover:text-white border-transparent'
    return `${base} ${tab === value ? active : inactive}`
  }

  // Subject button style helper
  const subjectClass = (value: string) => {
    const base = 'px-3 py-1.5 rounded-full text-xs font-medium transition-colors'
    const active = 'bg-purple-700 text-white'
    const inactive = 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
    return `${base} ${subject === value ? active : inactive}`
  }

  // Class button style helper
  const clsClass = (value: string) => {
    const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors'
    const active = 'bg-purple-700 text-white'
    const inactive = 'bg-gray-800 text-gray-300 hover:bg-gray-700'
    return `${base} ${cls === value ? active : inactive}`
  }

  return (
    <div>
      {/* ── Main Tab Bar ── */}
      <div className="flex gap-1 mb-6 border-b border-gray-800">
        <button
          className={tabClass('materials')}
          onClick={() => { setTab('materials'); navigate({ tab: 'materials' }) }}
        >
          📚 Study Materials
        </button>
        <button
          className={tabClass('news')}
          onClick={() => { setTab('news'); navigate({ tab: 'news' }) }}
        >
          📰 News
        </button>
        <button
          className={tabClass('quiz')}
          onClick={() => { setTab('quiz'); navigate({ tab: 'quiz' }) }}
        >
          🧠 Quiz
        </button>
      </div>

      {/* ── Materials Tab ── */}
      {tab === 'materials' && (
        <div>
          {/* Class selector */}
          <div className="flex gap-2 mb-4">
            <button
              className={clsClass('class10')}
              onClick={() => { setCls('class10'); navigate({ class: 'class10', subject: 'literature', tab: 'materials' }) }}
            >
              Class 10
            </button>
            <button
              className={clsClass('class11')}
              onClick={() => { setCls('class11'); navigate({ class: 'class11', subject: 'english', tab: 'materials' }) }}
            >
              Class 11
            </button>
          </div>

          {/* Subject tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {subjects.map((s) => (
              <button
                key={s.value}
                className={subjectClass(s.value)}
                onClick={() => navigate({ class: cls, subject: s.value, tab: 'materials' })}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Materials grid */}
          {materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((m) => (
                <a
                  key={m.id}
                  href={m.drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-600 transition-all hover:scale-105"
                >
                  {m.thumbnail_url ? (
                    <img
                      src={m.thumbnail_url}
                      alt={m.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
                      📄
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2">
                      {m.title}
                    </h3>
                    {m.description && (
                      <p className="text-xs text-gray-400 line-clamp-2">{m.description}</p>
                    )}
                    <span className="text-xs text-purple-400 mt-1 block">Open in Drive</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📚</p>
              <p className="font-medium">No materials for this subject yet</p>
              <p className="text-sm mt-1">Check back soon or try another subject</p>
            </div>
          )}
        </div>
      )}

      {/* ── News Tab ── */}
      {tab === 'news' && (
        <div className="space-y-4 max-w-2xl">
          {news.length > 0 ? (
            news.map((item) => {
              const badgeClass =
                item.type === 'premium'
                  ? 'bg-yellow-900 text-yellow-300'
                  : item.type === 'telegram'
                  ? 'bg-blue-900 text-blue-300'
                  : 'bg-gray-800 text-gray-400'
              return (
                <div
                  key={item.id}
                  className="p-4 bg-gray-900 border border-gray-800 rounded-xl"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${badgeClass}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{item.summary}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              )
            })
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📰</p>
              <p className="font-medium">No news yet</p>
            </div>
          )}
        </div>
      )}

      {/* ── Quiz Tab ── */}
      {tab === 'quiz' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <a
                key={quiz.id}
                href={quiz.form_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-600 transition-all hover:scale-105 block"
              >
                <div className="text-2xl mb-3">🧠</div>
                <h3 className="font-semibold text-white mb-1">{quiz.title}</h3>
                {quiz.description && (
                  <p className="text-sm text-gray-400 mb-3">{quiz.description}</p>
                )}
                <span className="text-xs text-purple-400">Start Quiz</span>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">🧠</p>
              <p className="font-medium">No quizzes available yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}