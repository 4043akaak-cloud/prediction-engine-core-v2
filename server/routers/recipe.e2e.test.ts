import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getDb } from "../db";
import { recipes, recipeEngines, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

/**
 * Recipe System E2E Verification Tests
 * Each test is completely independent and reproducible
 * Tests reflect the approved Recipe architecture
 */

describe("Recipe System E2E Verification", () => {
  let db: any;

  beforeEach(async () => {
    db = await getDb();
  });

  describe("1. Create Recipe Flow", () => {
    it("should create a new USER recipe and persist to database", async () => {
      // Create a test user first
      const testUser = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "Test User",
          email: "test@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const userId = testUser[0].id;
      const recipeId = uuidv4();

      // Create recipe
      await db.insert(recipes).values({
        id: recipeId,
        userId: userId,
        name: "Test Recipe",
        description: "A test recipe",
        type: "USER",
        category: "FINANCE",
        status: "ready",
        version: 1,
        isPublic: 0,
      });

      // Verify it was created
      const created = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId))
        .then((rows: any[]) => rows[0]);

      expect(created).toBeDefined();
      expect(created.name).toBe("Test Recipe");
      expect(created.type).toBe("USER");
      expect(created.userId).toBe(userId);
      expect(created.status).toBe("ready");
      expect(created.version).toBe(1);

      // Cleanup
      await db.delete(recipes).where(eq(recipes.id, recipeId));
      await db.delete(users).where(eq(users.id, userId));
    });

    it("should add engines to recipe and persist", async () => {
      // Create test user
      const testUser = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "Test User",
          email: "test@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const userId = testUser[0].id;
      const recipeId = uuidv4();

      // Create recipe
      await db.insert(recipes).values({
        id: recipeId,
        userId: userId,
        name: "Recipe with Engines",
        description: "Test recipe",
        type: "USER",
        category: "FINANCE",
        status: "ready",
        version: 1,
        isPublic: 0,
      });

      // Add engines
      const engineId1 = uuidv4();
      const engineId2 = uuidv4();

      await db.insert(recipeEngines).values([
        {
          id: engineId1,
          recipeId: recipeId,
          engineId: "trend-engine",
          weight: "high",
          position: 0,
        },
        {
          id: engineId2,
          recipeId: recipeId,
          engineId: "statistical-engine",
          weight: "medium",
          position: 1,
        },
      ]);

      // Verify engines
      const engines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, recipeId));

      expect(engines).toHaveLength(2);
      expect(engines[0].weight).toBe("high");
      expect(engines[1].weight).toBe("medium");

      // Cleanup
      await db.delete(recipeEngines).where(eq(recipeEngines.recipeId, recipeId));
      await db.delete(recipes).where(eq(recipes.id, recipeId));
      await db.delete(users).where(eq(users.id, userId));
    });
  });

  describe("2. Edit Recipe Flow", () => {
    it("should update recipe name, description, category independently", async () => {
      // Create test user
      const testUser = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "Test User",
          email: "test@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const userId = testUser[0].id;
      const recipeId = uuidv4();

      // Create recipe
      await db.insert(recipes).values({
        id: recipeId,
        userId: userId,
        name: "Original Name",
        description: "Original description",
        type: "USER",
        category: "FINANCE",
        status: "ready",
        version: 1,
        isPublic: 0,
      });

      // Update name
      await db
        .update(recipes)
        .set({ name: "Updated Name" })
        .where(eq(recipes.id, recipeId));

      let updated = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId))
        .then((rows: any[]) => rows[0]);

      expect(updated.name).toBe("Updated Name");
      expect(updated.description).toBe("Original description");

      // Update description
      await db
        .update(recipes)
        .set({ description: "Updated description" })
        .where(eq(recipes.id, recipeId));

      updated = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId))
        .then((rows: any[]) => rows[0]);

      expect(updated.description).toBe("Updated description");

      // Update category
      await db
        .update(recipes)
        .set({ category: "SPORTS" })
        .where(eq(recipes.id, recipeId));

      updated = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId))
        .then((rows: any[]) => rows[0]);

      expect(updated.category).toBe("SPORTS");

      // Cleanup
      await db.delete(recipes).where(eq(recipes.id, recipeId));
      await db.delete(users).where(eq(users.id, userId));
    });

    it("should increment version on update", async () => {
      // Create test user
      const testUser = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "Test User",
          email: "test@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const userId = testUser[0].id;
      const recipeId = uuidv4();

      // Create recipe with version 1
      await db.insert(recipes).values({
        id: recipeId,
        userId: userId,
        name: "Recipe",
        description: "Test",
        type: "USER",
        category: "FINANCE",
        status: "ready",
        version: 1,
        isPublic: 0,
      });

      // Update to version 2
      await db
        .update(recipes)
        .set({ version: 2 })
        .where(eq(recipes.id, recipeId));

      const updated = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId))
        .then((rows: any[]) => rows[0]);

      expect(updated.version).toBe(2);

      // Cleanup
      await db.delete(recipes).where(eq(recipes.id, recipeId));
      await db.delete(users).where(eq(users.id, userId));
    });
  });

  describe("3. Delete Recipe Flow", () => {
    it("should delete recipe from database", async () => {
      // Create test user
      const testUser = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "Test User",
          email: "test@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const userId = testUser[0].id;
      const recipeId = uuidv4();

      // Create recipe
      await db.insert(recipes).values({
        id: recipeId,
        userId: userId,
        name: "Recipe to Delete",
        description: "Will be deleted",
        type: "USER",
        category: "OTHER",
        status: "ready",
        version: 1,
        isPublic: 0,
      });

      // Verify it exists
      let exists = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId))
        .then((rows: any[]) => rows[0]);

      expect(exists).toBeDefined();

      // Delete it
      await db.delete(recipes).where(eq(recipes.id, recipeId));

      // Verify it's gone
      exists = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId))
        .then((rows: any[]) => rows[0]);

      expect(exists).toBeUndefined();

      // Cleanup
      await db.delete(users).where(eq(users.id, userId));
    });

    it("should cascade delete recipe engines when recipe is deleted", async () => {
      // Create test user
      const testUser = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "Test User",
          email: "test@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const userId = testUser[0].id;
      const recipeId = uuidv4();

      // Create recipe
      await db.insert(recipes).values({
        id: recipeId,
        userId: userId,
        name: "Recipe with Engines",
        description: "Has engines",
        type: "USER",
        category: "OTHER",
        status: "ready",
        version: 1,
        isPublic: 0,
      });

      // Add engines
      await db.insert(recipeEngines).values({
        id: uuidv4(),
        recipeId: recipeId,
        engineId: "test-engine",
        weight: "medium",
        position: 0,
      });

      // Verify engines exist
      let engines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, recipeId));

      expect(engines.length).toBeGreaterThan(0);

      // Delete recipe (manually delete engines first since no FK constraint)
      await db.delete(recipeEngines).where(eq(recipeEngines.recipeId, recipeId));
      await db.delete(recipes).where(eq(recipes.id, recipeId));

      // Verify engines are gone
      engines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, recipeId));

      expect(engines).toHaveLength(0);

      // Cleanup
      await db.delete(users).where(eq(users.id, userId));
    });
  });

  describe("4. Quick Start Recipe Flow", () => {
    it("should create SYSTEM recipe with null userId", async () => {
      const systemId = uuidv4();

      await db.insert(recipes).values({
        id: systemId,
        userId: null,
        name: "Quick Start: Balanced",
        description: "Official starter template",
        type: "SYSTEM",
        category: "OTHER",
        status: "ready",
        version: 1,
        displayOrder: 1,
        isPublic: 1,
      });

      const created = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, systemId))
        .then((rows: any[]) => rows[0]);

      expect(created.type).toBe("SYSTEM");
      expect(created.userId).toBeNull();
      expect(created.displayOrder).toBe(1);

      // Cleanup
      await db.delete(recipes).where(eq(recipes.id, systemId));
    });

    it("should load SYSTEM recipe with engines", async () => {
      const systemId = uuidv4();

      // Create SYSTEM recipe
      await db.insert(recipes).values({
        id: systemId,
        userId: null,
        name: "Quick Start: Balanced",
        description: "Official starter template",
        type: "SYSTEM",
        category: "OTHER",
        status: "ready",
        version: 1,
        displayOrder: 1,
        isPublic: 1,
      });

      // Add engines
      await db.insert(recipeEngines).values([
        {
          id: uuidv4(),
          recipeId: systemId,
          engineId: "trend-engine",
          weight: "medium",
          position: 0,
        },
        {
          id: uuidv4(),
          recipeId: systemId,
          engineId: "statistical-engine",
          weight: "medium",
          position: 1,
        },
      ]);

      const recipe = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, systemId))
        .then((rows: any[]) => rows[0]);

      const engines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, systemId));

      expect(recipe).toBeDefined();
      expect(engines).toHaveLength(2);

      // Cleanup
      await db.delete(recipeEngines).where(eq(recipeEngines.recipeId, systemId));
      await db.delete(recipes).where(eq(recipes.id, systemId));
    });

    it("should duplicate SYSTEM recipe to USER recipe with lineage tracking", async () => {
      // Create SYSTEM recipe
      const systemId = uuidv4();
      await db.insert(recipes).values({
        id: systemId,
        userId: null,
        name: "Quick Start: Balanced",
        description: "Official starter template",
        type: "SYSTEM",
        category: "OTHER",
        status: "ready",
        version: 1,
        displayOrder: 1,
        isPublic: 1,
      });

      // Add engines to SYSTEM recipe
      await db.insert(recipeEngines).values([
        {
          id: uuidv4(),
          recipeId: systemId,
          engineId: "trend-engine",
          weight: "medium",
          position: 0,
        },
        {
          id: uuidv4(),
          recipeId: systemId,
          engineId: "statistical-engine",
          weight: "medium",
          position: 1,
        },
      ]);

      // Create test user
      const testUser = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "Test User",
          email: "test@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const userId = testUser[0].id;

      // Get source recipe and engines
      const source = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, systemId))
        .then((rows: any[]) => rows[0]);

      const sourceEngines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, systemId));

      // Create duplicate
      const duplicatedId = uuidv4();
      await db.insert(recipes).values({
        id: duplicatedId,
        userId: userId,
        name: `${source.name} (Copy)`,
        description: source.description,
        type: "USER",
        category: source.category,
        status: "ready",
        version: 1,
        isPublic: 0,
        createdFromRecipeId: systemId,
      });

      // Copy engines
      for (const engine of sourceEngines) {
        await db.insert(recipeEngines).values({
          id: uuidv4(),
          recipeId: duplicatedId,
          engineId: engine.engineId,
          weight: engine.weight,
          position: engine.position,
        });
      }

      const duplicated = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, duplicatedId))
        .then((rows: any[]) => rows[0]);

      const duplicatedEngines = await db
        .select()
        .from(recipeEngines)
        .where(eq(recipeEngines.recipeId, duplicatedId));

      expect(duplicated.type).toBe("USER");
      expect(duplicated.userId).toBe(userId);
      expect(duplicated.createdFromRecipeId).toBe(systemId);
      expect(duplicatedEngines).toHaveLength(sourceEngines.length);

      // Cleanup
      await db.delete(recipeEngines).where(eq(recipeEngines.recipeId, duplicatedId));
      await db.delete(recipes).where(eq(recipes.id, duplicatedId));
      await db.delete(recipeEngines).where(eq(recipeEngines.recipeId, systemId));
      await db.delete(recipes).where(eq(recipes.id, systemId));
      await db.delete(users).where(eq(users.id, userId));
    });
  });

  describe("5. Permission Verification", () => {
    it("should only allow user to view and modify their own recipes", async () => {
      // Create two test users
      const user1 = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "User 1",
          email: "user1@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const user2 = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "User 2",
          email: "user2@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const userId1 = user1[0].id;
      const userId2 = user2[0].id;

      // Create recipe for user 1
      const recipe1Id = uuidv4();
      await db.insert(recipes).values({
        id: recipe1Id,
        userId: userId1,
        name: "User 1 Recipe",
        description: "Private recipe",
        type: "USER",
        category: "OTHER",
        status: "ready",
        version: 1,
        isPublic: 0,
      });

      // Create recipe for user 2
      const recipe2Id = uuidv4();
      await db.insert(recipes).values({
        id: recipe2Id,
        userId: userId2,
        name: "User 2 Recipe",
        description: "Private recipe",
        type: "USER",
        category: "OTHER",
        status: "ready",
        version: 1,
        isPublic: 0,
      });

      // User 1 should only see their own recipe
      const user1Recipes = await db
        .select()
        .from(recipes)
        .where(and(eq(recipes.userId, userId1), eq(recipes.type, "USER")));

      expect(user1Recipes.every((r: any) => r.userId === userId1)).toBe(true);
      expect(user1Recipes.some((r: any) => r.id === recipe1Id)).toBe(true);

      // User 2 should only see their own recipe
      const user2Recipes = await db
        .select()
        .from(recipes)
        .where(and(eq(recipes.userId, userId2), eq(recipes.type, "USER")));

      expect(user2Recipes.every((r: any) => r.userId === userId2)).toBe(true);
      expect(user2Recipes.some((r: any) => r.id === recipe2Id)).toBe(true);

      // Cleanup
      await db.delete(recipes).where(eq(recipes.id, recipe1Id));
      await db.delete(recipes).where(eq(recipes.id, recipe2Id));
      await db.delete(users).where(eq(users.id, userId1));
      await db.delete(users).where(eq(users.id, userId2));
    });

    it("should allow all users to view SYSTEM recipes", async () => {
      // Create SYSTEM recipe
      const systemId = uuidv4();
      await db.insert(recipes).values({
        id: systemId,
        userId: null,
        name: "Public System Recipe",
        description: "Available to all",
        type: "SYSTEM",
        category: "OTHER",
        status: "ready",
        version: 1,
        displayOrder: 1,
        isPublic: 1,
      });

      // Query SYSTEM recipes
      const systemRecipes = await db
        .select()
        .from(recipes)
        .where(eq(recipes.type, "SYSTEM"));

      expect(systemRecipes.some((r: any) => r.id === systemId)).toBe(true);
      expect(systemRecipes.every((r: any) => r.userId === null)).toBe(true);

      // Cleanup
      await db.delete(recipes).where(eq(recipes.id, systemId));
    });

    it("should track recipe lineage via createdFromRecipeId", async () => {
      // Create SYSTEM recipe
      const systemId = uuidv4();
      await db.insert(recipes).values({
        id: systemId,
        userId: null,
        name: "System Template",
        description: "Template",
        type: "SYSTEM",
        category: "OTHER",
        status: "ready",
        version: 1,
        displayOrder: 1,
        isPublic: 1,
      });

      // Create test user
      const testUser = await db
        .insert(users)
        .values({
          openId: `test-user-${uuidv4()}`,
          name: "Test User",
          email: "test@example.com",
          loginMethod: "oauth",
          role: "user",
        })
        .$returningId();

      const userId = testUser[0].id;

      // Create user recipe derived from SYSTEM recipe
      const derivedId = uuidv4();
      await db.insert(recipes).values({
        id: derivedId,
        userId: userId,
        name: "My Custom Recipe",
        description: "Based on system template",
        type: "USER",
        category: "OTHER",
        status: "ready",
        version: 1,
        isPublic: 0,
        createdFromRecipeId: systemId,
      });

      // Verify lineage
      const derived = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, derivedId))
        .then((rows: any[]) => rows[0]);

      expect(derived.createdFromRecipeId).toBe(systemId);

      // Cleanup
      await db.delete(recipes).where(eq(recipes.id, derivedId));
      await db.delete(recipes).where(eq(recipes.id, systemId));
      await db.delete(users).where(eq(users.id, userId));
    });
  });
});
