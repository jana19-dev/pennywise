FROM node:20-alpine3.17 AS build

ARG VCS_REF
LABEL org.label-schema.vcs-ref=$VCS_REF

# install dependencies
WORKDIR /app
COPY package.json ./
RUN npm i --force --ignore-scripts

# Copy all local files into the image.
COPY . .

# Build the dependencies
RUN npm run prisma:generate
COPY .env.example .env
RUN npm run build
RUN cp -rf node_modules/.prisma ./.prisma
RUN rm -rf node_modules
RUN npm install --force --omit=dev --ignore-scripts

# Copy the build output to the image
FROM node:20-alpine3.17

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.prisma /app/node_modules/.prisma
COPY --from=build /app/package.json /app/
COPY --from=build /app/schema.prisma /app/
COPY --from=build /app/build/ /app/

WORKDIR /app

CMD ["node", "index.js"]