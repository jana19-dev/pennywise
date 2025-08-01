FROM node:24-alpine AS build

# install dependencies
WORKDIR /app
COPY package-lock.json ./
RUN npm i --ignore-scripts

# Copy all local files into the image.
COPY . .

# Build the dependencies
RUN npm run prisma-generate
COPY .env.example .env
RUN npm run build
RUN cp -rf node_modules/.prisma ./.prisma
RUN rm -rf node_modules
RUN npm install --omit=dev --ignore-scripts

# Copy the build output to the image
FROM node:24-alpine

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.prisma /app/node_modules/.prisma
COPY --from=build /app/package.json /app/
COPY --from=build /app/schema.prisma /app/
COPY --from=build /app/build/ /app/

WORKDIR /app

CMD ["node", "index.js"]