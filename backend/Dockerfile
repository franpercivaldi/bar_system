# Imagen de producción para Railway / Docker (no es Dockerfile.dev)
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/app.js"]
