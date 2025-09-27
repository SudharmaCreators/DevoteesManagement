import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'devotional' | 'matrix' | 'ironman' | 'ocean' | 'forest' | 'royal' | 'sunset' | 'midnight';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { value: Theme; label: string; description: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  { value: 'devotional' as Theme, label: 'Devotional Classic', description: 'Saffron, maroon, and gold devotional theme' },
  { value: 'matrix' as Theme, label: 'Matrix Digital', description: 'Transparent green and black matrix-style interface' },
  { value: 'ironman' as Theme, label: 'Iron Man Tech', description: 'Red and gold holographic interface' },
  { value: 'ocean' as Theme, label: 'Ocean Blue', description: 'Blue and teal professional theme' },
  { value: 'forest' as Theme, label: 'Forest Green', description: 'Green and brown nature-inspired theme' },
  { value: 'royal' as Theme, label: 'Royal Purple', description: 'Purple and gold elegant theme' },
  { value: 'sunset' as Theme, label: 'Sunset Orange', description: 'Orange and pink warm theme' },
  { value: 'midnight' as Theme, label: 'Midnight Dark', description: 'Dark purple and blue sophisticated theme' },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>('devotional');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes.find(t => t.value === savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = `theme-${theme}`;
    
    // Apply theme-specific CSS variables
    const root = document.documentElement;
    switch (theme) {
      case 'devotional':
        root.style.setProperty('--primary', 'hsl(24, 100%, 60%)');
        root.style.setProperty('--secondary', 'hsl(343, 100%, 25%)');
        root.style.setProperty('--accent', 'hsl(51, 100%, 50%)');
        root.style.setProperty('--background', 'hsl(60, 29%, 94%)');
        root.style.setProperty('--foreground', 'hsl(210, 20%, 18%)');
        break;
      case 'matrix':
        root.style.setProperty('--primary', 'hsl(120, 100%, 50%)');
        root.style.setProperty('--secondary', 'hsl(120, 100%, 7%)');
        root.style.setProperty('--accent', 'hsl(156, 100%, 53%)');
        root.style.setProperty('--background', 'hsl(0, 0%, 0%)');
        root.style.setProperty('--foreground', 'hsl(120, 100%, 50%)');
        break;
      case 'ironman':
        root.style.setProperty('--primary', 'hsl(0, 100%, 50%)');
        root.style.setProperty('--secondary', 'hsl(51, 100%, 50%)');
        root.style.setProperty('--accent', 'hsl(16, 100%, 60%)');
        root.style.setProperty('--background', 'hsl(0, 0%, 10%)');
        root.style.setProperty('--foreground', 'hsl(0, 0%, 100%)');
        break;
      case 'ocean':
        root.style.setProperty('--primary', 'hsl(210, 100%, 40%)');
        root.style.setProperty('--secondary', 'hsl(189, 100%, 38%)');
        root.style.setProperty('--accent', 'hsl(180, 100%, 63%)');
        root.style.setProperty('--background', 'hsl(210, 100%, 97%)');
        root.style.setProperty('--foreground', 'hsl(221, 39%, 29%)');
        break;
      case 'forest':
        root.style.setProperty('--primary', 'hsl(120, 61%, 34%)');
        root.style.setProperty('--secondary', 'hsl(25, 76%, 31%)');
        root.style.setProperty('--accent', 'hsl(120, 73%, 75%)');
        root.style.setProperty('--background', 'hsl(120, 100%, 97%)');
        root.style.setProperty('--foreground', 'hsl(180, 25%, 25%)');
        break;
      case 'royal':
        root.style.setProperty('--primary', 'hsl(270, 50%, 40%)');
        root.style.setProperty('--secondary', 'hsl(51, 100%, 50%)');
        root.style.setProperty('--accent', 'hsl(300, 47%, 64%)');
        root.style.setProperty('--background', 'hsl(240, 100%, 99%)');
        root.style.setProperty('--foreground', 'hsl(263, 100%, 25%)');
        break;
      case 'sunset':
        root.style.setProperty('--primary', 'hsl(30, 100%, 50%)');
        root.style.setProperty('--secondary', 'hsl(330, 100%, 70%)');
        root.style.setProperty('--accent', 'hsl(351, 100%, 86%)');
        root.style.setProperty('--background', 'hsl(54, 100%, 93%)');
        root.style.setProperty('--foreground', 'hsl(25, 76%, 31%)');
        break;
      case 'midnight':
        root.style.setProperty('--primary', 'hsl(263, 100%, 25%)');
        root.style.setProperty('--secondary', 'hsl(239, 84%, 27%)');
        root.style.setProperty('--accent', 'hsl(267, 57%, 65%)');
        root.style.setProperty('--background', 'hsl(240, 37%, 6%)');
        root.style.setProperty('--foreground', 'hsl(240, 5%, 91%)');
        break;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
