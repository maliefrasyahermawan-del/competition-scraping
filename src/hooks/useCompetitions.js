import { useState, useEffect } from 'react'

const STORAGE_KEY = 'competition_posts'

export function useCompetitions() {
  const [competitions, setCompetitions] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setCompetitions(JSON.parse(stored))
      } catch {
        setCompetitions([])
      }
    }
  }, [])

  const persist = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setCompetitions(data)
  }

  const addCompetition = (rawText, imageDataUrl) => {
    const lines = rawText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)

    const title = lines[0] || 'Untitled Competition'

    const newPost = {
      id: Date.now().toString(),
      title,
      rawText,
      imageDataUrl,
      createdAt: new Date().toISOString(),
    }

    const updated = [newPost, ...competitions]
    persist(updated)
    return newPost
  }

  const deleteCompetition = (id) => {
    const updated = competitions.filter(c => c.id !== id)
    persist(updated)
  }

  const clearAll = () => {
    persist([])
  }

  return {
    competitions,
    addCompetition,
    deleteCompetition,
    clearAll,
  }
}
