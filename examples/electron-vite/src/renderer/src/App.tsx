import { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [invokeResult, setInvokeResult] = useState('')

  // Listen for IPC messages from the main process
  useEffect(() => {
    // `on` persistent listener
    window.api.on('pong', (_, data) => {
      setResponse(`Received from main: ${data}`)
    })

    // Optional: Clean up listeners on unmount
    return () => {
      window.api.removeAllListeners('pong')
    }
  }, [])

  const sendPing = (): void => {
    window.api.send('ping', 'Hello from Renderer')
  }

  const invokeData = async (): Promise<void> => {
    const result = await window.api.invoke('fetch-data', 'Need data')
    setInvokeResult(`Invoke result: ${result}`)
  }

  const sendCustomMessage = (): void => {
    window.api.send('custom-message', message)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Electron IPC Demo</h1>

      <div className="mb-4 space-x-4">
        <button
          onClick={sendPing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Ping (Send)
        </button>

        <button
          onClick={invokeData}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
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
        <button
          onClick={sendCustomMessage}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Send Custom Message
        </button>
      </div>

      <div className="mt-6 w-full max-w-md text-left bg-white shadow rounded p-4 space-y-2">
        <div>
          <strong>Send/On Response:</strong>
          <p>{response || 'No response yet.'}</p>
        </div>
        <div>
          <strong>Invoke Result:</strong>
          <p>{invokeResult || 'No result yet.'}</p>
        </div>
      </div>
    </div>
  )
}

export default App
