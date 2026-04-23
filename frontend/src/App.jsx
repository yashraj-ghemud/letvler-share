import { useState } from 'react'
import axios from 'axios'

function App() {
  const [code, setCode] = useState('')
  const [uploadCode, setUploadCode] = useState(null)
  const [uploadFileName, setUploadFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const BACKEND_URL = 'https://letvler-share.onrender.com'

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)
    setError('')

    const files = e.dataTransfer.files
    if (files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setError('')
      await uploadFile(file)
    }
  }

  const uploadFile = async (file) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setUploadCode(response.data.code)
      setUploadFileName(response.data.originalName)
      setError('')
    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (code.length === 2) {
      window.location.href = `${BACKEND_URL}/${code}`
    } else {
      setError('Please enter a valid 2-digit code')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleDownload()
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(uploadCode)
  }

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-text font-mono flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 tracking-tighter">LETVLER</h1>
          <p className="text-hacker-green opacity-70">instant file transfer</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-500 text-red-300 p-3 text-center">
            {error}
          </div>
        )}

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed p-12 text-center transition-all ${isDragging
            ? 'border-hacker-green bg-hacker-dim'
            : 'border-hacker-dim hover:border-hacker-green'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {loading ? (
            <p className="text-xl">uploading...</p>
          ) : uploadCode ? (
            <div className="space-y-4">
              <p className="text-xl">file uploaded!</p>
              <div className="bg-hacker-dim border border-hacker-green p-4 inline-block">
                <p className="text-sm mb-2">your code:</p>
                <p className="text-4xl font-bold">{uploadCode}</p>
              </div>
              <p className="text-sm opacity-70">{uploadFileName}</p>
              <button
                onClick={copyCode}
                className="block mx-auto mt-4 px-4 py-2 border border-hacker-green hover:bg-hacker-dim transition-colors"
              >
                copy code
              </button>
              <button
                onClick={() => {
                  setUploadCode(null)
                  setUploadFileName('')
                }}
                className="block mx-auto mt-2 text-sm opacity-70 hover:opacity-100"
              >
                upload another
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xl mb-4">drag & drop file here</p>
              <p className="text-sm opacity-50 mb-4">or</p>
              <label className="cursor-pointer inline-block px-6 py-3 border border-hacker-green hover:bg-hacker-dim transition-colors">
                choose file
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center space-x-4">
          <div className="h-px bg-hacker-dim flex-1"></div>
          <span className="opacity-50">or</span>
          <div className="h-px bg-hacker-dim flex-1"></div>
        </div>

        {/* Receive Zone */}
        <div className="text-center space-y-4">
          <p className="text-xl">receive file</p>
          <div className="flex justify-center space-x-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 2)
                setCode(value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              placeholder="00"
              maxLength="2"
              className="w-24 bg-hacker-bg border-2 border-hacker-dim text-center text-2xl p-3 focus:border-hacker-green focus:outline-none"
            />
            <button
              onClick={handleDownload}
              className="px-6 py-3 border border-hacker-green hover:bg-hacker-dim transition-colors"
            >
              download
            </button>
          </div>
          <p className="text-sm opacity-50">enter 2-digit code</p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs opacity-30 space-y-1">
          <p>files auto-delete after 2 minutes</p>
          <p>no database • pure speed</p>
        </div>
      </div>
    </div>
  )
}

export default App
