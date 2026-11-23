import { useEffect, useState } from 'react'
import './App.css'

type ChatMessage = {
  username: string
  message: string
  color: string
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const [username, setUsername] = useState('')
  const [color, setColor] = useState('#2563eb')
  const [text, setText] = useState('')

  async function loadMessages() {
    const response = await fetch('/api/messages')
    const data: ChatMessage[] = await response.json()
    setMessages(data)
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault() // zabrání obnovení stránky po odeslání formuláře

    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message: text, color }),
    })

    if (!response.ok) return // backend zprávu odmítl (např. prázdné jméno)

    const newMessages: ChatMessage[] = await response.json()
    setMessages(newMessages)
    setText('') // vymaže jen zprávu, jméno a barva zůstanou
  }

  useEffect(() => {
    loadMessages()
  }, [])

  return (
    <>
      <h1>Shoutbox</h1>

      <form onSubmit={sendMessage}>
        <input
          placeholder="Jméno"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          placeholder="Zpráva"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Odeslat</button>
      </form>

      {messages.map((m, index) => (
        <p key={index}>
          <strong style={{ color: m.color }}>{m.username}</strong>: {m.message}
        </p>
      ))}
    </>
  )
}

export default App