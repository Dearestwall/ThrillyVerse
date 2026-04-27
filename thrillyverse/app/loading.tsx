export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-700 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    </div>
  )
}