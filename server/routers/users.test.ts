import { describe, it, expect, beforeEach, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import { usersRouter } from "./users";
import * as db from "../db";

// Mock the database
vi.mock("../db", () => ({
  getAllUsers: vi.fn(),
  updateUserRole: vi.fn(),
}));

describe("usersRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("users.list", () => {
    it("should return list of all users for admin", async () => {
      const mockUsers = [
        {
          id: 1,
          openId: "user1",
          name: "Alice",
          email: "alice@example.com",
          role: "admin" as const,
          createdAt: new Date(),
          lastSignedIn: new Date(),
          loginMethod: "oauth",
          updatedAt: new Date(),
        },
        {
          id: 2,
          openId: "user2",
          name: "Bob",
          email: "bob@example.com",
          role: "user" as const,
          createdAt: new Date(),
          lastSignedIn: new Date(),
          loginMethod: "oauth",
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getAllUsers).mockResolvedValue(mockUsers);

      const caller = usersRouter.createCaller({
        user: { id: 1, role: "admin", openId: "admin1" },
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.list();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        role: "admin",
        createdAt: mockUsers[0].createdAt,
        lastSignedIn: mockUsers[0].lastSignedIn,
      });
      expect(result[1]).toEqual({
        id: 2,
        name: "Bob",
        email: "bob@example.com",
        role: "user",
        createdAt: mockUsers[1].createdAt,
        lastSignedIn: mockUsers[1].lastSignedIn,
      });
    });

    it("should throw error if not admin", async () => {
      const caller = usersRouter.createCaller({
        user: { id: 2, role: "user", openId: "user2" },
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.list()).rejects.toThrow(TRPCError);
    });

    it("should return empty array if no users", async () => {
      vi.mocked(db.getAllUsers).mockResolvedValue([]);

      const caller = usersRouter.createCaller({
        user: { id: 1, role: "admin", openId: "admin1" },
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.list();
      expect(result).toEqual([]);
    });
  });

  describe("users.updateRole", () => {
    it("should update user role for admin", async () => {
      const updatedUser = {
        id: 2,
        openId: "user2",
        name: "Bob",
        email: "bob@example.com",
        role: "admin" as const,
        createdAt: new Date(),
        lastSignedIn: new Date(),
        loginMethod: "oauth",
        updatedAt: new Date(),
      };

      vi.mocked(db.updateUserRole).mockResolvedValue(updatedUser);

      const caller = usersRouter.createCaller({
        user: { id: 1, role: "admin", openId: "admin1" },
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.updateRole({ userId: 2, role: "admin" });

      expect(result).toEqual({
        id: 2,
        name: "Bob",
        email: "bob@example.com",
        role: "admin",
      });
      expect(db.updateUserRole).toHaveBeenCalledWith(2, "admin");
    });

    it("should throw error if not admin", async () => {
      const caller = usersRouter.createCaller({
        user: { id: 2, role: "user", openId: "user2" },
        req: {} as any,
        res: {} as any,
      });

      await expect(
        caller.updateRole({ userId: 3, role: "admin" })
      ).rejects.toThrow(TRPCError);
    });

    it("should throw error if user not found", async () => {
      vi.mocked(db.updateUserRole).mockResolvedValue(undefined);

      const caller = usersRouter.createCaller({
        user: { id: 1, role: "admin", openId: "admin1" },
        req: {} as any,
        res: {} as any,
      });

      await expect(
        caller.updateRole({ userId: 999, role: "user" })
      ).rejects.toThrow("User not found");
    });

    it("should demote admin to user", async () => {
      const demotedUser = {
        id: 1,
        openId: "admin1",
        name: "Alice",
        email: "alice@example.com",
        role: "user" as const,
        createdAt: new Date(),
        lastSignedIn: new Date(),
        loginMethod: "oauth",
        updatedAt: new Date(),
      };

      vi.mocked(db.updateUserRole).mockResolvedValue(demotedUser);

      const caller = usersRouter.createCaller({
        user: { id: 1, role: "admin", openId: "admin1" },
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.updateRole({ userId: 1, role: "user" });

      expect(result.role).toBe("user");
      expect(db.updateUserRole).toHaveBeenCalledWith(1, "user");
    });
  });
});
