import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { GameExperience } from "@/components/game/GameExperience";
import { LandingExperience } from "@/components/landing/LandingExperience";
import "@/app/globals.css";

function DesktopApp() {
  const [isPlaying, setIsPlaying] = useState(false);

  return isPlaying ? (
    <GameExperience onExit={() => setIsPlaying(false)} />
  ) : (
    <LandingExperience onPlay={() => setIsPlaying(true)} />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DesktopApp />
  </StrictMode>,
);
