const fetchText = () => {
  if (event.preview && typeof event.preview === 'string') return event.preview
  if (event.payload && event.payload.text) return event.payload.text
  if (event.text) return event.text
  return ''
}
const text = fetchText().trim()
const m = text.match(/^\/buscar\s+(.+)/i)
if (!m) {
  await bp.events.replyToEvent(event, [{ type: 'text', text: 'Uso: /buscar <término>' }])
  return
}
const term = m[1].trim()

const baseUrl = process.env.BOOKSTACK_BASEURL
const tokenId = process.env.BOOKSTACK_TOKEN_ID
const tokenSecret = process.env.BOOKSTACK_TOKEN_SECRET

try {
  const res = await bp.http.get(`${baseUrl}/api/search?term=${encodeURIComponent(term)}`, {
    headers: { Authorization: `Token ${tokenId}:${tokenSecret}` }
  })
  const results = res.data || {}
  if (!results.pages || results.pages.length === 0) {
    await bp.events.replyToEvent(event, [{ type: 'text', text: `No encontré resultados para "${term}".` }])
    return
  }
  const top = results.pages.slice(0, 3)
  const lines = top.map(p => `• ${p.name} — ${baseUrl}/pages/${p.slug || p.id}`)
  await bp.events.replyToEvent(event, [{ type: 'text', text: `Resultados:\n${lines.join('\n')}` }])
} catch (err) {
  await bp.events.replyToEvent(event, [{ type: 'text', text: `Error en búsqueda: ${err.message}` }])
}

