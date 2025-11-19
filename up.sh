#Por problemas de permisos, asignamos el id de botpress para que pueda crear el directorio.
#Para verificar el id entramos al docker:
#docker exec -it botpress bash
#y ejecutamos:
#$ id botpress
#Para desarrollo usamos bind mount, para entornos estables (produccion) se recomienda hacer esto en el docker-compose.yml:
#volumes:
#  - botpress_data:/botpress/data
#Y al final del archivo:
#volumes:
#  botpress_data:
#
sudo chown -R 999:999 ./data

docker compose up -d --build

#Finalmente 
#BookStack: http://localhost:6875
#
#Botpress: http://localhost:3000
#
#Bridge: escuchando en http://localhost:8080/googlechat-webhook
