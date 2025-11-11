"use client"

import { useEffect, useState } from "react"
import { X, Keyboard } from "lucide-react"
import { Button } from "@/components/ui/button"

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isOpen])

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 gap-2 bg-card hover:bg-card/80 border border-border"
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard className="w-4 h-4" />
        Shortcuts
      </Button>
    )
  }

  const shortcuts = [
    { key: "/", description: "Open search" },
    { key: "Esc", description: "Close panel/modal" },
    { key: "?", description: "Show keyboard shortcuts" },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="bg-background border border-border rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 id="shortcuts-title" className="text-2xl font-bold">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span>{shortcut.description}</span>
              <kbd className="px-3 py-1 bg-muted border border-border rounded text-sm font-mono text-primary">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          Press <kbd className="px-2 py-0.5 bg-muted border border-border rounded text-xs font-mono">?</kbd> anytime to
          see these shortcuts
        </p>
      </div>
    </div>
  )
}
