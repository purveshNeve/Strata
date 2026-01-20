import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadTestButton } from '../upload/UploadTestButton'
import { useAuth } from '../../contexts/AuthContext'

export function TopNav() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])

  const handleLogout = () => {
    logout()
    navigate('/signin')
    setShowProfileMenu(false)
  }

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'A'
  }

  return (
    <header className="border-b border-[#E7E5E4] bg-white relative z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-17 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="./logo.png" className='size-10'></img>
          <a className="text-lg font-semibold tracking-tight" href="./">Strata</a>
        </div>

        <div className="flex items-center gap-4">
          <UploadTestButton />

          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E5E4] bg-[#F5F5F4] text-[#57534E] hover:bg-white transition-colors"
          >
            <span className="relative flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>

            </span>
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-600 text-[9px] font-semibold text-white">
              3
            </span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-9 w-9 rounded-full bg-[#E7E5E4] border border-[#D6D3D1] flex items-center justify-center text-xs font-medium text-[#57534E] hover:bg-[#D6D3D1] transition-colors cursor-pointer"
              aria-label="Profile menu"
            >
              {getInitials()}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[#E7E5E4] bg-white shadow-lg py-1 z-50">
                {user && (
                  <div className="px-4 py-3 border-b border-[#E7E5E4]">
                    <p className="text-sm font-medium text-[#2D3436]">{user.name || 'User'}</p>
                    <p className="text-xs text-[#8D8A86] truncate">{user.email}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    navigate('/dashboard#settings')
                    setShowProfileMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#57534E] hover:bg-[#F5F5F4] transition-colors"
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

