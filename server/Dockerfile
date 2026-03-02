FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache android-tools

COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --workspace=server

COPY server/ ./server/
RUN cd server && npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache android-tools

COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --workspace=server --omit=dev

COPY --from=builder /app/server/dist ./server/dist

EXPOSE 3001
CMD ["node", "server/dist/index.js"]
