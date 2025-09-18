// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  logLevel: 'debug',
  version: '1.0.0-dev',
  features: {
    enableDebugTools: true,
    enableLogging: true
  }
};