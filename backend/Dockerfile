FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

# Folder for uploaded images (mounted as a volume in Kubernetes)
RUN mkdir -p uploads && chown -R node:node /app
USER node

ENV PORT=5000
EXPOSE 5000
CMD ["node", "src/server.js"]
