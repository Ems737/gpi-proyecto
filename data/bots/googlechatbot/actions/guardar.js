const axios = require('axios')
const http = require('http')

const httpAgent = new http.Agent({ family: 4 })

const guardarEnBookstack = async () => {
  const texto = event.payload.text

  if (!texto) {
    bp.logger.error('La variable "event.payload.text" estaba vacía.')
    temp.guardado_status = 'Error: No recibí texto para guardar.'
    return
  }

  /**
   * --- TOMAR SOLO LA PRIMERA LÍNEA PARA EL TÍTULO ---
   */
  let primeraLinea = texto.split('\n')[0] // hasta el primer enter
  primeraLinea = primeraLinea.trim()
  
  // Limpiar caracteres raros y limitar a 60 caracteres
  const tituloLimpio = primeraLinea
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ \-_]/g, "")
    .substring(0, 60)

  /**
   * ID incremental opcional
   */
  user.count_guardados = (user.count_guardados || 0) + 1

  // Combinar ID incremental + título limpio
  const titulo = `Solución #${user.count_guardados} - ${tituloLimpio}`

  try {
    const res = await axios.post(
      'http://172.21.0.6:80/api/pages',
      {
        name: titulo,
        markdown: texto,
        book_id: 1
      },
      {
        headers: {
          Authorization: `Token irtfQvI0jOsRG40OloDO7vjTnxbhp5Va:QI7E3o6kN2PpN96V4EWwZG6BynCcIP0u`
        },
        httpAgent: httpAgent
      }
    )

    bp.logger.info('Guardado en Bookstack:', res.data)
    temp.guardado_status = `Capítulo guardado como: "${titulo}" ✅`
  } catch (error) {
    bp.logger.error('--- ¡ERROR REAL DE LA API (GUARDAR)! ---: ' + error.message)
    temp.guardado_status = 'Hubo un error al guardar en Bookstack. Revisa los logs.'
  }
}

return guardarEnBookstack()

