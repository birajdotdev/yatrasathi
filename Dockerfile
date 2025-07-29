FROM node:lts-alpine

WORKDIR /app
RUN npm install -g bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

EXPOSE 3000
CMD ["bun", "run", "dev"]
