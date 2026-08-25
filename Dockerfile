FROM node:22.23.2-alpine AS builder

WORKDIR /usr/src/app

ENV NODE_ENV=development \
    NPM_CONFIG_UPDATE_NOTIFIER=false

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --omit=dev

FROM node:22.23.2-alpine AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production \
    NPM_CONFIG_UPDATE_NOTIFIER=false

RUN apk add --no-cache tini

RUN addgroup --system --gid 1001 app \
    && adduser --system --uid 1001 --ingroup app app

COPY --from=builder --chown=app:app /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=app:app /usr/src/app/dist ./dist
COPY --from=builder --chown=app:app /usr/src/app/package.json ./package.json
COPY --from=builder --chown=app:app /usr/src/app/public ./public
COPY --from=builder --chown=app:app /usr/src/app/templates ./templates

USER app

EXPOSE 8080

STOPSIGNAL SIGTERM

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD ["node", "-e", "require('net').connect(Number(process.env.APP_PORT)||8080,'127.0.0.1').on('connect',function(s){s.end();process.exit(0)}).on('error',function(){process.exit(1)})"]

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/bundle.js"]
