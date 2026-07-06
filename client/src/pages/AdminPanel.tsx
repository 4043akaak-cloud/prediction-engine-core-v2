import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Users, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

/**
 * Admin Panel - User Management
 * Only accessible to admin users
 */
export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

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
          <Button onClick={() => setLocation("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">User Management</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Manage user accounts and roles
            </p>
            <Button onClick={() => setLocation("/admin/users")} className="w-full">
              Manage Users
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">System Status</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              View system health and metrics
            </p>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </Card>
        </div>

        <Button onClick={() => setLocation("/")} variant="outline">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
