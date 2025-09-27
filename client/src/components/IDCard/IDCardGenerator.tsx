import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { IDCardPreview } from "./IDCardPreview";
import { Printer, Download, Users, CreditCard, QrCode } from "lucide-react";
import { Devotee } from "@shared/schema";

const templates = [
  { id: "standard", name: "Standard Template", description: "Basic ID card with essential information" },
  { id: "devotional", name: "Devotional Template", description: "Traditional design with religious motifs" },
  { id: "festival", name: "Festival Template", description: "Festive design for special occasions" },
  { id: "vip", name: "VIP Template", description: "Premium design for senior members" },
  { id: "minimal", name: "Minimal Template", description: "Clean and simple design" },
];

export function IDCardGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [selectedDevotees, setSelectedDevotees] = useState<number[]>([]);
  const [includeQRCode, setIncludeQRCode] = useState(true);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [previewDevotee, setPreviewDevotee] = useState<Devotee | null>(null);

  const { data: devotees, isLoading } = useQuery({
    queryKey: ["/api/devotees"],
  });

  const handleDevoteeSelection = (devoteeId: number, checked: boolean) => {
    if (checked) {
      setSelectedDevotees(prev => [...prev, devoteeId]);
    } else {
      setSelectedDevotees(prev => prev.filter(id => id !== devoteeId));
    }
  };

  const handleSelectAll = () => {
    if (devotees) {
      setSelectedDevotees(devotees.map((d: Devotee) => d.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedDevotees([]);
  };

  const handleGeneratePDF = async () => {
    // In a real implementation, this would call an API to generate PDFs
    console.log("Generating PDF for devotees:", selectedDevotees);
    console.log("Template:", selectedTemplate);
    console.log("Options:", { includeQRCode, includePhoto });
    
    // Mock PDF generation
    alert(`Generating ${selectedDevotees.length} ID cards with ${selectedTemplate} template`);
  };

  const handlePreview = (devotee: Devotee) => {
    setPreviewDevotee(devotee);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading devotees...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>ID Card Generation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Select Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="qrcode"
                      checked={includeQRCode}
                      onCheckedChange={setIncludeQRCode}
                    />
                    <Label htmlFor="qrcode" className="flex items-center space-x-2">
                      <QrCode className="w-4 h-4" />
                      <span>Include QR Code</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="photo"
                      checked={includePhoto}
                      onCheckedChange={setIncludePhoto}
                    />
                    <Label htmlFor="photo" className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Include Photo</span>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Devotee Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Select Devotees</Label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={handleSelectAll}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                      Deselect All
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3 max-h-64 overflow-y-auto">
                  {devotees && devotees.length > 0 ? (
                    <div className="space-y-2">
                      {devotees.map((devotee: Devotee) => (
                        <div key={devotee.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedDevotees.includes(devotee.id)}
                              onCheckedChange={(checked) => handleDevoteeSelection(devotee.id, checked as boolean)}
                            />
                            <div>
                              <span className="font-medium">{devotee.firstName} {devotee.lastName}</span>
                              <div className="text-sm text-muted-foreground">{devotee.devoteeId}</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(devotee)}
                          >
                            Preview
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No devotees found</p>
                  )}
                </div>
              </div>

              {/* Generation Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {selectedDevotees.length} selected
                  </Badge>
                  <Button
                    onClick={handleGeneratePDF}
                    disabled={selectedDevotees.length === 0}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate & Download PDF
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div>
              <Label className="text-base font-medium mb-3 block">Preview</Label>
              {previewDevotee ? (
                <IDCardPreview
                  devotee={previewDevotee}
                  template={selectedTemplate}
                  includeQRCode={includeQRCode}
                  includePhoto={includePhoto}
                />
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Select a devotee to preview their ID card</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Type, 
  Image, 
  Layout,
  Download,
  Eye,
  Settings
} from "lucide-react";

interface IDCardGeneratorProps {
  devotees: any[];
  onGenerate: (settings: any) => void;
}

export function IDCardGenerator({ devotees, onGenerate }: IDCardGeneratorProps) {
  const [settings, setSettings] = useState({
    template: 'default',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    fontSize: 12,
    includePhoto: true,
    includeQR: true,
    includeAddress: true,
    orientation: 'portrait',
    cardSize: 'credit',
  });

  const templates = [
    { id: 'default', name: 'Default', description: 'Standard temple design' },
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple' },
    { id: 'ornate', name: 'Ornate', description: 'Decorative borders' },
    { id: 'modern', name: 'Modern', description: 'Contemporary design' },
  ];

  const cardSizes = [
    { id: 'credit', name: 'Credit Card', dimensions: '85.6 × 53.98 mm' },
    { id: 'badge', name: 'Badge', dimensions: '90 × 60 mm' },
    { id: 'custom', name: 'Custom', dimensions: 'Custom size' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>ID Card Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div>
          <Label className="text-base font-medium">Template</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {templates.map(template => (
              <div
                key={template.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  settings.template === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSettings(prev => ({ ...prev, template: template.id }))}
              >
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="primaryColor"
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-12 h-8 p-0 border-0"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="secondaryColor"
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-12 h-8 p-0 border-0"
              />
              <Input
                value={settings.secondaryColor}
                onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <Label>Font Size: {settings.fontSize}px</Label>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, fontSize: value }))}
            min={8}
            max={16}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Card Size */}
        <div>
          <Label>Card Size</Label>
          <Select 
            value={settings.cardSize} 
            onValueChange={(value) => setSettings(prev => ({ ...prev, cardSize: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cardSizes.map(size => (
                <SelectItem key={size.id} value={size.id}>
                  <div>
                    <div className="font-medium">{size.name}</div>
                    <div className="text-xs text-muted-foreground">{size.dimensions}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Include Elements</Label>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Profile Photo</span>
            </div>
            <Switch
              checked={settings.includePhoto}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includePhoto: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layout className="w-4 h-4" />
              <span>QR Code</span>
            </div>
            <Switch
              checked={settings.includeQR}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeQR: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4" />
              <span>Address</span>
            </div>
            <Switch
              checked={settings.includeAddress}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeAddress: checked }))}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button 
            onClick={() => onGenerate(settings)} 
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Cards
          </Button>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
