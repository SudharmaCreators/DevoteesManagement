import React, { createContext, useContext, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Eye, EyeOff, AlertTriangle, X } from "lucide-react";

const DEV_CODE = "DevelopZ";

interface DevModeContextType {
  isDevMode: boolean;
  activateDevMode: () => void;
  deactivateDevMode: () => void;
  showDevLogin: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [isDevMode, setIsDevMode] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [showCode, setShowCode] = React.useState(false);
  const [error, setError] = React.useState("");

  const activateDevMode = useCallback(() => setIsDevMode(true), []);
  const deactivateDevMode = useCallback(() => setIsDevMode(false), []);
  const showDevLogin = useCallback(() => { setShowLogin(true); setCode(""); setError(""); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === DEV_CODE) {
      setIsDevMode(true);
      setShowLogin(false);
      setCode("");
      setError("");
    } else {
      setError("Invalid developer code");
    }
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, activateDevMode, deactivateDevMode, showDevLogin }}>
      {children}

      {/* Dev Mode Active Banner */}
      {isDevMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black flex items-center justify-between px-4 py-2 text-sm font-medium shadow-lg">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span>DEVELOPER MODE ACTIVE — Full edit access enabled</span>
            <Badge className="bg-black text-yellow-400 ml-2">DevelopZ</Badge>
          </div>
          <Button size="sm" variant="outline" className="border-black text-black hover:bg-black/10" onClick={() => setIsDevMode(false)}>
            <X className="w-3 h-3 mr-1" /> Exit Dev Mode
          </Button>
        </div>
      )}

      {/* Dev Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-yellow-500" />
              Developer Mode Access
            </DialogTitle>
            <DialogDescription>
              Enter the developer access code to enable full system configuration capabilities.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showCode ? "text" : "password"}
                placeholder="Enter developer code"
                value={code}
                onChange={e => { setCode(e.target.value); setError(""); }}
                className={`pr-10 font-mono ${error ? "border-destructive" : ""}`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                <Code2 className="w-4 h-4 mr-2" />
                Activate Developer Mode
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowLogin(false)}>Cancel</Button>
            </div>
          </form>
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Developer mode grants full access to all system settings and customizations.
          </div>
        </DialogContent>
      </Dialog>
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const ctx = useContext(DevModeContext);
  if (!ctx) throw new Error("useDevMode must be used within DevModeProvider");
  return ctx;
}
