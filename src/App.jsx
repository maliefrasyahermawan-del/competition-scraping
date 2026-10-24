import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import CompetitionInfo from './components/CompetitionInfo'
import { useCompetitions } from './hooks/useCompetitions'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const { competitions, addCompetition, deleteCompetition } = useCompetitions()

  const handleSave = (rawText, imageDataUrl) => {
    addCompetition(rawText, imageDataUrl)
    // Optionally navigate to competitions page after saving
    // setActivePage('competitions')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        competitionCount={competitions.length}
      />

      <main className="flex-1 overflow-hidden flex flex-col">
        {activePage === 'dashboard' && (
          <Dashboard
            onSave={handleSave}
            recentCompetitions={competitions}
          />
        )}
        {activePage === 'competitions' && (
          <CompetitionInfo
            competitions={competitions}
            onDelete={deleteCompetition}
          />
        )}
      </main>
    </div>
  )
}
