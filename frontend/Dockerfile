FROM node:16.13.1-slim
WORKDIR /frontend
COPY . .
RUN npm install
EXPOSE 5173
ENTRYPOINT ["npm", "run", "dev"]