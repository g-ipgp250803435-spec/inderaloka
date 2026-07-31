"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

export function ThemeControls() {
  const [dark, setDark] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("inderaloka-theme");
    const savedText = localStorage.getItem("inderaloka-large-text");
    const shouldDark = savedTheme === "dark";
    const shouldLarge = savedText === "true";
    setDark(shouldDark);
    setLargeText(shouldLarge);
    document.documentElement.dataset.theme = shouldDark ? "dark" : "light";
    document.documentElement.dataset.text = shouldLarge ? "large" : "normal";
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("inderaloka-theme", next ? "dark" : "light");
  };

  const toggleText = () => {
    const next = !largeText;
    setLargeText(next);
    document.documentElement.dataset.text = next ? "large" : "normal";
    localStorage.setItem("inderaloka-large-text", String(next));
  };

  return (
    <div className="theme-controls" aria-label="Tetapan paparan">
      <button onClick={toggleText} aria-pressed={largeText} title="Besarkan teks"><Icon name="text" size={17} /><span className="sr-only">Besarkan teks</span></button>
      <button onClick={toggleDark} aria-pressed={dark} title="Tukar tema"><Icon name={dark ? "sun" : "moon"} size={17} /><span className="sr-only">Tukar tema</span></button>
    </div>
  );
}
