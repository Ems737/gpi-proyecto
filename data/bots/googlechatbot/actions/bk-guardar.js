  const axios = require('axios')
  const http = require('http') // 1. IMPORTAMOS EL MÓDULO HTTP

  // 2. CREAMOS UN "AGENTE" QUE FUERZA EL USO DE IPV4
  const httpAgent = new http.Agent({ family: 4 })

  /**
   * Esta es la acción para guardar en Bookstack
   * @param bp El objeto 'bp' de Botpress
   * @param sdk El SDK de Botpress
   * @param event El evento que disparó la acción
   * @param args Argumentos (si se definieron)
   */
  const guardarEnBookstack = async () => {
    // 👇 ¡RECUERDA HABER HECHO EL CAMBIO EN EL FLUJO TAMBIÉN!
    // (Borrar el nodo "input-guardar" y leer "event.payload.text")
    const texto = event.payload.text

    if (!texto) {
      bp.logger.error('La variable "event.payload.text" estaba vacía.')
      temp.guardado_status = 'Error: No recibí texto para guardar.'
      return
    }

    try {
      bp.logger.info('--- Pasando httpAgent a axios:', httpAgent)
      const res = await axios.post(
        'http://172.21.0.6:80/api/pages',
        {
          name: 'Solución guardada desde Chatbot',
          markdown: texto,
          book_id: 1
        },
        {
          headers: {
            Authorization: `Token irtfQvI0jOsRG40OloDO7vjTnxbhp5Va:QI7E3o6kN2PpN96V4EWwZG6BynCcIP0u`
          },
          // 3. LE PASAMOS EL AGENTE IPV4 A AXIOS
          httpAgent: httpAgent
        }
      )

      bp.logger.info('Guardado en Bookstack:', res.data)
      temp.guardado_status = '¡Solución registrada correctamente! ✅'
    } catch (error) {
      bp.logger.error('--- ¡ERROR REAL DE LA API (GUARDAR)! ---: ' + error.message)
      bp.logger.error('Error guardando en Bookstack:', error.message)
      temp.guardado_status = 'Hubo un error al guardar en Bookstack. Revisa los logs.'
    }
  }

  // 3. RETORNAMOS la ejecución de la función.
  // Esto devuelve una Promesa que Botpress SÍ sabrá esperar.
  return guardarEnBookstack()