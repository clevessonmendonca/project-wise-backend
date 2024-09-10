import '@fastify/oauth2';

declare module '@fastify/oauth2' {
  interface OAuth2Token {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
  }
}
