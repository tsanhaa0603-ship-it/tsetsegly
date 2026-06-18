import { useState } from 'react'

/* Telegram icon */
function TelegramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.94 4.51l-3.04 14.34c-.23 1.01-.83 1.26-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.73 8.61-7.78c.37-.33-.08-.52-.58-.19L7.4 13.06l-4.58-1.43c-1-.31-1.02-1 .21-1.48l17.9-6.9c.83-.31 1.56.19 1.29 1.46z" />
    </svg>
  )
}

/* Messenger icon */
function MessengerIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.35.27.57l.05 1.78c.04.57.62.94 1.14.71l1.99-.88c.17-.07.36-.09.54-.04 1.04.28 2.14.39 3.27.39 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46l-2.93 4.67c-.47.74-1.47.92-2.17.4l-2.34-1.74a.6.6 0 00-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.93-4.67c.47-.74 1.47-.92 2.17-.4l2.34 1.74a.6.6 0 00.72 0l3.16-2.4c.42-.32.97.18.69.63z" />
    </svg>
  )
}

/* Chat icon (үндсэн товч) */
function ChatIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

const SUB_BTNS = [
  { label: 'Telegram', href: 'https://t.me/Anhaa_ts', Icon: TelegramIcon },
  { label: 'Messenger', href: 'https://m.me/61578490586768', Icon: MessengerIcon },
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="chat-fab">
      {/* Sub buttons (popup) */}
      <div className={`chat-sub-buttons ${open ? 'chat-sub-open' : ''}`}>
        {SUB_BTNS.map((b) => (
          <a
            key={b.label}
            href={b.href}
            target="_blank"
            rel="noreferrer"
            className="chat-sub-btn"
            aria-label={b.label}
          >
            <b.Icon className="w-6 h-6" />
            <span className="chat-tooltip">{b.label}</span>
          </a>
        ))}
      </div>

      {/* Main button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`chat-main-btn ${open ? 'chat-main-open' : ''}`}
        aria-label={open ? 'Чат хаах' : 'Чатаар холбогдох'}
        aria-expanded={open}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <ChatIcon className="w-7 h-7" />
        )}
      </button>
    </div>
  )
}
