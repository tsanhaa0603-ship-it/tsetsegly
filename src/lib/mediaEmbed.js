/* Spotify / YouTube линкийг embed iframe URL болгож хувиргана. */

export function parseMediaUrl(url) {
  if (!url || typeof url !== 'string') return null
  const u = url.trim()

  /* ── Spotify ── */
  // https://open.spotify.com/track/XXXX  |  /album/  |  /playlist/  |  /episode/
  const spotify = u.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/)
  if (spotify) {
    const [, type, sid] = spotify
    return {
      provider: 'spotify',
      embedUrl: `https://open.spotify.com/embed/${type}/${sid}?utm_source=generator`,
      height: type === 'track' ? 152 : 352,
    }
  }
  // spotify:track:XXXX URI хэлбэр
  const spotifyUri = u.match(/spotify:(track|album|playlist|episode):([a-zA-Z0-9]+)/)
  if (spotifyUri) {
    const [, type, sid] = spotifyUri
    return {
      provider: 'spotify',
      embedUrl: `https://open.spotify.com/embed/${type}/${sid}?utm_source=generator`,
      height: type === 'track' ? 152 : 352,
    }
  }

  /* ── YouTube ── */
  // youtu.be/XXXX  |  youtube.com/watch?v=XXXX  |  /embed/XXXX  |  /shorts/XXXX
  const yt =
    u.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
    u.match(/youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
  if (yt) {
    const vid = yt[1]
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`,
      height: 200,
    }
  }

  return null
}
