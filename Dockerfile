FROM node:16 as builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build:prod

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
