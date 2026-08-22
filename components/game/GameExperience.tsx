"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clampStat,
  endingFor,
  initialStats,
  scenarios,
  stationMeta,
  type GameStats,
  type ScenarioChoice,
  type StationId,
} from "@/lib/game/scenarios";
import styles from "./game.module.css";

type Phase = "playing" | "resolving" | "finished";

interface Outcome {
  eyebrow: string;
  headline: string;
  narrative: string;
  effects?: Partial<GameStats>;
  degraded?: boolean;
}

const stations: StationId[] = ["spacex", "community", "teaching"];
const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const statLabels: Array<{ key: keyof GameStats; label: string; code: string }> = [
  { key: "community", label: "Community", code: "65" },
  { key: "students", label: "Builders", code: "AI" },
  { key: "elon", label: "Mission trust", code: "X" },
  { key: "energy", label: "Energy", code: "⚡" },
];

const stationVisuals: Record<StationId, { desk: string; displayName: string }> = {
  spacex: { desk: "MISSION SYSTEMS", displayName: "SpaceX AI" },
  community: { desk: "TALENT NETWORK", displayName: "65labs" },
  teaching: { desk: "BUILDER ACADEMY", displayName: "Code with AI" },
};

function applyEffects(stats: GameStats, effects: Partial<GameStats>): GameStats {
  return {
    community: clampStat(stats.community + (effects.community ?? 0)),
    students: clampStat(stats.students + (effects.students ?? 0)),
    elon: clampStat(stats.elon + (effects.elon ?? 0)),
    energy: clampStat(stats.energy + (effects.energy ?? 0)),
  };
}

function stationRole(station: StationId): "community" | "teaching" | "spacex" {
  return station;
}

function moveAgrim(station: StationId | "center") {
  window.dispatchEvent(new CustomEvent("agrim:move", { detail: station }));
}

function impactEntries(effects: Partial<GameStats>) {
  return (Object.entries(effects) as Array<[keyof GameStats, number]>).filter(([, value]) => value !== 0);
}

function impactLabel(key: keyof GameStats) {
  return { community: "Community", students: "Builders", elon: "Mission", energy: "Energy" }[key];
}

export function GameExperience() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number | null>(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const [stats, setStats] = useState<GameStats>(initialStats);
  const [selectedStation, setSelectedStation] = useState<StationId | null>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const scenario = scenarios[taskIndex];
  const [secondsLeft, setSecondsLeft] = useState(scenario?.timeout ?? 0);

  const endGame = useCallback((nextStats: GameStats) => {
    setStats(nextStats);
    setPhase("finished");
    setSelectedStation(null);
    moveAgrim("center");
  }, []);

  const advance = useCallback(
    (nextStats: GameStats) => {
      const nextIndex = taskIndex + 1;
      if (nextStats.energy <= 0 || nextIndex >= scenarios.length) {
        endGame(nextStats);
        return;
      }
      setTaskIndex(nextIndex);
      setSecondsLeft(scenarios[nextIndex].timeout);
      setSelectedStation(null);
      setOutcome(null);
      setPhase("playing");
      moveAgrim("center");
    },
    [endGame, taskIndex],
  );

  const scheduleAdvance = useCallback(
    (nextStats: GameStats) => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => advance(nextStats), 3000);
    },
    [advance],
  );

  const expireTask = useCallback(() => {
    if (!scenario || phase !== "playing") return;
    const nextStats = applyEffects(stats, scenario.neglect);
    setStats(nextStats);
    setPhase("resolving");
    setOutcome({
      eyebrow: "Critical request missed",
      headline: `${stationMeta[scenario.station].shortLabel} remembers.`,
      narrative: "The alert disappeared. The consequence did not. Another world moved while Agrim was elsewhere.",
      effects: scenario.neglect,
      degraded: true,
    });
    scheduleAdvance(nextStats);
  }, [phase, scenario, scheduleAdvance, stats]);

  useEffect(() => {
    if (phase !== "playing" || !scenario) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          window.setTimeout(expireTask, 0);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [expireTask, phase, scenario]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let game: { destroy: (removeCanvas: boolean, noReturn?: boolean) => void } | null = null;
    let cleanupMove: (() => void) | null = null;

    async function mountScene() {
      if (!canvasRef.current) return;
      const phaserModule = await import("phaser");
      if (disposed || !canvasRef.current) return;
      const Phaser = phaserModule.default;

      class OperationsScene extends Phaser.Scene {
        private operator?: Phaser.GameObjects.Container;
        private travelLine?: Phaser.GameObjects.Graphics;
        private stationFrames = new Map<StationId, Phaser.GameObjects.Rectangle>();
        private stationBeacons = new Map<StationId, Phaser.GameObjects.Arc>();

        constructor() {
          super("operations");
        }

        preload() {
          this.load.image("agrim", "/images/agrim-tech-overlord-logo.png");
          this.load.image("65labs", "/images/65labs-logo.png");
          this.load.image("code", "/images/code-with-ai-logo.png");
          this.load.image("spacex", "/images/spacex-logo.png");
        }

        create() {
          const width = this.scale.width;
          const height = this.scale.height;
          const floorTop = Math.min(150, height * 0.18);
          const floorBottom = height - 40;
          const margin = Math.max(18, width * 0.025);
          const roomGap = Math.max(10, width * 0.012);
          const roomWidth = (width - margin * 2 - roomGap * 2) / 3;
          const roomTop = floorTop + 20;
          const roomHeight = Math.max(310, floorBottom - roomTop - 110);
          const graphics = this.add.graphics();

          graphics.fillStyle(0x0d0e0e, 1);
          graphics.fillRect(0, 0, width, height);
          graphics.fillStyle(0x111413, 1);
          graphics.fillRect(0, floorTop, width, floorBottom - floorTop);

          for (let x = 0; x <= width; x += 48) {
            graphics.lineStyle(1, 0xffffff, x % 192 === 0 ? 0.06 : 0.025);
            graphics.lineBetween(x, floorTop, x, floorBottom);
          }
          for (let y = floorTop; y <= floorBottom; y += 42) {
            graphics.lineStyle(1, 0xffffff, 0.03);
            graphics.lineBetween(0, y, width, y);
          }

          const stageStations: Array<{
            id: StationId;
            x: number;
            color: number;
            label: string;
            code: string;
            texture: string;
          }> = [
            { id: "spacex", x: margin + roomWidth / 2, color: 0xf0be3d, label: "SPACEX AI", code: "BUILD · MISSION SYSTEMS", texture: "spacex" },
            { id: "community", x: margin + roomWidth * 1.5 + roomGap, color: 0xff6238, label: "65LABS", code: "RECRUIT · TALENT NETWORK", texture: "65labs" },
            { id: "teaching", x: margin + roomWidth * 2.5 + roomGap * 2, color: 0x54c8ff, label: "CODE WITH AI", code: "GROW · BUILDER ACADEMY", texture: "code" },
          ];

          stageStations.forEach((station, stationIndex) => {
            const left = station.x - roomWidth / 2;
            const frame = this.add.rectangle(station.x, roomTop + roomHeight / 2, roomWidth, roomHeight, station.color, 0.055)
              .setStrokeStyle(2, station.color, 0.42);
            this.stationFrames.set(station.id, frame);

            const roomAura = this.add.rectangle(station.x, roomTop + roomHeight / 2, roomWidth - 8, roomHeight - 8, station.color, 0.018);
            this.tweens.add({
              targets: roomAura,
              alpha: 0.09,
              duration: 1800 + stationIndex * 420,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });

            const tint = this.add.rectangle(left + 4, roomTop + roomHeight / 2, 7, roomHeight - 4, station.color, 0.9);
            tint.setOrigin(0.5);
            const beacon = this.add.circle(left + roomWidth - 25, roomTop + 24, 6, station.color, 0.24)
              .setStrokeStyle(1, station.color, 0.5);
            this.stationBeacons.set(station.id, beacon);

            this.add.text(left + 21, roomTop + 17, `0${stationIndex + 1} / ${station.code}`, {
              fontFamily: "monospace",
              fontSize: `${Math.max(9, Math.min(12, width / 120))}px`,
              color: `#${station.color.toString(16).padStart(6, "0")}`,
              letterSpacing: 2,
            });

            const logo = this.add.image(station.x, roomTop + 67, station.texture).setOrigin(0.5);
            if (station.id === "community") logo.setDisplaySize(Math.min(132, roomWidth * 0.42), Math.min(53, roomWidth * 0.17));
            if (station.id === "teaching") logo.setDisplaySize(55, 55);
            if (station.id === "spacex") logo.setCrop(38, 185, 660, 185).setDisplaySize(Math.min(190, roomWidth * 0.56), 52);

            const propTop = roomTop + 112;
            const usableWidth = roomWidth - 44;
            if (station.id === "community") {
              const people: Phaser.GameObjects.Container[] = [];
              for (let person = 0; person < 7; person += 1) {
                const px = left + 42 + (person % 4) * (usableWidth / 4);
                const py = propTop + 55 + Math.floor(person / 4) * 75;
                const head = this.add.circle(0, -12, 9, person % 2 ? 0xe4b28c : 0xb77b58, 1);
                const body = this.add.rectangle(0, 8, 25, 31, person % 3 === 0 ? station.color : 0x3b4140, 1).setStrokeStyle(1, 0xffffff, 0.12);
                const personNode = this.add.container(px, py, [body, head]);
                people.push(personNode);
                this.tweens.add({ targets: personNode, y: py - 4, duration: 900 + person * 120, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
              }
              for (let bubble = 0; bubble < 3; bubble += 1) {
                const bubbleNode = this.add.rectangle(left + 55 + bubble * (usableWidth / 3), propTop + bubble * 18, 52, 20, 0xf4f0e7, 0.1).setStrokeStyle(1, station.color, 0.3);
                this.tweens.add({ targets: bubbleNode, alpha: 0.35, duration: 650 + bubble * 240, yoyo: true, repeat: -1 });
              }
              this.add.text(left + 22, roomTop + roomHeight - 49, "327 ONLINE  /  04 FLAGS  /  SIGNAL 92%", { fontFamily: "monospace", fontSize: "9px", color: "#ff8067" });
            }

            if (station.id === "teaching") {
              const screenY = propTop + 2;
              graphics.fillStyle(0x13191a, 1);
              graphics.fillRoundedRect(left + 25, screenY, usableWidth - 6, 92, 5);
              graphics.lineStyle(1, station.color, 0.35);
              graphics.strokeRoundedRect(left + 25, screenY, usableWidth - 6, 92, 5);
              for (let line = 0; line < 5; line += 1) {
                const codeLine = this.add.rectangle(left + 43, screenY + 18 + line * 13, Math.max(32, usableWidth * (0.62 - line * 0.07)), 3, line === 1 ? station.color : 0xb8c2c1, line === 1 ? 0.8 : 0.3).setOrigin(0, 0.5);
                this.tweens.add({ targets: codeLine, scaleX: 0.55, duration: 1100 + line * 190, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
              }
              for (let desk = 0; desk < 4; desk += 1) {
                const dx = left + 42 + (desk % 2) * (usableWidth / 2);
                const dy = screenY + 132 + Math.floor(desk / 2) * 62;
                graphics.fillStyle(0x282e2e, 1);
                graphics.fillRoundedRect(dx, dy, Math.max(55, usableWidth * 0.34), 32, 3);
                graphics.fillStyle(station.color, 0.45);
                graphics.fillRect(dx + 10, dy + 8, Math.max(28, usableWidth * 0.2), 3);
              }
              this.add.text(left + 22, roomTop + roomHeight - 49, "48 BUILDERS  /  31 SHIPPED  /  COHORT LIVE", { fontFamily: "monospace", fontSize: "9px", color: "#7bd9ff" });
            }

            if (station.id === "spacex") {
              const windowRadius = Math.min(72, roomWidth * 0.23);
              const windowX = station.x;
              const windowY = propTop + 65;
              const spaceWindow = this.add.circle(windowX, windowY, windowRadius, 0x030608, 1).setStrokeStyle(2, station.color, 0.35);
              for (let star = 0; star < 18; star += 1) {
                const angle = (star / 18) * Math.PI * 2;
                const distance = 18 + ((star * 23) % Math.max(20, windowRadius - 14));
                const starNode = this.add.circle(windowX + Math.cos(angle) * distance, windowY + Math.sin(angle) * distance, star % 4 === 0 ? 2 : 1, 0xffffff, 0.45 + (star % 3) * 0.15);
                this.tweens.add({ targets: starNode, alpha: 0.1, duration: 700 + star * 70, yoyo: true, repeat: -1 });
              }
              const rocket = this.add.graphics();
              rocket.fillStyle(0xece9e1, 1);
              rocket.fillRoundedRect(windowX - 5, windowY - 30, 10, 44, 5);
              rocket.fillTriangle(windowX - 5, windowY - 26, windowX, windowY - 39, windowX + 5, windowY - 26);
              rocket.fillStyle(station.color, 0.95);
              rocket.fillTriangle(windowX - 5, windowY + 10, windowX, windowY + 31, windowX + 5, windowY + 10);
              this.tweens.add({ targets: rocket, y: -8, duration: 1250, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
              this.add.text(left + 22, roomTop + roomHeight - 49, "FLIGHT AI  /  T−00:42  /  SYSTEMS NOMINAL", { fontFamily: "monospace", fontSize: "9px", color: "#f0be3d" });
              void spaceWindow;
            }

            this.add.text(station.x, roomTop + roomHeight - 17, station.label, {
              fontFamily: "Arial",
              fontSize: `${Math.max(13, Math.min(17, width / 95))}px`,
              fontStyle: "bold",
              color: "#f4f0e7",
              letterSpacing: 1,
            }).setOrigin(0.5, 1);
          });

          const travelY = Math.min(floorBottom - 70, roomTop + roomHeight + 56);
          graphics.lineStyle(2, 0xffffff, 0.13);
          graphics.lineBetween(margin + 20, travelY, width - margin - 20, travelY);
          for (let dash = margin + 25; dash < width - margin; dash += 54) {
            graphics.fillStyle(0xf4f0e7, 0.09);
            graphics.fillRect(dash, travelY - 2, 24, 4);
          }
          this.travelLine = this.add.graphics();

          const operatorGlow = this.add.circle(0, 0, 55, 0xffa228, 0.12);
          const body = this.add.rectangle(0, 24, 42, 50, 0x11110f, 1).setStrokeStyle(2, 0xffa228, 0.75);
          const operatorRing = this.add.circle(0, -15, 35, 0x11110f, 0.98).setStrokeStyle(2, 0xffa228, 0.8);
          const portrait = this.add.image(0, -15, "agrim").setDisplaySize(61, 61);
          const status = this.add.text(0, 61, "AGRIM / MOVING", {
            fontFamily: "monospace",
            fontSize: "9px",
            color: "#f4f0e7",
            backgroundColor: "#11110f",
            padding: { x: 8, y: 4 },
          }).setOrigin(0.5);
          this.operator = this.add.container(width * 0.5, travelY, [operatorGlow, body, operatorRing, portrait, status]);
          this.operator.setDepth(20);

          this.tweens.add({
            targets: operatorGlow,
            scale: 1.28,
            alpha: 0.025,
            duration: 1150,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          const positionFor = (target: StationId | "center") => {
            if (target === "center") return width * 0.5;
            return stageStations.find((station) => station.id === target)?.x ?? width * 0.5;
          };
          const onMove = (event: Event) => {
            const target = (event as CustomEvent<StationId | "center">).detail;
            const targetX = positionFor(target);
            const startX = this.operator?.x ?? width * 0.5;
            for (let trail = 0; trail < 5; trail += 1) {
              const trailDot = this.add.circle(startX, travelY, 8 - trail, 0xffa228, 0.22).setDepth(18);
              this.tweens.add({ targets: trailDot, x: targetX, alpha: 0, scale: 0.2, delay: trail * 70, duration: 650, onComplete: () => trailDot.destroy() });
            }
            this.travelLine?.clear();
            this.travelLine?.lineStyle(2, 0xffa228, 0.55);
            this.travelLine?.lineBetween(startX, travelY, targetX, travelY);
            this.tweens.add({
              targets: this.operator,
              x: targetX,
              duration: 720,
              ease: "Back.easeInOut",
              onComplete: () => {
                this.travelLine?.clear();
                this.tweens.add({ targets: this.operator, scale: 1.1, duration: 100, yoyo: true });
              },
            });
          };
          const setIncident = (station: StationId, failed = false) => {
            stageStations.forEach((candidate) => {
              const active = candidate.id === station;
              this.stationFrames.get(candidate.id)?.setStrokeStyle(active ? 3 : 2, candidate.color, active ? 0.95 : 0.3);
              const stationBeacon = this.stationBeacons.get(candidate.id);
              if (stationBeacon) {
                this.tweens.killTweensOf(stationBeacon);
                stationBeacon.setAlpha(active ? 1 : 0.3).setScale(1);
                if (active) this.tweens.add({ targets: stationBeacon, scale: 2.1, alpha: 0.18, duration: 720, yoyo: true, repeat: -1 });
              }
            });
            if (failed) {
              this.cameras.main.shake(260, 0.006);
              this.cameras.main.flash(180, 255, 72, 48, false);
            }
          };
          setIncident("community");
          const onIncident = (event: Event) => {
            const detail = (event as CustomEvent<{ station: StationId; failed?: boolean }>).detail;
            setIncident(detail.station, detail.failed);
          };
          window.addEventListener("agrim:move", onMove);
          window.addEventListener("agrim:incident", onIncident);
          cleanupMove = () => {
            window.removeEventListener("agrim:move", onMove);
            window.removeEventListener("agrim:incident", onIncident);
          };
        }
      }

      const bounds = canvasRef.current.getBoundingClientRect();
      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: canvasRef.current,
        width: Math.max(360, Math.round(bounds.width)),
        height: Math.max(600, Math.round(bounds.height)),
        backgroundColor: "#0d0e0e",
        transparent: false,
        render: { antialias: true, pixelArt: false },
        scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: OperationsScene,
      });
    }

    void mountScene();
    return () => {
      disposed = true;
      cleanupMove?.();
      game?.destroy(true);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("agrim:incident", {
      detail: {
        station: scenario.station,
        failed: phase === "resolving" && Boolean(outcome?.degraded),
      },
    }));
  }, [outcome?.degraded, phase, scenario.station]);

  const chooseStation = useCallback(
    (station: StationId) => {
      if (phase !== "playing") return;
      setSelectedStation(station);
      moveAgrim(station);
    },
    [phase],
  );

  const choose = useCallback(
    async (choice: ScenarioChoice) => {
      if (!scenario || phase !== "playing") return;
      setPhase("resolving");
      const nextStats = applyEffects(stats, choice.effects);
      setStats(nextStats);
      setOutcome({
        eyebrow: choice.delegate ? "Gemma · local chief of staff" : "Decision executed",
        headline: choice.label,
        narrative: choice.delegate
          ? "The local model is reading the request without sending sensitive operations data elsewhere."
          : "The call is made. The dashboards move. Somewhere, the next notification is already blinking.",
        effects: choice.effects,
      });

      try {
        if (choice.delegate) {
          const response = await fetch("/api/ai/gemma", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              role: stationRole(scenario.station),
              message: scenario.body,
              context: { title: scenario.title, decision: choice.decision, stats: nextStats },
            }),
          });
          if (!response.ok) throw new Error("Gemma request failed");
          const data = (await response.json()) as {
            result?: { recommendedAction?: string; confidence?: number; reason?: string };
            degraded?: boolean;
          };
          const recommendation = data.result?.recommendedAction?.replaceAll("_", " ") ?? "review manually";
          const confidence = Math.round((data.result?.confidence ?? 0.5) * 100);
          setOutcome({
            eyebrow: data.degraded ? "Fallback protocol" : "Gemma · local analysis complete",
            headline: `${recommendation} · ${confidence}%`,
            narrative: data.result?.reason ?? "Gemma returned a cautious recommendation.",
            effects: choice.effects,
            degraded: data.degraded,
          });
        } else {
          const response = await fetch("/api/ai/gemini", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              mode: "consequence",
              decision: choice.decision,
              scenario: scenario.body,
              gameState: nextStats,
            }),
          });
          if (!response.ok) throw new Error("Gemini request failed");
          const data = (await response.json()) as {
            result?: { headline?: string; narrative?: string };
            degraded?: boolean;
          };
          setOutcome({
            eyebrow: data.degraded ? "Simulated consequence" : "Gemini · world reaction",
            headline: data.result?.headline ?? choice.label,
            narrative: data.result?.narrative ?? "The world reacts to Agrim's call.",
            effects: choice.effects,
            degraded: data.degraded,
          });
        }
      } catch {
        setOutcome({
          eyebrow: "Offline consequence",
          headline: choice.label,
          narrative: "The AI line went quiet, but the week did not. The deterministic playbook took over.",
          effects: choice.effects,
          degraded: true,
        });
      } finally {
        scheduleAdvance(nextStats);
      }
    },
    [phase, scenario, scheduleAdvance, stats],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (phase !== "playing") return;
      const stationIndex = Number(event.key) - 1;
      if (stationIndex >= 0 && stationIndex < stations.length) {
        chooseStation(stations[stationIndex]);
        return;
      }
      if (selectedStation !== scenario.station) return;
      const choiceIndex = ["a", "b", "c"].indexOf(event.key.toLowerCase());
      if (choiceIndex >= 0) void choose(scenario.choices[choiceIndex]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, chooseStation, phase, scenario, selectedStation]);

  const endings = useMemo(() => endingFor(stats), [stats]);
  const elapsed = scenario ? scenario.timeout - secondsLeft : 0;
  const timerScale = scenario ? Math.max(0, 1 - elapsed / scenario.timeout) : 0;
  const urgency = secondsLeft <= 5 ? "critical" : secondsLeft <= 10 ? "warning" : "stable";

  if (phase === "finished") {
    return (
      <main className={styles.endScreen}>
        <div className={styles.endGrain} aria-hidden="true" />
        <p className={styles.endKicker}>Week complete · Performance review</p>
        <h1>{endings.overall}</h1>
        <p className={styles.endSummary}>Agrim survived community chaos, ambitious students, and a launch review with almost enough sleep.</p>
        <div className={styles.endingGrid}>
          <article><span>65labs</span><strong>{endings.community}</strong><small>{stats.community}/100</small></article>
          <article><span>Code with AI</span><strong>{endings.teaching}</strong><small>{stats.students}/100</small></article>
          <article><span>SpaceX AI</span><strong>{endings.spacex}</strong><small>{stats.elon}/100</small></article>
        </div>
        <p className={styles.verdict}>“You kept three worlds moving. Next time, remember that coffee is not a fourth job.”</p>
        <div className={styles.endActions}>
          <button type="button" onClick={() => window.location.reload()}>Return to title</button>
          <button
            type="button"
            onClick={() => {
              setTaskIndex(0);
              setStats(initialStats);
              setSecondsLeft(scenarios[0].timeout);
              setOutcome(null);
              setSelectedStation(null);
              setPhase("playing");
              moveAgrim("center");
            }}
          >Play again</button>
        </div>
      </main>
    );
  }

  return (
    <main className={`${styles.gameShell} ${styles[urgency]}`}>
      <div className={styles.canvas} ref={canvasRef} aria-hidden="true" />
      <div className={styles.scanlines} aria-hidden="true" />

      <header className={styles.hud}>
        <div className={styles.brandBlock}>
          {/* This local HUD asset intentionally bypasses the runtime image optimizer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/agrim-tech-overlord-logo.png" alt="" />
          <div><span>Agrim Tycoon</span><strong>OPERATIONS FLOOR</strong></div>
        </div>
        <div className={styles.shiftBlock}>
          <span>{weekdays[Math.min(6, scenario.day - 1)]} · DAY {scenario.day}/07</span>
          <strong>SHIFT {String(taskIndex + 1).padStart(2, "0")}</strong>
        </div>
        <div className={styles.stats}>
          {statLabels.map(({ key, label, code }) => (
            <div className={`${styles.stat} ${stats[key] < 35 ? styles.statDanger : ""}`} key={key}>
              <span>{label}</span>
              <i>{code}</i>
              <strong>{stats[key]}</strong>
              <div><b style={{ width: `${stats[key]}%` }} /></div>
            </div>
          ))}
        </div>
        <button className={styles.exitButton} type="button" onClick={() => window.location.reload()}>ESC<br /><span>Exit</span></button>
      </header>

      <div className={styles.missionStrip}>
        <span>LIVE OPERATIONS</span>
        <p>One operator. Three worlds. Every choice costs something.</p>
        <b>{taskIndex + 1} / {scenarios.length} INCIDENTS</b>
      </div>

      <section className={styles.stationControls} aria-label="Agrim's workstations">
        {stations.map((station, index) => {
          const meta = stationMeta[station];
          const visual = stationVisuals[station];
          const hasTask = scenario.station === station;
          return (
            <button
              key={station}
              type="button"
              className={`${styles.stationButton} ${selectedStation === station ? styles.selected : ""} ${hasTask ? styles.hasTask : ""}`}
              style={{ "--station-accent": meta.accent } as React.CSSProperties}
              onClick={() => chooseStation(station)}
              disabled={phase !== "playing"}
            >
              <span className={styles.stationKey}>{index + 1}</span>
              <span className={styles.stationCopy}><small>{visual.desk}</small><strong>{visual.displayName}</strong></span>
              <span className={styles.stationState}>{hasTask ? "P0 · INCOMING" : "CLEAR"}</span>
              {hasTask ? <i className={styles.pulse} aria-label="Urgent request" /> : null}
            </button>
          );
        })}
      </section>

      <aside className={styles.inbox} aria-live="polite" style={{ "--incident-accent": stationMeta[scenario.station].accent } as React.CSSProperties}>
        <div className={styles.inboxRail}>
          <span>INCIDENT {String(taskIndex + 1).padStart(2, "0")}</span>
          <b className={styles.timerNumber}>{String(secondsLeft).padStart(2, "0")}</b>
          <small>SEC</small>
        </div>
        <div className={styles.inboxBody}>
          <div className={styles.inboxTopline}>
            <span>{stationMeta[scenario.station].code} / PRIORITY ZERO</span>
            <strong>{phase === "resolving" ? "RESOLVING" : urgency.toUpperCase()}</strong>
          </div>
          <div className={styles.timer}><i style={{ transform: `scaleX(${timerScale})` }} /></div>

          {phase === "resolving" && outcome ? (
            <div className={styles.outcome}>
              <p>{outcome.eyebrow}</p>
              <h2>{outcome.headline}</h2>
              <span>{outcome.narrative}</span>
              {outcome.effects ? (
                <div className={styles.impactRow}>
                  {impactEntries(outcome.effects).map(([key, value]) => (
                    <b className={value > 0 ? styles.positive : styles.negative} key={key}>
                      {impactLabel(key)} {value > 0 ? "+" : ""}{value}
                    </b>
                  ))}
                </div>
              ) : null}
              <small>{outcome.degraded ? "Fallback active" : "Live intelligence"} · Next incident incoming</small>
            </div>
          ) : selectedStation === scenario.station ? (
            <div className={styles.task}>
              <p>{scenario.sender}</p>
              <h2>{scenario.title}</h2>
              <span>{scenario.body}</span>
              <div className={styles.choices}>
                {scenario.choices.map((choice, index) => (
                  <button key={choice.label} type="button" onClick={() => void choose(choice)}>
                    <i>{String.fromCharCode(65 + index)}</i>
                    <span><strong>{choice.label}</strong><small>{choice.detail}</small></span>
                    <span className={styles.choiceImpact}>
                      {impactEntries(choice.effects).map(([key, value]) => (
                        <em className={value > 0 ? styles.positive : styles.negative} key={key}>
                          {impactLabel(key)} {value > 0 ? "+" : ""}{value}
                        </em>
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.dispatch}>
              <p>Incoming · {scenario.sender}</p>
              <h2>{scenario.title}</h2>
              <span>Move Agrim to <strong>{stationVisuals[scenario.station].displayName}</strong>. The other two worlds will keep moving.</span>
              <button type="button" onClick={() => chooseStation(scenario.station)}>
                Deploy to station <b aria-hidden="true">→</b>
              </button>
              <small>PRESS {stations.indexOf(scenario.station) + 1} TO DEPLOY</small>
            </div>
          )}
        </div>
      </aside>

      <footer className={styles.gameFooter}>
        <span><i /> GEMMA / LOCAL CHIEF OF STAFF</span>
        <p>1—3 SELECT STATION · A—C MAKE DECISION</p>
        <span>GEMINI / WORLD DIRECTOR <i /></span>
      </footer>
    </main>
  );
}
