import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Account() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Account Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account preferences and settings.
        </p>

        {user && (
          <div className="border border-border rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="text-lg">{user.email || "Not available"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="text-lg">{user.name || "Not available"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Role</label>
                <p className="text-lg capitalize">{user.role || "user"}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border border-border rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Additional account settings coming soon.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
            >
              Back to Home
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
