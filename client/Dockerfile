# Step 1: Build the React app
FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV=production
ENV REACT_APP_API_URL=http://34.47.130.229:3001

RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]