import React, { useState } from 'react'

function Modal({ competition, onClose }) {
  if (!competition) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-gray-700 z-10">
        {/* Modal header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-700">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-bold text-white leading-tight">{competition.title}</h2>
            <p className="text-gray-400 text-xs mt-1">
              Added {new Date(competition.createdAt).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {competition.imageDataUrl && (
            <img
              src={competition.imageDataUrl}
              alt={competition.title}
              className="w-full max-h-64 object-contain rounded-xl bg-gray-900"
            />
          )}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Extracted Text</h3>
            <pre className="bg-gray-900 rounded-xl p-4 text-gray-300 text-sm font-mono whitespace-pre-wrap leading-relaxed border border-gray-700">
              {competition.rawText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompetitionCard({ competition, onDelete, onView }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const preview = competition.rawText.slice(0, 150) + (competition.rawText.length > 150 ? '...' : '')
  const dateStr = new Date(competition.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 overflow-hidden group flex flex-col shadow-lg">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-900 overflow-hidden">
        {competition.imageDataUrl ? (
          <img
            src={competition.imageDataUrl}
            alt={competition.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Date badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-gray-300 text-xs px-2 py-1 rounded-md">
          {dateStr}
        </div>
      </div>

      {/* Card content */}
      <div className="flex-1 p-4 space-y-2">
        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">{competition.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{preview}</p>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button
          onClick={() => onView(competition)}
          className="flex-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-150 border border-indigo-700/50 hover:border-indigo-600 flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Full Text
        </button>

        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              onClick={() => onDelete(competition.id)}
              className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-2 rounded-lg transition-colors font-medium"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2.5 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default function CompetitionInfo({ competitions, onDelete }) {
  const [selectedComp, setSelectedComp] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = competitions.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.rawText.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Competition Info</h1>
            <p className="text-gray-400 mt-1">
              {competitions.length} {competitions.length === 1 ? 'competition' : 'competitions'} extracted
            </p>
          </div>

          {competitions.length > 0 && (
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search competitions..."
                className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg py-2 pl-9 pr-4 w-64 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />
            </div>
          )}
        </div>

        {/* Empty State */}
        {competitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg">No competitions yet</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-sm">
              Go to the Dashboard and upload a competition poster to extract and save information here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No results found for "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(comp => (
              <CompetitionCard
                key={comp.id}
                competition={comp}
                onDelete={onDelete}
                onView={setSelectedComp}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal competition={selectedComp} onClose={() => setSelectedComp(null)} />
    </div>
  )
}
