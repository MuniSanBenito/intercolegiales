// src/lib/auth.ts
import type { User } from "firebase/auth";
import { createContext, type MiddlewareFunction } from "react-router";
import { auth } from "../lib/firebase";

export const userContext = createContext<User | null>(null);

export const authMiddleware: MiddlewareFunction = async ({ context }) => {
  await auth.authStateReady();

  context.set(userContext, auth.currentUser);
};
