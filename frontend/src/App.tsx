import { useEffect, useState } from 'react'
import './App.css'

type ChatMessage = {
  username: string
  message: string
  color: string
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  async function loadMessages() {
    const response = await fetch('/api/messages')
    const data: ChatMessage[] = await response.json()
    setMessages(data)
  }

  useEffect(() => {
    loadMessages()
  }, [])

  return (
    <>
      <h1>Shoutbox</h1>
      {messages.map((m, index) => (
        <p key={index}>
          <strong style={{ color: m.color }}>{m.username}</strong>: {m.message}
        </p>
      ))}
    </>
  )
}

export default App