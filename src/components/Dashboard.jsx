import React, { useState, useRef, useCallback } from 'react'
import { createWorker } from 'tesseract.js'

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  DONE: 'done',
  ERROR: 'error',
}

export default function Dashboard({ onSave, recentCompetitions }) {
  const [status, setStatus] = useState(STATUS.IDLE)
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const fileInputRef = useRef(null)

  const processImage = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target.result
      setImageDataUrl(dataUrl)
      setStatus(STATUS.LOADING)
      setProgress(0)
      setExtractedText('')
      setSavedMsg('')

      try {
        const worker = await createWorker('eng', 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100))
              setProgressMsg('Recognizing text...')
            } else if (m.status === 'loading tesseract core') {
              setProgressMsg('Loading Tesseract core...')
              setProgress(10)
            } else if (m.status === 'initializing tesseract') {
              setProgressMsg('Initializing Tesseract...')
              setProgress(20)
            } else if (m.status === 'loading language traineddata') {
              setProgressMsg('Loading language data...')
              setProgress(35)
            } else if (m.status === 'initialized tesseract') {
              setProgressMsg('Initialized! Starting recognition...')
              setProgress(50)
            } else {
              setProgressMsg(m.status)
            }
          },
        })

        const { data: { text } } = await worker.recognize(dataUrl)
        await worker.terminate()

        const cleaned = text
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim()

        setExtractedText(cleaned)
        setProgress(100)
        setStatus(STATUS.DONE)
      } catch (err) {
        console.error(err)
        setStatus(STATUS.ERROR)
        setProgressMsg('Error: ' + err.message)
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) processImage(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processImage(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleSave = () => {
    if (!extractedText) return
    onSave(extractedText, imageDataUrl)
    setSavedMsg('Saved successfully!')
    setStatus(STATUS.IDLE)
    setImageDataUrl(null)
    setExtractedText('')
    setProgress(0)
    setTimeout(() => setSavedMsg(''), 3000)
  }

  const handleReset = () => {
    setStatus(STATUS.IDLE)
    setImageDataUrl(null)
    setExtractedText('')
    setProgress(0)
    setProgressMsg('')
    setSavedMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Upload a competition poster to extract text using OCR</p>
        </div>

        {/* Success banner */}
        {savedMsg && (
          <div className="mb-4 px-4 py-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {savedMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                ${isDragging
                  ? 'border-indigo-400 bg-indigo-900/20'
                  : 'border-gray-600 bg-gray-800 hover:border-indigo-500 hover:bg-gray-750'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {imageDataUrl ? (
                <div className="space-y-3">
                  <img
                    src={imageDataUrl}
                    alt="Uploaded poster"
                    className="max-h-48 mx-auto rounded-lg object-contain shadow-lg"
                  />
                  <p className="text-gray-400 text-sm">Click to upload a different image</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Drop your poster here</p>
                    <p className="text-gray-400 text-sm mt-1">or click to browse files</p>
                    <p className="text-gray-600 text-xs mt-2">PNG, JPG, JPEG, WEBP supported</p>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {status === STATUS.LOADING && (
              <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {progressMsg || 'Processing...'}
                  </span>
                  <span className="text-indigo-400 font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {status === STATUS.DONE && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save as Competition Post
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
                >
                  Reset
                </button>
              </div>
            )}

            {status === STATUS.ERROR && (
              <div className="px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
                <p className="font-medium">OCR Failed</p>
                <p className="text-xs mt-1">{progressMsg}</p>
                <button onClick={handleReset} className="mt-2 text-red-400 underline text-xs">Try again</button>
              </div>
            )}
          </div>

          {/* Extracted Text */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 h-full min-h-[280px] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Extracted Text</h3>
                {extractedText && (
                  <span className="text-xs text-gray-500">{extractedText.length} chars</span>
                )}
              </div>
              {extractedText ? (
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="flex-1 bg-gray-900 text-gray-200 text-sm rounded-lg p-3 resize-none border border-gray-700 focus:border-indigo-500 focus:outline-none font-mono leading-relaxed"
                  placeholder="Extracted text will appear here..."
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-600 text-sm text-center">
                    {status === STATUS.LOADING
                      ? 'Extracting text from image...'
                      : 'Upload an image to see extracted text'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recently Processed */}
        {recentCompetitions && recentCompetitions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">Recently Processed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentCompetitions.slice(0, 3).map((comp) => (
                <div key={comp.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                  {comp.imageDataUrl && (
                    <img
                      src={comp.imageDataUrl}
                      alt={comp.title}
                      className="w-full h-28 object-cover rounded-lg mb-3"
                    />
                  )}
                  <p className="text-white text-sm font-medium truncate">{comp.title}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(comp.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
