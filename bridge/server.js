const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()
app.use(bodyParser.json())

const BP_BASE = process.env.BP_BASE || 'http://localhost:3000'
const BOT_ID = process.env.BOT_ID || 'my-bot'

app.post('/googlechat-webhook', async (req, res) => {
  try {
    const msgText = (req.body.message && req.body.message.text) || ''
    const userId = (req.body.message && req.body.message.sender && req.body.message.sender.name) || 'user'

    const convUrl = `${BP_BASE}/api/v1/bots/${BOT_ID}/converse/${encodeURIComponent(userId)}`
    const body = { type: 'text', text: msgText }

    const bpRes = await fetch(convUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    const bpJson = await bpRes.json()

    const reply = (bpJson.responses && bpJson.responses.map(r => r.payload.text).join('\n')) || 'OK'
    res.json({ text: reply })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

app.listen(8080, () => console.log('✅ Bridge escuchando en 8080'))

