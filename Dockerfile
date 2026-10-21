# Imagem para hospedar o CodeQuest com Node + Java (para os exercícios de Java)
FROM node:22-bookworm-slim

# Java 17 (compilador javac + máquina virtual java)
RUN apt-get update \
 && apt-get install -y --no-install-recommends openjdk-17-jdk-headless \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# Roda como usuário comum (não root): mais seguro para executar código de alunos
RUN mkdir -p data && chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
CMD ["node", "server.js"]
