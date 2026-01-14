import { useRef, useState } from 'react'
import Papa from 'papaparse'
import { useMutation } from '@tanstack/react-query'
import { createAttemptsBulk } from '../../services/attempts'

const DEMO_USER_ID = 'demo-user-1'

export function UploadTestButton() {
  const inputRef = useRef(null)
  const [status, setStatus] = useState(null)

  const mutation = useMutation({
    mutationFn: async rows => {
      const attempts = rows.map(row => ({
        test_session_id: row.test_session_id || row.session_id || null,
        correctness: row.correct === 'true' || row.correct === true,
        confidence_rating: Number(row.confidence_rating || row.confidence || 3),
        time_taken_seconds: Number(row.time_taken_seconds || row.time_seconds || 0),
        mistake_type: row.mistake_type || null,
        question_metadata: {
          topic: row.topic,
          subtopic: row.subtopic,
          skills: row.skills ? String(row.skills).split('|') : [],
        },
      }))

      return createAttemptsBulk(DEMO_USER_ID, attempts)
    },
    onMutate() {
      setStatus('Uploading...')
    },
    onSuccess(result) {
      if (!result.success) {
        setStatus(`Upload failed: ${result.error}`)
        return
      }
      setStatus('Upload successful')
      setTimeout(() => setStatus(null), 3000)
    },
    onError(error) {
      setStatus(error.message || 'Upload failed')
    },
  })

  function handleClick() {
    if (inputRef.current) inputRef.current.click()
  }

  function handleChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: result => {
        if (!Array.isArray(result.data) || result.data.length === 0) {
          setStatus('No rows found in CSV')
          return
        }
        mutation.mutate(result.data)
      },
      error: () => {
        setStatus('Failed to read CSV file')
      },
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
        </svg>
        Upload Test
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
      />
      {status && (
        <p className="hidden sm:block text-[10px] text-[#57534E] whitespace-nowrap">
          {status}
        </p>
      )}
    </div>
  )
}

