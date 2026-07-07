import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here
/**
 * Recipes table - stores user-created prediction recipes
 */
export const recipes = mysqlTable("recipes", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  version: varchar("version", { length: 20 }).default("1.0.0").notNull(),
  status: mysqlEnum("status", ["draft", "ready", "archived"]).default("draft").notNull(),
  isPublic: tinyint("isPublic").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = typeof recipes.$inferInsert;

/**
 * Recipe engines junction table - maps engines to recipes with weights
 */
export const recipeEngines = mysqlTable("recipe_engines", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  recipeId: varchar("recipeId", { length: 36 }).notNull(),
  engineId: varchar("engineId", { length: 100 }).notNull(),
  weight: mysqlEnum("weight", ["high", "medium", "low"]).default("medium").notNull(),
  position: int("position").default(0).notNull(),
});

export type RecipeEngine = typeof recipeEngines.$inferSelect;
export type InsertRecipeEngine = typeof recipeEngines.$inferInsert;
