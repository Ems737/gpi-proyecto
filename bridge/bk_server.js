const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()
app.use(bodyParser.json())

const BP_BASE = process.env.BP_BASE || 'http://localhost:3000'
const BOT_ID = process.env.BOT_ID || 'googlechatbot'

// --- NUEVO LOG DE INICIO ---
console.log(`Bridge configurado. BP_BASE: ${BP_BASE}, BOT_ID: ${BOT_ID}`)


app.post('/googlechat-webhook', async (req, res) => {
    // --- NUEVO LOG DE MENSAJE ---
  //console.log('--- ¡Mensaje recibido de Google Chat! ---')
  //console.log('Texto:', (req.body.message && req.body.message.text));

  try {
    const msgText = (req.body.message && req.body.message.text) || ''
    const userId = (req.body.message && req.body.message.sender && req.body.message.sender.name) || 'user'

    const convUrl = `${BP_BASE}/api/v1/bots/${BOT_ID}/converse/${encodeURIComponent(userId)}`
    //const body = { type: 'text', text: msgText }
    const body = { type: 'text', text: msgText, channel: 'emulator' }

	      // --- NUEVO LOG DE MENSAJE ---
    console.log('--- ¡Mensaje recibido de Google Chat! ---')
    console.log('Texto:', (req.body.message && req.body.message.text));

    const googleUserId = req.body?.chat?.user?.name || 'user' 
    // 2. Le decimos a Botpress que este usuario pertenece al canal 'emulator' 
    const botpressUserId = `emulator::${googleUserId}`

        // --- NUEVO LOG DE FETCH ---
    console.log(`Intentando contactar a Botpress en: ${convUrl}`)

    const bpRes = await fetch(convUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    const bpJson = await bpRes.json()
	      // --- NUEVO LOG DE RESPUESTA DE BOTPRESS ---
    console.log('Respuesta recibida de Botpress:', JSON.stringify(bpJson))

    const textResponses = bpJson.responses.filter(r => r.text)

    //const reply = (bpJson.responses && bpJson.responses.map(r => r.payload.text).join('\n')) || 'OK' 
    const reply = textResponses.map(r => r.text).join('\n') || 'No pude procesar eso.' 
    console.log(`Enviando respuesta a Google: "${reply}"`)
    res.json({ text: reply })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

app.listen(8080, () => console.log('✅ Bridge escuchando en 8080'))

