FROM node:16.13.1-slim
WORKDIR /backend
COPY . .
RUN npm install
ENV PORT=2050
EXPOSE 2050
ENTRYPOINT ["npm", "run", "dev"]