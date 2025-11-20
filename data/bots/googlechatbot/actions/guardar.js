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

    /**
     * --- TOMAR SOLO LA PRIMERA LÍNEA PARA EL TÍTULO ---
     */
    let primeraLinea = texto.split('\n')[0] // hasta el primer enter
    primeraLinea = primeraLinea.trim()

    // Limpiar caracteres raros y limitar a 60 caracteres
    const tituloLimpio = primeraLinea.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ \-_]/g, '').substring(0, 60)
    user.count_guardados = (user.count_guardados || 0) + 1

    // Combinar ID incremental + título limpio
    const titulo = `Solución #${user.count_guardados} - ${tituloLimpio}`

    try {
      bp.logger.info('--- Pasando httpAgent a axios:', httpAgent)
      const res = await axios.post(
        'http://172.19.0.4:80/api/pages',
        {
          name: titulo,
          markdown: texto,
          book_id: 1
        },
        {
          headers: {
            Authorization: `Token EVofVDui3X7K2TgKDkVBodAMxgP389Zu:yUZ4P8DFsrx5Ls7omAJwGmDrtTyAT6wZ`
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