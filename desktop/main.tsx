import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { GameExperience } from "@/components/game/GameExperience";
import "@/app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameExperience />
  </StrictMode>,
);
