const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'topics', label: 'Topic mastery' },
  { id: 'attempts', label: 'Attempt history' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'settings', label: 'Settings' },
]

export function NavTabs({ activeTab, onChange }) {
  return (
    <nav className="border-b border-[#E7E5E4]">
      <div className="flex gap-6 text-sm">
        {tabs.map(tab => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={
                'relative py-3 border-b-2 -mb-px whitespace-nowrap transition-colors ' +
                (isActive
                  ? 'border-blue-600 text-[#1C1917] font-medium'
                  : 'border-transparent text-[#57534E] hover:text-[#1C1917]')
              }
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-blue-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

