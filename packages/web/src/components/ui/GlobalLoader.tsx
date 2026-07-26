"use client";

import { useState, useEffect } from "react";
import ToffeeLoader from "@/components/ui/ToffeeLoader";

export function GlobalLoader() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Only show the loader on the first visit per session
    const hasLoaded = sessionStorage.getItem("toffee_has_loaded");
    if (!hasLoaded) {
      setShowLoader(true);
      sessionStorage.setItem("toffee_has_loaded", "true");
    }
  }, []);

  if (!showLoader) return null;

  return (
    <ToffeeLoader onComplete={() => setShowLoader(false)} />
  );
}
