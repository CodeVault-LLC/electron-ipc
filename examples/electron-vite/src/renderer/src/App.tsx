import { useEffect, useState } from 'react'
import { streamRoute } from '@codevault/electron-ipc'
import { callRoute } from './ipc.gen'

function App(): React.JSX.Element {
  const [message, setMessage] = useState('')
  const [invokeResult, setInvokeResult] = useState('')

  useEffect(() => {
    const getData = async (): Promise<void> => {
      // call (manual types)
      const user = await callRoute('user:get', { id: '123' })

      // stream
      streamRoute('system:logs', { count: 10 }, (logLine) => {
        console.log('[LOG]', logLine)
      })

      console.log('[CALL RESULT]', user)
      setInvokeResult(`User: ${user.name}, ID: ${user.id}`)
    }

    void getData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Electron IPC Demo</h1>

      <div className="mb-4 space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Send Ping (Send)
        </button>

        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Fetch Data (Invoke)
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Custom message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Send Custom Message
        </button>
      </div>

      <div className="mt-6 w-full max-w-md text-left bg-white shadow rounded p-4 space-y-2">
        <div>
          <strong>Invoke Result:</strong>
          <p>{invokeResult || 'No result yet.'}</p>
        </div>
      </div>
    </div>
  )
}

export default App
