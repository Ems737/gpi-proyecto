const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch') // Asegúrate que tu Dockerfile instala node-fetch@2

const app = express()
app.use(bodyParser.json())

const BP_BASE = process.env.BP_BASE || 'http://localhost:3000'
const BOT_ID = process.env.BOT_ID || 'googlechatbot'

console.log(`Bridge configurado. BP_BASE: ${BP_BASE}, BOT_ID: ${BOT_ID}`)

app.post('/googlechat-webhook', async (req, res) => {
  console.log('--- ¡Mensaje recibido de Google Chat! ---')

  const msgText = req.body?.chat?.messagePayload?.message?.text || ''
  
  // --- 👇 ¡AQUÍ ESTÁ EL HACK! ---
  // 1. Obtenemos el ID de usuario de Google
  const googleUserId = req.body?.chat?.user?.name || 'user' 
  // 2. Le decimos a Botpress que este usuario pertenece al canal 'emulator'
  const botpressUserId = `emulator::${googleUserId}`
  // --- FIN DEL HACK ---

  console.log(`Texto extraído: "${msgText}"`) 

  const convUrl = `${BP_BASE}/api/v1/bots/${BOT_ID}/converse/${encodeURIComponent(botpressUserId)}`
  console.log(`Intentando contactar a Botpress en: ${convUrl}`)

  try {
    // Ya no necesitamos el 'channel: emulator' en el body
    const body = { type: 'text', text: msgText } 
    
    const bpRes = await fetch(convUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    const bpJson = await bpRes.json()

    console.log('Respuesta recibida de Botpress:', JSON.stringify(bpJson))
    
    // Chequeo de seguridad por si 'responses' no existe
    let reply = 'No pude procesar eso.'
    if (bpJson.responses && Array.isArray(bpJson.responses)) {
      const textResponses = bpJson.responses.filter(r => r.text)
      reply = textResponses.map(r => r.text).join('\n') || reply
    }
    
    console.log(`Enviando respuesta a Google: "${reply}"`)
    res.json({ text: reply }) // Respondemos a Google Chat

  } catch (err) {
    console.error('--- ¡ERROR FATAL EN EL BRIDGE! ---')
    console.error(err.message)
    res.json({ text: 'Hubo un error en el bridge: ' + err.message })
  }
})

app.listen(8080, () => console.log('✅ Bridge escuchando en 8080'))

