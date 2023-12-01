// eslint-disable-next-line
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by ``, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    id: any;
    provider: any;
    jwt: any;
    user: {
      username: string;
    };
  }

  interface User {
    id: any;
    provider: any;
    jwt: any;
    token: any;
    username?: string;
  }
}
