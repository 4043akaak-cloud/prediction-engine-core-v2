import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Loader2, Shield, User } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

/**
 * Admin Users Management Page
 * List all users and manage their roles
 */
export default function AdminUsers() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);


  // Get utils for cache invalidation
  const utils = trpc.useUtils();
  // Fetch users list
  const { data: users, isLoading, error } = trpc.users.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Update role mutation
  const updateRoleMutation = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      setSelectedUserId(null);
      // Invalidate users list to refresh
      utils.users.list.invalidate();
    },
  });

  // Redirect non-admins to home
  if (isAuthenticated && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
          </div>
          <p className="mb-6">You do not have permission to access this page.</p>
          <Button onClick={() => setLocation("/admin")} variant="outline">
            Back to Admin Panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            onClick={() => setLocation("/admin")}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage user accounts and roles
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-4 mb-6 border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Error loading users</p>
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="p-8">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p>Loading users...</p>
            </div>
          </Card>
        )}

        {/* Users List */}
        {users && users.length > 0 && (
          <div className="space-y-3">
            {users.map(u => (
              <Card key={u.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      {u.role === "admin" ? (
                        <Shield className="w-5 h-5 text-primary" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {u.role === "admin" ? (
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            Admin
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-muted text-xs font-semibold">
                            User
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    {selectedUserId === u.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUserId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateRoleMutation.mutate({
                              userId: u.id,
                              role: u.role === "admin" ? "user" : "admin",
                            })
                          }
                          disabled={updateRoleMutation.isPending}
                        >
                          {updateRoleMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Updating...
                            </>
                          ) : (
                            `Make ${u.role === "admin" ? "User" : "Admin"}`
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUserId(u.id)}
                      >
                        Change Role
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {users && users.length === 0 && (
          <Card className="p-8 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No users found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
