import type { Material } from '@/lib/types'

export default function MaterialCard({ material }: { material: Material }) {
  return (
    <a
      href={material.drive_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-brand/50 transition-all"
    >
      {material.thumbnail_url ? (
        <img src={material.thumbnail_url} alt={material.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" loading="lazy" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">📄</div>
      )}
      <div>
        <h3 className="font-semibold text-sm leading-tight mb-1">{material.title}</h3>
        {material.description && <p className="text-xs text-gray-400 line-clamp-2">{material.description}</p>}
        <span className="text-xs text-brand-light mt-1 block">Open in Drive →</span>
      </div>
    </a>
  )
}