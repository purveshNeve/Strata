import { UploadTestButton } from '../upload/UploadTestButton'

export function TopNav() {
  return (
    <header className="border-b border-[#E7E5E4] bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-17 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="./logo.png" className='size-10'></img>
          <span className="text-lg font-semibold tracking-tight">Strata</span>
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

          <div className="h-9 w-9 rounded-full bg-[#E7E5E4] border border-[#D6D3D1] flex items-center justify-center text-xs font-medium text-[#57534E]">
            A
          </div>
        </div>
      </div>
    </header>
  )
}

