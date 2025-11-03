import { createAuthClient } from "better-auth/react";
const authClient = createAuthClient({
  baseURL: process.env.AUTH_URL,
});
export default authClient;
