"use client";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function ThemeSwitchBtn() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  );
}

export default ThemeSwitchBtn;
