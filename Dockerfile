FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

# 平台通过 PORT 注入监听端口，应用入口会自动读取。
CMD ["npm", "start"]
