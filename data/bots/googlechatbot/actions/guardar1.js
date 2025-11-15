async function action(bp, sdk, event, args) {
    // 1. Obtenemos el texto desde la variable 'temp'
    // 'temp' está disponible globalmente en el scope de la acción
    const texto = temp.textoParaGuardar

    if (!texto) {
      bp.logger.error('La variable temp.textoParaGuardar no está definida.')
      temp.guardado_status = 'Error: No recibí texto para guardar.'
      return // Finaliza la acción
    }

    try {
      const res = await axios.post(
        process.env.BOOKSTACK_BASEURL + '/api/pages',
        {
          name: 'Solución guardada desde Chatbot',
          markdown: texto
        },
        {
          headers: {
            Authorization: `Token ${process.env.BOOKSTACK_TOKEN_ID}:${process.env.BOOKSTACK_TOKEN_SECRET}`
          }
        }
      )

      bp.logger.info('Guardado en Bookstack:', res.data)
      temp.guardado_status = '¡Solución registrada correctamente! ✅'
    } catch (error) {
      bp.logger.error('Error guardando en Bookstack:', error.message)
      temp.guardado_status = 'Hubo un error al guardar en Bookstack. Revisa los logs.'
    }
  }