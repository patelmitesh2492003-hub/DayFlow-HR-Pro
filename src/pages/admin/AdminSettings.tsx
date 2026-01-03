import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { settingsAPI } from "@/lib/api";
import { Save, Loader2 } from "lucide-react";

const AdminSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        companyName: "",
        timezone: "",
        currency: "",
        emailNotifications: true
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await settingsAPI.get();
            setSettings(data);
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await settingsAPI.update(settings);
            toast({ title: "Success", description: "Settings saved successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />
            <main className="pl-64">
                <DashboardHeader title="Settings" subtitle="Manage system configurations" />

                <div className="p-8 max-w-2xl">
                    {loading ? (
                        <Loader2 className="animate-spin w-8 h-8 text-primary" />
                    ) : (
                        <div className="bg-card p-6 rounded-xl border border-border/50 space-y-6">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input
                                    value={settings.companyName}
                                    onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Timezone</Label>
                                <Input
                                    value={settings.timezone}
                                    onChange={e => setSettings({ ...settings, timezone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <Input
                                    value={settings.currency}
                                    onChange={e => setSettings({ ...settings, currency: e.target.value })}
                                />
                            </div>

                            <Button onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
