FROM node:18-alpine

WORKDIR /app
COPY server.js .
RUN npm install express body-parser node-fetch@2

EXPOSE 8080
CMD ["node", "server.js"]
