import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  Download,
  Upload,
  RotateCcw
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const [isDark, setIsDark] = useState(false);
  const [primaryHue, setPrimaryHue] = useState([262]);
  const [saturation, setSaturation] = useState([80]);
  const [lightness, setLightness] = useState([50]);
  const [backgroundPattern, setBackgroundPattern] = useState("gradient");

  const presetThemes = [
    { name: "Modern Purple", primary: 262, sat: 80, light: 50 },
    { name: "Ocean Blue", primary: 220, sat: 70, light: 45 },
    { name: "Forest Green", primary: 150, sat: 60, light: 40 },
    { name: "Sunset Orange", primary: 25, sat: 85, light: 55 },
    { name: "Rose Pink", primary: 330, sat: 75, light: 60 },
    { name: "Royal Purple", primary: 280, sat: 90, light: 35 }
  ];

  const backgroundPatterns = [
    { name: "Gradient", value: "gradient", preview: "bg-gradient-primary" },
    { name: "Subtle", value: "subtle", preview: "bg-gradient-subtle" },
    { name: "Solid", value: "solid", preview: "bg-background" },
    { name: "Dots", value: "dots", preview: "bg-background" },
    { name: "Grid", value: "grid", preview: "bg-background" }
  ];

  const applyTheme = () => {
    const root = document.documentElement;
    const hue = primaryHue[0];
    const sat = saturation[0];
    const light = lightness[0];

    // Update CSS custom properties
    root.style.setProperty('--primary', `${hue} ${sat}% ${light}%`);
    root.style.setProperty('--primary-light', `${hue} ${sat - 20}% ${light + 10}%`);
    root.style.setProperty('--primary-glow', `${hue} 100% 85%`);
    root.style.setProperty('--accent', `${hue + 20} ${sat - 20}% 95%`);
    root.style.setProperty('--accent-foreground', `${hue} ${sat}% ${light}%`);

    // Apply dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply background pattern
    document.body.className = `${backgroundPattern}-pattern`;
  };

  const resetTheme = () => {
    setPrimaryHue([262]);
    setSaturation([80]);
    setLightness([50]);
    setIsDark(false);
    setBackgroundPattern("gradient");
    
    // Reset to default
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--primary-light');
    root.style.removeProperty('--primary-glow');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--accent-foreground');
    document.documentElement.classList.remove('dark');
    document.body.className = '';
  };

  const exportTheme = () => {
    const theme = {
      isDark,
      primaryHue: primaryHue[0],
      saturation: saturation[0],
      lightness: lightness[0],
      backgroundPattern
    };
    
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chyrp-theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const theme = JSON.parse(e.target?.result as string);
        setIsDark(theme.isDark);
        setPrimaryHue([theme.primaryHue]);
        setSaturation([theme.saturation]);
        setLightness([theme.lightness]);
        setBackgroundPattern(theme.backgroundPattern);
      } catch (error) {
        console.error('Failed to import theme:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Theme Customizer</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button onClick={applyTheme} className="bg-gradient-primary">
                Apply Changes
              </Button>
              <Button variant="outline" onClick={resetTheme}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={exportTheme}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" asChild>
                <label>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={importTheme}
                  />
                </label>
              </Button>
            </div>
          </div>

          {/* Theme Mode */}
          <Card className="p-4">
            <Label className="text-base font-medium mb-3 block">Theme Mode</Label>
            <div className="flex items-center space-x-4">
              <Button
                variant={!isDark ? "default" : "outline"}
                onClick={() => setIsDark(false)}
                className="flex items-center space-x-2"
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </Button>
              <Button
                variant={isDark ? "default" : "outline"}
                onClick={() => setIsDark(true)}
                className="flex items-center space-x-2"
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </Button>
            </div>
          </Card>

          {/* Preset Themes */}
          <Card className="p-4">
            <Label className="text-base font-medium mb-3 block">Preset Themes</Label>
            <div className="grid grid-cols-2 gap-3">
              {presetThemes.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="h-auto p-3"
                  onClick={() => {
                    setPrimaryHue([preset.primary]);
                    setSaturation([preset.sat]);
                    setLightness([preset.light]);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: `hsl(${preset.primary}, ${preset.sat}%, ${preset.light}%)` }}
                    />
                    <span className="text-sm">{preset.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Color Customization */}
          <Card className="p-4">
            <Label className="text-base font-medium mb-4 block">Custom Colors</Label>
            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-2 block">Primary Hue: {primaryHue[0]}°</Label>
                <Slider
                  value={primaryHue}
                  onValueChange={setPrimaryHue}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block">Saturation: {saturation[0]}%</Label>
                <Slider
                  value={saturation}
                  onValueChange={setSaturation}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block">Lightness: {lightness[0]}%</Label>
                <Slider
                  value={lightness}
                  onValueChange={setLightness}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: `hsl(${primaryHue[0]}, ${saturation[0]}%, ${lightness[0]}%)` }}
                />
                <span className="text-sm">Preview Color</span>
              </div>
            </div>
          </Card>

          {/* Background Patterns */}
          <Card className="p-4">
            <Label className="text-base font-medium mb-3 block">Background Pattern</Label>
            <div className="grid grid-cols-3 gap-3">
              {backgroundPatterns.map((pattern) => (
                <Button
                  key={pattern.value}
                  variant={backgroundPattern === pattern.value ? "default" : "outline"}
                  className="h-16 p-2"
                  onClick={() => setBackgroundPattern(pattern.value)}
                >
                  <div className="text-center">
                    <div className={`w-8 h-8 mx-auto mb-1 rounded ${pattern.preview}`} />
                    <span className="text-xs">{pattern.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}