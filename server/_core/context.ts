import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

/**
 * Create a mock user for development/preview mode.
 * This allows testing the full prediction flow without OAuth setup.
 * Production always uses real OAuth authentication.
 */
function createMockUser(): User {
  return {
    id: 1,
    openId: "dev-user-001",
    name: "Dev User",
    email: "dev@example.com",
    role: "user",
    loginMethod: "development",
    lastSignedIn: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // In development mode, provide a mock user for testing
    if (IS_DEVELOPMENT) {
      user = createMockUser();
      console.log("[Auth] Development mode: Using mock user");
    } else {
      // In production, authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
