const dotenv = require("dotenv");

let ENV_FILE_NAME = ""; 
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {
  console.error(`Failed to load environment variables from ${ENV_FILE_NAME}:`, e);
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "https://dsdds.vercel.app";

const OAuth2AuthorizationURL = process.env.OAUTH2_AUTHORIZATION_URL || "";
const OAuth2TokenURL = process.env.OAUTH2_TOKEN_URL || "";
const OAuth2ClientId = process.env.OAUTH2_CLIENT_ID || "";
const OAuth2ClientSecret = process.env.OAUTH2_CLIENT_SECRET || "";
const OAuth2Scope = process.env.OAUTH2_SCOPE || "";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  {
    resolve: "medusa-plugin-auth",
    /** @type {import('medusa-plugin-auth').AuthOptions} */
    options: [
      {
        type: "oauth2",
        strict: "all",
        identifier: "oauth2",
        authorizationURL: OAuth2AuthorizationURL,
        tokenURL: OAuth2TokenURL,
        clientID: OAuth2ClientId,
        clientSecret: OAuth2ClientSecret,
        scope: OAuth2Scope.split(","),
        admin: {
          callbackUrl: `${process.env.BACKEND_URL}/admin/auth/oauth2/cb`,
          failureRedirect: `${process.env.ADMIN_URL}/login`,
          successRedirect: `${process.env.ADMIN_URL}/`
        },
        store: {
          callbackUrl: `https://dsdds-1adm.onrender.com/store/auth/oauth2/cb`,
          failureRedirect: `https://dsdds-1adm.onrender.com/login`,
          successRedirect: `https://shop.ssangyongsports.eu.org/`
        },
      },
    ],
  },
];

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: process.env.JWT_SECRET || "supersecret",
  cookie_secret: process.env.COOKIE_SECRET || "supersecret",
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  redis_url: process.env.REDIS_URL,
  database_extra: process.env.NODE_ENV !== "development" ? {
    ssl: {
      rejectUnauthorized: false,
    },
  } : {},
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
