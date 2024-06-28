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
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "https://dsdds.vercel.app";

const OAuth2AuthorizationURL = process.env.OAUTH2_CLIENT_ID || "";
const OAuth2TokenURL = process.env.tokenURL || "";
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
        // or "none" or "store" or "admin"
        identifier: "oauth2",
        authorizationURL: OAuth2AuthorizationURL,
        tokenURL: OAuth2TokenURL,
        clientID: OAuth2ClientId,
        clientSecret: OAuth2ClientSecret,
        scope: OAuth2Scope.split(","),
        admin: {
          callbackUrl: `${BACKEND_URL}/admin/auth/oauth2/cb`,
          failureRedirect: `${ADMIN_URL}/login`,
          // The success redirect can be overridden from the client by adding a query param `?redirectTo=your_url` to the auth url
          // This query param will have the priority over this configuration
          successRedirect: `${ADMIN_URL}/`
          // authPath: '/admin/auth/oauth2',
          // authCallbackPath: '/admin/auth/oauth2/cb',
          // expiresIn: 24 * 60 * 60 * 1000,
          // verifyCallback: (container, req, accessToken, refreshToken, profile, strict) => {
          //    // implement your custom verify callback here if you need it
          // }
        },
        store: {
          callbackUrl: `${BACKEND_URL}/store/auth/oauth2/cb`,
          failureRedirect: `${STORE_URL}/login`,
          // The success redirect can be overridden from the client by adding a query param `?redirectTo=your_url` to the auth url
          // This query param will have the priority over this configuration
          successRedirect: `${STORE_URL}/`
          // authPath: '/store/auth/oauth2',
          // authCallbackPath: '/store/auth/oauth2/cb',
          // expiresIn: 24 * 60 * 60 * 1000,
          // verifyCallback: (container, req, accessToken, refreshToken, profile, strict) => {
          //    // implement your custom verify callback here if you need it
          // }
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
  // Uncomment the following lines to
  // redis_url: REDIS_URL
  database_extra: process.env.NODE_ENV !== "development" ? 
    {
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
