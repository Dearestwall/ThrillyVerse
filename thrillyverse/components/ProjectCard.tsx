'use client'
import { useState } from 'react'
import type { Project } from '@/lib/types'

export default function ProjectCard({ project }: { project: Project }) {
  const [imgIndex, setImgIndex] = useState(0)
  const screenshots = project.screenshots ?? []

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-brand/40 transition-all">
      {/* Screenshot Slider */}
      {screenshots.length > 0 && (
        <div className="relative aspect-video bg-gray-800">
          <img
            src={screenshots[imgIndex]}
            alt={`${project.title} screenshot ${imgIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {screenshots.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex((p) => (p - 1 + screenshots.length) % screenshots.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs"
              >‹</button>
              <button
                onClick={() => setImgIndex((p) => (p + 1) % screenshots.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs"
              >›</button>
            </>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          {project.logo_url && (
            <img src={project.logo_url} alt={`${project.title} logo`} className="w-10 h-10 rounded-lg object-cover" />
          )}
          <h3 className="font-bold text-white">{project.title}</h3>
        </div>
        {project.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-3">{project.description}</p>
        )}
        <a
          href={project.project_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full text-center py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Open Project →
        </a>
      </div>
    </div>
  )
}