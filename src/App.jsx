


import { useState } from 'react'
import { TopNav } from './components/layout/TopNav'
import { AppHeader } from './components/layout/AppHeader'
import { NavTabs } from './components/layout/NavTabs'
import { Dashboard } from './components/sections/Dashboard'
import { TopicMastery } from './components/sections/TopicMastery'
import { AttemptHistory } from './components/sections/AttemptHistory'
import { Recommendations } from './components/sections/Recommendations'
import { Settings } from './components/sections/Settings'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917]">
      <TopNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        <AppHeader />
        <NavTabs activeTab={activeTab} onChange={setActiveTab} />

        <section className="mt-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'topics' && <TopicMastery />}
          {activeTab === 'attempts' && <AttemptHistory />}
          {activeTab === 'recommendations' && <Recommendations />}
          {activeTab === 'settings' && <Settings />}
        </section>
      </main>
    </div>
  )
}

export default App
