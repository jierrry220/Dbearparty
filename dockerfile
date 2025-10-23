FROM node:22-slim
LABEL "language"="nodejs"

WORKDIR /app
COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 8080

CMD ["npm", "start"]
