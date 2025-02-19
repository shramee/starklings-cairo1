export const PORT = process.env.PORT || 3000;

export const PG_PORT = process.env.PG_PORT || 5432;
export const PG_HOST = process.env.PG_HOST || "localhost";
export const PG_USER = process.env.PG_USER || "postgres";
export const PG_PASSWORD = process.env.PG_PASSWORD || "postgres";
export const PG_DATABASE = process.env.PG_DATABASE || "starklings-db";
export const PG_DATABASE_SSL = process.env.PG_DATABASE_SSL === `true`;

export const ORIGIN = process.env.ORIGIN || "http://localhost:4000";

export const URL_GITHUB_STARKLINGS = process.env.URL_GITHUB_STARKLINGS;

export const GITHUB_ACCESS_TOKEN_URL = process.env.GITHUB_ACCESS_TOKEN_URL || "https://github.com/login/oauth/access_token"
export const GITHUB_USER_API = process.env.GITHUB_USER_API || "https://api.github.com/user"
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "af5dc7b4ebe93a771d92"
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ""