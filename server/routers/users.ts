import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getAllUsers, updateUserRole } from "../db";

export const usersRouter = router({
  /**
   * Get all users (admin only)
   * Returns list of all users with their roles
   */
  list: adminProcedure.query(async () => {
    const allUsers = await getAllUsers();
    return allUsers.map(user => ({
      id: user.id,
      name: user.name || "Unknown",
      email: user.email || "No email",
      role: user.role,
      createdAt: user.createdAt,
      lastSignedIn: user.lastSignedIn,
    }));
  }),

  /**
   * Update user role (admin only)
   * Allows admin to promote/demote users
   */
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.number().int().positive(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      const updated = await updateUserRole(input.userId, input.role);
      if (!updated) {
        throw new Error("User not found");
      }
      return {
        id: updated.id,
        name: updated.name || "Unknown",
        email: updated.email || "No email",
        role: updated.role,
      };
    }),
});
