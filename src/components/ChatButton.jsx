import { useState } from 'react'

const TELEGRAM_URL = 'https://t.me/Anhaa_ts'
const MESSENGER_URL = 'https://m.me/61578490586768'

export default function ChatButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="chat-fab">
      {/* Sub buttons */}
      <div className={`chat-sub-buttons ${open ? 'chat-sub-open' : ''}`}>
        <a
          href={MESSENGER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-sub-btn"
          aria-label="Messenger"
          title="Messenger"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.87 1.38 5.438 3.548 7.148V22l3.255-1.79C9.869 20.4 10.922 20.52 12 20.52c5.523 0 10-4.145 10-9.261S17.523 2 12 2zm1.008 12.47L10.53 11.88 5.773 14.47l5.23-5.55 2.528 2.647 4.699-2.647-5.222 5.55z"/>
          </svg>
          <span className="chat-tooltip">Messenger</span>
        </a>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-sub-btn"
          aria-label="Telegram"
          title="Telegram"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <span className="chat-tooltip">Telegram</span>
        </a>
      </div>

      {/* Main button */}
      <button
        className={`chat-main-btn ${open ? 'chat-main-open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Холбоо барих"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="24" height="24">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </button>
    </div>
  )
}
