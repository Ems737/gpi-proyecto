  const axios = require('axios')
  const http = require('http') // 1. IMPORTAMOS EL MÓDULO HTTP

  // 2. CREAMOS UN "AGENTE" QUE FUERZA EL USO DE IPV4
  const httpAgent = new http.Agent({ family: 4 })

  /**
   * Esta es la acción para buscar en Bookstack
   * @param bp El objeto 'bp' de Botpress
   * @param sdk El SDK de Botpress
   * @param event El evento que disparó la acción
   * @param args Argumentos (si se definieron)
   */
  const buscarEnBookstack = async () => {
    // 👇 ¡RECUERDA HABER HECHO EL CAMBIO EN EL FLUJO!
    // (Borrar el nodo "input-buscar" y leer "event.payload.text")
    const keyword = event.payload.text

    bp.logger.info(`--- Buscando keyword: "${keyword}" ---`)

    if (!keyword) {
      bp.logger.error('La variable "event.payload.text" estaba vacía.')
      temp.busqueda_resultado = 'Error: No recibí una palabra clave.'
      return
    }

    try {
      //Ver como soulionar el no tener que poner la ip aca abajo
      const res = await axios.get('http://172.21.0.4:80/api/search', {
        headers: {
          Authorization: `Token sEzwUP8IYhGzdXXlPnj7Zb0YpivIWTzw:Lskj6byNQTELaNiMgiT9Ujw66ZsctxpL`
        },
        // 3. LE PASAMOS EL AGENTE IPV4 A AXIOS
        httpAgent: httpAgent,
        params: {
          query: keyword // <-- Check parameter name
        }
      })

      if (res.data.total === 0) {
        temp.busqueda_resultado = 'No se encontraron resultados para esa palabra clave.'
        return
      }

      const result = res.data.data[0]
      bp.logger.info('--- URL Original de Bookstack:', result.url)
      temp.busqueda_resultado = `Encontré esto en Bookstack: ${result.name} (${result.url})`
    } catch (error) {
      bp.logger.error('--- ¡ERROR REAL DE LA API (BUSCAR)! ---: ' + error.message)
      bp.logger.error('Error buscando en Bookstack:', error.message)
      temp.busqueda_resultado = 'Hubo un error al buscar en Bookstack. Revisa los logs.'
    }
  } // Fin de la función interna

  return buscarEnBookstack()