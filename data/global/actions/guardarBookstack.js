const fetchTextFromEvent = () => {
  if (event.preview && typeof event.preview === 'string') return event.preview
  if (event.payload && event.payload.text) return event.payload.text
  if (event.text) return event.text
  return ''
}

const text = (fetchTextFromEvent() || '').trim()
const m = text.match(/^\/guardar\s+(.+)/i)
if (!m) {
  await bp.events.replyToEvent(event, [{ type: 'text', text: 'Uso: /guardar <texto>' }])
  return
}
const contenido = m[1].trim()

const baseUrl = process.env.BOOKSTACK_BASEURL
const tokenId = process.env.BOOKSTACK_TOKEN_ID
const tokenSecret = process.env.BOOKSTACK_TOKEN_SECRET

const payload = {
  book_id: 1, // id del book Chatbot Solutions
  name: `Solución - ${new Date().toISOString()}`,
  html: `<p>${bp.util.escape(contenido)}</p><hr><p>Guardado por: ${event.target || event.userId}</p>`,
  tags: [{ name: "chatbot", value: "guardada" }]
}

try {
  const res = await bp.http.post(`${baseUrl}/api/pages`, payload, {
    headers: {
      Authorization: `Token ${tokenId}:${tokenSecret}`,
      'Content-Type': 'application/json'
    }
  })
  const data = res.data
  const pageUrl = `${baseUrl}/pages/${data.slug || data.id}`
  await bp.events.replyToEvent(event, [{ type: 'text', text: `✅ Solución guardada: ${pageUrl}` }])
} catch (err) {
  await bp.events.replyToEvent(event, [{ type: 'text', text: `❌ Error: ${err.message}` }])
}

