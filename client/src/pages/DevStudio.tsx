import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Code2, Palette, Navigation, Settings, Users, Database,
  Download, Upload, Save, RotateCcw, Plus, Trash2, Eye, EyeOff,
  ChevronUp, ChevronDown, RefreshCw, Check, AlertTriangle, Copy,
  Layers, Paintbrush, LayoutDashboard, Shield, FileJson, History,
  Home, Building, Calendar, Heart, CalendarDays, HandHeart,
  BarChart3, CreditCard, GraduationCap, PanelTop, Type,
  Sliders, Sparkles, Tag, Move
} from "lucide-react";

const ICON_OPTIONS = [
  "Home", "Users", "Building", "GraduationCap", "Calendar", "Heart",
  "CalendarDays", "HandHeart", "BarChart3", "CreditCard", "Settings",
  "PanelTop", "Shield", "Database", "Layers", "Sparkles", "Tag"
];

const FIELD_TYPES = ["text", "number", "date", "dropdown", "boolean", "email", "phone", "textarea"];

const THEME_PRESETS = [
  { id: "devotional", label: "Devotional Classic", primary: "24 100% 60%", secondary: "343 100% 25%", accent: "51 100% 50%", bg: "60 29% 94%" },
  { id: "ocean", label: "Ocean Blue", primary: "210 100% 40%", secondary: "189 100% 38%", accent: "180 100% 63%", bg: "210 100% 97%" },
  { id: "forest", label: "Forest Green", primary: "120 61% 34%", secondary: "25 76% 31%", accent: "120 73% 75%", bg: "120 100% 97%" },
  { id: "royal", label: "Royal Purple", primary: "270 50% 40%", secondary: "51 100% 50%", accent: "300 47% 64%", bg: "240 100% 99%" },
  { id: "sunset", label: "Sunset Orange", primary: "30 100% 50%", secondary: "330 100% 70%", accent: "351 100% 86%", bg: "54 100% 93%" },
  { id: "midnight", label: "Midnight Dark", primary: "263 100% 65%", secondary: "239 84% 67%", accent: "267 57% 65%", bg: "240 37% 6%" },
  { id: "matrix", label: "Matrix Digital", primary: "120 100% 50%", secondary: "120 100% 7%", accent: "156 100% 53%", bg: "0 0% 0%" },
  { id: "ironman", label: "Iron Man", primary: "0 100% 50%", secondary: "51 100% 50%", accent: "16 100% 60%", bg: "0 0% 10%" },
];

const ALL_PAGES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "devotees", label: "Devotees" },
  { id: "families", label: "Families" },
  { id: "mentors", label: "Mentors" },
  { id: "attendance", label: "Attendance" },
  { id: "donations", label: "Donations" },
  { id: "events", label: "Events" },
  { id: "volunteering", label: "Volunteering" },
  { id: "analytics", label: "Analytics" },
  { id: "id-cards", label: "ID Cards" },
  { id: "settings", label: "Settings" },
  { id: "dev-studio", label: "Dev Studio" },
];

function ColorSlider({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const parts = value.split(" ");
  const h = parseInt(parts[0]) || 0;
  const s = parseInt(parts[1]) || 0;
  const l = parseInt(parts[2]) || 50;
  const preview = `hsl(${h}, ${s}%, ${l}%)`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-border" style={{ background: preview }} />
          <code className="text-xs text-muted-foreground bg-muted px-1 rounded">{value}</code>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Hue (0-360)</Label>
          <Input
            type="number" min={0} max={360} value={h}
            onChange={e => onChange(`${e.target.value} ${s}% ${l}%`)}
            className="h-7 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Saturation %</Label>
          <Input
            type="number" min={0} max={100} value={s}
            onChange={e => onChange(`${h} ${e.target.value}% ${l}%`)}
            className="h-7 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Lightness %</Label>
          <Input
            type="number" min={0} max={100} value={l}
            onChange={e => onChange(`${h} ${s}% ${e.target.value}%`)}
            className="h-7 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

export default function DevStudio() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("app-info");
  const [snapshotName, setSnapshotName] = useState("");
  const [importJson, setImportJson] = useState("");
  const [newNavItem, setNewNavItem] = useState({ name: "", href: "", icon: "Home" });
  const [newField, setNewField] = useState({ label: "", type: "text", entity: "devotee", required: false, placeholder: "", options: "" });
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const { data: config, isLoading } = useQuery<any>({
    queryKey: ["/api/dev-config"],
  });

  const [localAppInfo, setLocalAppInfo] = useState<any>(null);
  const [localNav, setLocalNav] = useState<any[]>([]);
  const [localTheme, setLocalTheme] = useState<any>(null);
  const [localFields, setLocalFields] = useState<any[]>([]);
  const [localRoles, setLocalRoles] = useState<any>(null);

  useEffect(() => {
    if (config) {
      setLocalAppInfo(config.appInfo);
      setLocalNav(config.navigation?.items ? [...config.navigation.items].sort((a: any, b: any) => a.order - b.order) : []);
      setLocalTheme(config.theme);
      setLocalFields(config.customFields || []);
      setLocalRoles(config.roleProfiles);
    }
  }, [config]);

  const applyThemePreview = (colors: any) => {
    const root = document.documentElement;
    if (colors.primary) root.style.setProperty('--primary', `hsl(${colors.primary})`);
    if (colors.secondary) root.style.setProperty('--secondary', `hsl(${colors.secondary})`);
    if (colors.accent) root.style.setProperty('--accent', `hsl(${colors.accent})`);
    if (colors.background) root.style.setProperty('--background', `hsl(${colors.background})`);
    if (colors.foreground) root.style.setProperty('--foreground', `hsl(${colors.foreground})`);
    if (colors.card) root.style.setProperty('--card', `hsl(${colors.card})`);
    if (colors.border) root.style.setProperty('--border', `hsl(${colors.border})`);
    if (colors.muted) root.style.setProperty('--muted', `hsl(${colors.muted})`);
  };

  const saveAppInfoMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", "/api/dev-config/app-info", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/dev-config"] }); toast({ title: "App info saved" }); },
    onError: () => toast({ title: "Failed to save", variant: "destructive" }),
  });

  const saveNavMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", "/api/dev-config/navigation", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/dev-config"] }); toast({ title: "Navigation saved" }); },
    onError: () => toast({ title: "Failed to save", variant: "destructive" }),
  });

  const saveThemeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", "/api/dev-config/theme", data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/dev-config"] });
      toast({ title: "Theme saved" });
      if (data?.useCustom && data?.customColors) applyThemePreview(data.customColors);
    },
    onError: () => toast({ title: "Failed to save", variant: "destructive" }),
  });

  const saveFieldsMutation = useMutation({
    mutationFn: (fields: any[]) => apiRequest("PATCH", "/api/dev-config/custom-fields", { fields }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/dev-config"] }); toast({ title: "Custom fields saved" }); },
    onError: () => toast({ title: "Failed to save", variant: "destructive" }),
  });

  const saveRolesMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", "/api/dev-config/role-profiles", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/dev-config"] }); toast({ title: "Role profiles saved" }); },
    onError: () => toast({ title: "Failed to save", variant: "destructive" }),
  });

  const snapshotMutation = useMutation({
    mutationFn: (name: string) => apiRequest("POST", "/api/dev-config/snapshot", { name }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/dev-config"] }); setSnapshotName(""); toast({ title: "Snapshot saved" }); },
    onError: () => toast({ title: "Failed to save snapshot", variant: "destructive" }),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/dev-config/restore/${id}`, {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/dev-config"] }); toast({ title: "Config restored" }); },
    onError: () => toast({ title: "Failed to restore", variant: "destructive" }),
  });

  const importMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/dev-config/import", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/dev-config"] }); setImportJson(""); toast({ title: "Config imported successfully" }); },
    onError: () => toast({ title: "Invalid config format", variant: "destructive" }),
  });

  const moveNavItem = (idx: number, dir: "up" | "down") => {
    const items = [...localNav];
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= items.length) return;
    [items[idx], items[target]] = [items[target], items[idx]];
    items.forEach((item, i) => { item.order = i; });
    setLocalNav(items);
  };

  const toggleNavVisibility = (id: string) => {
    setLocalNav(prev => prev.map(item => item.id === id ? { ...item, visible: !item.visible } : item));
  };

  const addNavItem = () => {
    if (!newNavItem.name || !newNavItem.href) return;
    const item = { id: `custom_${Date.now()}`, ...newNavItem, visible: true, order: localNav.length };
    setLocalNav(prev => [...prev, item]);
    setNewNavItem({ name: "", href: "", icon: "Home" });
  };

  const removeNavItem = (id: string) => {
    setLocalNav(prev => prev.filter(item => item.id !== id));
  };

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    const newColors = {
      ...localTheme?.customColors,
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
      background: preset.bg,
    };
    const newTheme = { ...localTheme, activePreset: preset.id, customColors: newColors };
    setLocalTheme(newTheme);
    if (localTheme?.useCustom) applyThemePreview(newColors);
    else setTheme(preset.id as any);
  };

  const updateCustomColor = (key: string, value: string) => {
    const newColors = { ...localTheme?.customColors, [key]: value };
    const newTheme = { ...localTheme, customColors: newColors };
    setLocalTheme(newTheme);
    if (localTheme?.useCustom) applyThemePreview(newColors);
  };

  const addCustomField = () => {
    if (!newField.label) return;
    const id = newField.label.toLowerCase().replace(/\s+/g, "_");
    const field: any = { id, ...newField };
    if (newField.type === "dropdown") field.options = newField.options.split(",").map(o => o.trim()).filter(Boolean);
    setLocalFields(prev => [...prev, field]);
    setNewField({ label: "", type: "text", entity: "devotee", required: false, placeholder: "", options: "" });
  };

  const removeField = (id: string) => setLocalFields(prev => prev.filter(f => f.id !== id));

  const toggleRolePage = (role: string, pageId: string) => {
    setLocalRoles((prev: any) => {
      const pages: string[] = prev[role]?.visiblePages || [];
      const updated = pages.includes(pageId) ? pages.filter((p: string) => p !== pageId) : [...pages, pageId];
      return { ...prev, [role]: { ...prev[role], visiblePages: updated } };
    });
  };

  const handleExport = async () => {
    const res = await fetch('/api/dev-config/export', { credentials: 'include' });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'madhav-parivar-config.json'; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Config exported" });
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importJson);
      importMutation.mutate(data);
    } catch {
      toast({ title: "Invalid JSON format", variant: "destructive" });
    }
  };

  if (isLoading || !localAppInfo) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Dev Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Developer Studio"
        subtitle="Full application configuration and design control"
        actions={
          <Badge className="bg-yellow-500 text-black text-xs font-bold px-2 py-1">
            <Code2 className="w-3 h-3 mr-1" /> DEV MODE ACTIVE
          </Badge>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="app-info" className="flex items-center gap-1.5 text-xs">
              <LayoutDashboard className="w-3.5 h-3.5" /> App Info
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-1.5 text-xs">
              <Paintbrush className="w-3.5 h-3.5" /> Theme
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-1.5 text-xs">
              <Navigation className="w-3.5 h-3.5" /> Navigation
            </TabsTrigger>
            <TabsTrigger value="custom-fields" className="flex items-center gap-1.5 text-xs">
              <Database className="w-3.5 h-3.5" /> Fields
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-1.5 text-xs">
              <Shield className="w-3.5 h-3.5" /> Roles
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1.5 text-xs">
              <FileJson className="w-3.5 h-3.5" /> Config
            </TabsTrigger>
          </TabsList>

          {/* ── APP INFO ── */}
          <TabsContent value="app-info">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-primary" /> Application Identity</CardTitle>
                    <CardDescription>Customize the app name, subtitle, and logo appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Application Name</Label>
                        <Input value={localAppInfo.name} onChange={e => setLocalAppInfo({ ...localAppInfo, name: e.target.value })} placeholder="App name" data-testid="input-app-name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input value={localAppInfo.subtitle} onChange={e => setLocalAppInfo({ ...localAppInfo, subtitle: e.target.value })} placeholder="Subtitle" data-testid="input-app-subtitle" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Logo Symbol</Label>
                        <Input value={localAppInfo.logoSymbol} onChange={e => setLocalAppInfo({ ...localAppInfo, logoSymbol: e.target.value })} placeholder="Logo character/symbol" maxLength={4} />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button onClick={() => saveAppInfoMutation.mutate(localAppInfo)} disabled={saveAppInfoMutation.isPending} data-testid="button-save-app-info">
                        {saveAppInfoMutation.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save App Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Panel */}
              <div className="space-y-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Eye className="w-4 h-4" /> Live Preview</CardTitle></CardHeader>
                  <CardContent>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <span className="text-primary-foreground text-lg font-bold">{localAppInfo.logoSymbol || "॥"}</span>
                        </div>
                        <div>
                          <h1 className="text-base font-bold text-foreground">{localAppInfo.name || "App Name"}</h1>
                          <p className="text-xs text-muted-foreground">{localAppInfo.subtitle || "Subtitle"}</p>
                        </div>
                      </div>
                      <Separator />
                      <p className="text-xs text-muted-foreground mt-3 text-center">Sidebar header preview</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4" /> System Info</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      ["Version", "1.0.0"],
                      ["Storage", "In-Memory"],
                      ["Auth", "Replit Auth"],
                      ["Framework", "React 18 + Express"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{k}</span>
                        <Badge variant="outline" className="text-xs">{v}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── THEME ── */}
          <TabsContent value="theme">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Paintbrush className="w-5 h-5 text-primary" /> Theme Presets</CardTitle>
                    <CardDescription>Choose a preset or customize individual colors below</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {THEME_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          onClick={() => applyPreset(preset)}
                          className={`group relative p-3 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${localTheme?.activePreset === preset.id ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'}`}
                          data-testid={`button-preset-${preset.id}`}
                        >
                          <div className="flex gap-1 mb-2">
                            <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${preset.primary})` }} />
                            <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${preset.secondary})` }} />
                            <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${preset.accent})` }} />
                          </div>
                          <p className="text-xs font-medium truncate">{preset.label}</p>
                          {localTheme?.activePreset === preset.id && (
                            <div className="absolute top-1.5 right-1.5"><Check className="w-3 h-3 text-primary" /></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2"><Sliders className="w-5 h-5 text-primary" /> Custom Colors</CardTitle>
                        <CardDescription>Fine-tune individual color values (HSL format)</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Enable Custom</Label>
                        <Switch
                          checked={localTheme?.useCustom || false}
                          onCheckedChange={checked => {
                            const newT = { ...localTheme, useCustom: checked };
                            setLocalTheme(newT);
                            if (checked && localTheme?.customColors) applyThemePreview(localTheme.customColors);
                          }}
                          data-testid="switch-custom-theme"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {localTheme?.useCustom ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {["primary", "secondary", "accent", "background", "foreground", "card", "border", "muted"].map(key => (
                          <ColorSlider
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={localTheme?.customColors?.[key] || "0 0% 50%"}
                            onChange={v => updateCustomColor(key, v)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Sliders className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Enable Custom Colors to override theme color values</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Type className="w-5 h-5 text-primary" /> Shape & Spacing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Border Radius</Label>
                        <code className="text-xs bg-muted px-1 rounded">{localTheme?.borderRadius || "0.5"}rem</code>
                      </div>
                      <input
                        type="range" min="0" max="2" step="0.125"
                        value={localTheme?.borderRadius || "0.5"}
                        onChange={e => {
                          const newT = { ...localTheme, borderRadius: e.target.value };
                          setLocalTheme(newT);
                          document.documentElement.style.setProperty('--radius', `${e.target.value}rem`);
                        }}
                        className="w-full"
                        data-testid="slider-border-radius"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Square (0)</span><span>Rounded (1)</span><span>Full (2)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={() => saveThemeMutation.mutate(localTheme)} disabled={saveThemeMutation.isPending} data-testid="button-save-theme">
                    {saveThemeMutation.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Theme
                  </Button>
                </div>
              </div>

              {/* Theme preview */}
              <div>
                <Card className="sticky top-0">
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Eye className="w-4 h-4" /> Color Preview</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="h-10 flex items-center px-3 gap-2" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                        <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>M</div>
                        <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Madhav Parivar</span>
                      </div>
                      <div className="p-3 space-y-2" style={{ background: 'var(--background)' }}>
                        <div className="rounded p-2" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                          <div className="text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Sample Card</div>
                          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Content text here</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 h-7 rounded text-xs flex items-center justify-center font-medium" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>Primary</div>
                          <div className="flex-1 h-7 rounded text-xs flex items-center justify-center font-medium" style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}>Accent</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {["--primary","--secondary","--accent","--background","--foreground","--card","--border","--muted"].map(v => (
                        <div key={v} className="h-6 rounded border border-border" style={{ background: `var(${v})` }} title={v.slice(2)} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── NAVIGATION ── */}
          <TabsContent value="navigation">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Navigation className="w-5 h-5 text-primary" /> Sidebar Navigation</CardTitle>
                    <CardDescription>Reorder items, toggle visibility, rename labels, or add new links</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {localNav.map((item, idx) => (
                      <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border ${item.visible ? 'border-border bg-card' : 'border-dashed border-border bg-muted/30 opacity-60'}`} data-testid={`nav-item-${item.id}`}>
                        <Move className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <Input
                            value={item.name}
                            onChange={e => setLocalNav(prev => prev.map((n, i) => i === idx ? { ...n, name: e.target.value } : n))}
                            className="h-7 text-sm"
                            placeholder="Label"
                          />
                          <Input
                            value={item.href}
                            onChange={e => setLocalNav(prev => prev.map((n, i) => i === idx ? { ...n, href: e.target.value } : n))}
                            className="h-7 text-sm font-mono"
                            placeholder="/path"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveNavItem(idx, "up")} disabled={idx === 0}>
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveNavItem(idx, "down")} disabled={idx === localNav.length - 1}>
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleNavVisibility(item.id)} title={item.visible ? "Hide" : "Show"}>
                            {item.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => removeNavItem(item.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Add Navigation Item</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Label</Label>
                        <Input value={newNavItem.name} onChange={e => setNewNavItem({ ...newNavItem, name: e.target.value })} className="h-8" placeholder="Page Name" data-testid="input-new-nav-name" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Path</Label>
                        <Input value={newNavItem.href} onChange={e => setNewNavItem({ ...newNavItem, href: e.target.value })} className="h-8 font-mono" placeholder="/my-page" data-testid="input-new-nav-href" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Icon</Label>
                        <Select value={newNavItem.icon} onValueChange={v => setNewNavItem({ ...newNavItem, icon: v })}>
                          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ICON_OPTIONS.map(icon => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button size="sm" className="mt-3" onClick={addNavItem} disabled={!newNavItem.name || !newNavItem.href} data-testid="button-add-nav-item">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={() => saveNavMutation.mutate({ items: localNav })} disabled={saveNavMutation.isPending} data-testid="button-save-navigation">
                    {saveNavMutation.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Navigation
                  </Button>
                </div>
              </div>

              <div>
                <Card className="sticky top-0">
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Eye className="w-4 h-4" /> Sidebar Preview</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="px-4 py-3 border-b border-border bg-card">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-primary-foreground text-xs font-bold">{localAppInfo?.logoSymbol}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold">{localAppInfo?.name}</p>
                            <p className="text-[10px] text-muted-foreground">{localAppInfo?.subtitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 space-y-0.5 bg-card">
                        {localNav.filter(n => n.visible).map(item => (
                          <div key={item.id} className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-muted">
                            <div className="w-3 h-3 rounded-sm bg-muted-foreground/30" />
                            <span className="truncate">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">{localNav.filter(n => n.visible).length} visible · {localNav.filter(n => !n.visible).length} hidden</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── CUSTOM FIELDS ── */}
          <TabsContent value="custom-fields">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-primary" /> Custom Fields</CardTitle>
                    <CardDescription>Add additional fields to devotee and other entity profiles. These fields are stored as metadata.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {localFields.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No custom fields defined yet</p>
                      </div>
                    )}
                    {localFields.map((field, idx) => (
                      <div key={field.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">{field.label}</p>
                            <p className="text-xs text-muted-foreground font-mono">{field.id}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs capitalize">{field.type}</Badge>
                            <Badge variant="outline" className="text-xs capitalize">{field.entity}</Badge>
                            {field.required && <Badge className="text-xs">Required</Badge>}
                            {field.type === "dropdown" && field.options && (
                              <span className="text-xs text-muted-foreground">{field.options.length} options</span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => removeField(field.id)} data-testid={`button-delete-field-${field.id}`}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Add Custom Field</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Field Label</Label>
                        <Input value={newField.label} onChange={e => setNewField({ ...newField, label: e.target.value })} className="h-8" placeholder="e.g. Spiritual Name" data-testid="input-new-field-label" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Field Type</Label>
                        <Select value={newField.type} onValueChange={v => setNewField({ ...newField, type: v })}>
                          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Entity</Label>
                        <Select value={newField.entity} onValueChange={v => setNewField({ ...newField, entity: v })}>
                          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="devotee">Devotee</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Placeholder</Label>
                        <Input value={newField.placeholder} onChange={e => setNewField({ ...newField, placeholder: e.target.value })} className="h-8" placeholder="Hint text" />
                      </div>
                      {newField.type === "dropdown" && (
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Options (comma-separated)</Label>
                          <Input value={newField.options} onChange={e => setNewField({ ...newField, options: e.target.value })} className="h-8" placeholder="Option A, Option B, Option C" data-testid="input-new-field-options" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch checked={newField.required} onCheckedChange={v => setNewField({ ...newField, required: v })} data-testid="switch-field-required" />
                        <Label className="text-sm">Required field</Label>
                      </div>
                      <Button size="sm" onClick={addCustomField} disabled={!newField.label} data-testid="button-add-custom-field">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Field
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={() => saveFieldsMutation.mutate(localFields)} disabled={saveFieldsMutation.isPending} data-testid="button-save-fields">
                    {saveFieldsMutation.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Custom Fields
                  </Button>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader><CardTitle className="text-sm">Field Types Guide</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { t: "text", d: "Short text string" },
                      { t: "number", d: "Numeric value" },
                      { t: "date", d: "Date picker" },
                      { t: "dropdown", d: "Select from options" },
                      { t: "boolean", d: "Yes/No toggle" },
                      { t: "email", d: "Email address" },
                      { t: "phone", d: "Phone number" },
                      { t: "textarea", d: "Multi-line text" },
                    ].map(({ t, d }) => (
                      <div key={t} className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs capitalize">{t}</Badge>
                        <span className="text-xs text-muted-foreground">{d}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── ROLES ── */}
          <TabsContent value="roles">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Role-Based Access Profiles</CardTitle>
                  <CardDescription>Configure which pages and capabilities each role has access to</CardDescription>
                </CardHeader>
                <CardContent>
                  {localRoles && Object.entries(localRoles).map(([role, profile]: [string, any]) => (
                    <div key={role} className="mb-6 last:mb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="capitalize text-sm px-3 py-1">{profile.label || role}</Badge>
                        <div className="flex items-center gap-4 ml-auto">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={profile.canEdit}
                              onCheckedChange={v => setLocalRoles((prev: any) => ({ ...prev, [role]: { ...prev[role], canEdit: v } }))}
                              data-testid={`switch-role-${role}-edit`}
                            />
                            <Label className="text-xs">Can Edit</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={profile.canDelete}
                              onCheckedChange={v => setLocalRoles((prev: any) => ({ ...prev, [role]: { ...prev[role], canDelete: v } }))}
                              data-testid={`switch-role-${role}-delete`}
                            />
                            <Label className="text-xs">Can Delete</Label>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                        {ALL_PAGES.map(page => (
                          <label key={page.id} className="flex items-center gap-1.5 cursor-pointer" data-testid={`checkbox-role-${role}-${page.id}`}>
                            <input
                              type="checkbox"
                              checked={profile.visiblePages?.includes(page.id)}
                              onChange={() => toggleRolePage(role, page.id)}
                              className="rounded"
                            />
                            <span className="text-xs">{page.label}</span>
                          </label>
                        ))}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => saveRolesMutation.mutate(localRoles)} disabled={saveRolesMutation.isPending} data-testid="button-save-roles">
                      {saveRolesMutation.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Role Profiles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── CONFIG ── */}
          <TabsContent value="config">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Export / Import */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5 text-primary" /> Export Configuration</CardTitle>
                    <CardDescription>Download the complete app configuration as an encrypted JSON file for backup or migration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-muted rounded-lg p-4 text-sm space-y-1.5">
                      {["App Info (name, subtitle, logo)", "Navigation items and order", "Theme colors and settings", "Custom fields schema", "Role access profiles"].map(item => (
                        <div key={item} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="w-3 h-3 text-green-500" /> {item}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" onClick={handleExport} data-testid="button-export-config">
                      <Download className="w-4 h-4 mr-2" /> Download Config JSON
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5 text-primary" /> Import Configuration</CardTitle>
                    <CardDescription>Paste a previously exported config JSON to restore settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      value={importJson}
                      onChange={e => setImportJson(e.target.value)}
                      placeholder='Paste exported config JSON here...'
                      className="font-mono text-xs h-36"
                      data-testid="textarea-import-config"
                    />
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={handleImport} disabled={!importJson || importMutation.isPending} data-testid="button-import-config">
                        {importMutation.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        Import Config
                      </Button>
                      <Button variant="outline" onClick={() => setImportJson("")}>Clear</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Snapshots */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><History className="w-5 h-5 text-primary" /> Config Snapshots</CardTitle>
                    <CardDescription>Save the current config state and restore it later (up to 10 snapshots)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={snapshotName}
                        onChange={e => setSnapshotName(e.target.value)}
                        placeholder="Snapshot name (optional)"
                        className="flex-1"
                        data-testid="input-snapshot-name"
                      />
                      <Button onClick={() => snapshotMutation.mutate(snapshotName)} disabled={snapshotMutation.isPending} data-testid="button-save-snapshot">
                        {snapshotMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </Button>
                    </div>

                    <ScrollArea className="h-64">
                      {(!config?.snapshots || config.snapshots.length === 0) ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No snapshots yet. Save one to get started.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {config.snapshots.map((snap: any) => (
                            <div key={snap.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{snap.name}</p>
                                <p className="text-xs text-muted-foreground">{new Date(snap.createdAt).toLocaleString()}</p>
                              </div>
                              <Button
                                size="sm" variant="outline" className="h-7 text-xs"
                                onClick={() => restoreMutation.mutate(snap.id)}
                                disabled={restoreMutation.isPending}
                                data-testid={`button-restore-${snap.id}`}
                              >
                                <RotateCcw className="w-3 h-3 mr-1" /> Restore
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileJson className="w-5 h-5 text-primary" /> Live Config View</CardTitle>
                    <CardDescription>Read-only view of current config state</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Button
                        size="sm" variant="ghost" className="absolute top-2 right-2 h-6 text-xs z-10"
                        onClick={() => { navigator.clipboard.writeText(JSON.stringify(config, null, 2)); toast({ title: "Copied to clipboard" }); }}
                        data-testid="button-copy-config"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </Button>
                      <ScrollArea className="h-48">
                        <pre className="text-xs font-mono text-muted-foreground bg-muted p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify({ appInfo: config?.appInfo, navigation: { itemCount: config?.navigation?.items?.length }, theme: config?.theme, customFieldCount: config?.customFields?.length, roleProfiles: Object.keys(config?.roleProfiles || {}) }, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
