"use client"

import * as React from "react"
import { Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className="dark:bg-gray-800 dark:border-gray-600"  // Optional: for visibility in dark mode
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {/* Sun icon in light mode is black, in dark mode is white */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-black dark:text-white dark:-rotate-90 dark:scale-0" />
      
      {/* Moon icon in dark mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
