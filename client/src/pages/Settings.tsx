import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';
import { ChevronLeft } from 'lucide-react';

export default function Settings() {
  const [, setLocation] = useLocation();
  const { settings, updateTheme } = useSettings();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation('/')}
            className="hover:opacity-70 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </header>

      {/* Settings Sections */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* General Section */}
        <SettingsSection
          title="General"
          description="Basic application settings"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Application Name</p>
                <p className="text-sm text-muted-foreground">Prediction Engine Core</p>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Prediction Section */}
        <SettingsSection
          title="Prediction"
          description="Customize your prediction experience"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              More prediction settings coming soon
            </p>
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          title="Notifications"
          description="Manage notification preferences"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your predictions
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.enabled}
                disabled
                className="w-4 h-4"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Notification types (Outcome Reminder, Learning Report, etc.) coming soon
            </p>
          </div>
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection
          title="Appearance"
          description="Customize how the app looks"
        >
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-3">Theme</p>
              <div className="flex gap-2">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      updateTheme(theme as 'light' | 'dark' | 'system');
                    }}
                    className={`px-4 py-2 rounded border transition-colors capitalize ${
                      settings.appearance.theme === theme
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection
          title="Account"
          description="Manage your account"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Account management features coming soon
            </p>
          </div>
        </SettingsSection>

        {/* About Section */}
        <SettingsSection
          title="About"
          description="Information about this application"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Application</p>
                <p className="font-medium">Prediction Engine Core</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Build</p>
                <p className="font-medium">0449a25e</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">License</p>
                <p className="font-medium">MIT</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <a
                href="https://github.com/4043akaak-cloud/prediction-engine-core"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </SettingsSection>
      </main>
    </div>
  );
}

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </Card>
  );
}
