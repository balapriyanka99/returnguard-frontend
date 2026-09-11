FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_RETURNGUARD_API_BASE_URL
ARG VITE_USE_MOCK_API=false
ENV VITE_RETURNGUARD_API_BASE_URL=$VITE_RETURNGUARD_API_BASE_URL
ENV VITE_USE_MOCK_API=$VITE_USE_MOCK_API
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
