"use client";

import { useEffect, useRef, useState } from "react";
import { requestGemma, type GemmaTriageResponse } from "@/lib/client/ai";
import styles from "./game.module.css";

type BusinessId = "machine" | "community" | "academy";

interface CityState {
  funds: number;
  residents: number;
  food: number;
  materials: number;
  power: number;
  trust: number;
  innovation: number;
  wellbeing: number;
}

interface Business {
  id: BusinessId;
  index: string;
  title: string;
  sector: string;
  location: string;
  action: string;
  summary: string;
  effects: Partial<CityState>;
  status: string;
  artwork: string;
}

interface Project {
  id: string;
  name: string;
  cost: number;
  materialCost: number;
  detail: string;
  effects: Partial<CityState>;
}

interface Incident {
  title: string;
  eyebrow: string;
  detail: string;
  choices: Array<{ label: string; detail: string; effects: Partial<CityState> }>;
}

interface LogEntry {
  id: number;
  day: number;
  text: string;
}

const businesses: Business[] = [
  {
    id: "machine",
    index: "01",
    title: "Machine City",
    sector: "Robotics & resources",
    location: "Frontier operations",
    action: "Deploy harvest crew",
    summary: "Route autonomous crews through the agricultural belt before the next city cycle.",
    effects: { food: 16, materials: 7, power: -5, innovation: 2 },
    status: "6 field units ready",
    artwork: "/images/field-manual-machines.jpg",
  },
  {
    id: "community",
    index: "02",
    title: "65labs",
    sector: "Community & talent",
    location: "Civic market quarter",
    action: "Host a resident assembly",
    summary: "Put people, operators, and researchers in the same room before a city decision hardens.",
    effects: { trust: 9, wellbeing: 5, funds: -9 },
    status: "Assembly hall open",
    artwork: "/images/field-manual-recruit.jpg",
  },
  {
    id: "academy",
    index: "03",
    title: "Builder Academy",
    sector: "Applied AI & learning",
    location: "Learning campus",
    action: "Run a civic builder sprint",
    summary: "Give builder teams one real city constraint and ship the useful version with oversight.",
    effects: { innovation: 10, trust: 3, funds: -8, power: -2 },
    status: "Cohort awaiting brief",
    artwork: "/images/field-manual-hitl.jpg",
  },
];

const projects: Project[] = [
  { id: "water", name: "Water reclamation loop", cost: 18, materialCost: 6, detail: "Stabilises harvests during dry cycles.", effects: { food: 8, trust: 3, wellbeing: 2 } },
  { id: "transit", name: "Electric tram link", cost: 24, materialCost: 9, detail: "Connects the campus, market and city centre.", effects: { residents: 60, wellbeing: 5, power: -3 } },
  { id: "commons", name: "Public model commons", cost: 20, materialCost: 4, detail: "A place to inspect and appeal civic systems.", effects: { trust: 9, innovation: 4 } },
];

const incidents: Incident[] = [
  {
    eyebrow: "Frontier signal · water stress",
    title: "The harvest forecast is turning dry.",
    detail: "Field robots can protect output, but they will draw down city power. The other option keeps reserves stable and accepts a leaner harvest.",
    choices: [
      { label: "Protect the harvest", detail: "Prioritise irrigation and robot hours.", effects: { food: 14, power: -7, wellbeing: -2 } },
      { label: "Hold city reserves", detail: "Preserve power for homes and transit.", effects: { trust: 4, power: 3, food: -7 } },
    ],
  },
  {
    eyebrow: "Civic signal · public review",
    title: "Residents want to inspect the transit algorithm.",
    detail: "The model can reduce congestion today. The city needs to decide whether an appeal route is part of launch day.",
    choices: [
      { label: "Open public review", detail: "Launch with an appeal path and clear explanation.", effects: { trust: 10, innovation: 3, funds: -7 } },
      { label: "Ship the fast version", detail: "Optimise the rollout while feedback follows.", effects: { innovation: 8, wellbeing: 2, trust: -7 } },
    ],
  },
  {
    eyebrow: "Builder signal · next challenge",
    title: "The academy is choosing its next city brief.",
    detail: "Teams can build a headline demo for investors or tools for the heat-stressed neighbourhoods.",
    choices: [
      { label: "Fund neighbourhood tools", detail: "Put the next cohort on a practical civic problem.", effects: { innovation: 7, trust: 7, wellbeing: 3 } },
      { label: "Back the growth demo", detail: "Use the cohort to attract more city capital.", effects: { funds: 12, innovation: 5, trust: -4 } },
    ],
  },
];

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function applyState(current: CityState, effects: Partial<CityState>): CityState {
  return {
    funds: Math.max(0, current.funds + (effects.funds ?? 0)),
    residents: Math.max(0, current.residents + (effects.residents ?? 0)),
    food: Math.max(0, current.food + (effects.food ?? 0)),
    materials: Math.max(0, current.materials + (effects.materials ?? 0)),
    power: clamp(current.power + (effects.power ?? 0)),
    trust: clamp(current.trust + (effects.trust ?? 0)),
    innovation: clamp(current.innovation + (effects.innovation ?? 0)),
    wellbeing: clamp(current.wellbeing + (effects.wellbeing ?? 0)),
  };
}

function effectLabel(effects: Partial<CityState>) {
  return Object.entries(effects)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key} ${Number(value) > 0 ? "+" : ""}${value}`)
    .join(" · ");
}

function effectChips(effects: Partial<CityState>) {
  return Object.entries(effects).filter(([, value]) => value) as Array<[string, number]>;
}

const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 26;

export function GameExperience({ onExit }: { onExit?: () => void }) {
  const [city, setCity] = useState<CityState>({ funds: 178, residents: 680, food: 62, materials: 44, power: 78, trust: 58, innovation: 47, wellbeing: 64 });
  const [day, setDay] = useState(1);
  const [activeId, setActiveId] = useState<BusinessId>("machine");
  const [completed, setCompleted] = useState<BusinessId[]>([]);
  const [built, setBuilt] = useState<string[]>([]);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [log, setLog] = useState<LogEntry[]>([{ id: 0, day: 1, text: "Dawn over Innovation City. The frontier crews are online and the city is ready for a mayoral brief." }]);
  const [pulses, setPulses] = useState<Partial<CityState>>({});
  const [cycleFlash, setCycleFlash] = useState<string | null>(null);
  const [advisor, setAdvisor] = useState<{ title: string; detail: string; degraded?: boolean } | null>(null);
  const [advising, setAdvising] = useState(false);

  const logId = useRef(1);
  const pulseTimer = useRef<number | undefined>(undefined);
  const flashTimer = useRef<number | undefined>(undefined);
  const incidentTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    window.clearTimeout(pulseTimer.current);
    window.clearTimeout(flashTimer.current);
    window.clearTimeout(incidentTimer.current);
  }, []);

  const active = businesses.find((business) => business.id === activeId)!;
  const cityHealth = Math.round((city.power + city.trust + city.innovation + city.wellbeing) / 4);

  const pushLog = (text: string, onDay = day) => {
    setLog((current) => [{ id: logId.current++, day: onDay, text }, ...current].slice(0, 4));
  };

  const commit = (effects: Partial<CityState>) => {
    setCity((current) => applyState(current, effects));
    setPulses(effects);
    window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => setPulses({}), 2400);
  };

  const operate = () => {
    if (completed.includes(active.id)) {
      pushLog(`${active.title} has already acted this cycle. Close the day to refresh its team.`);
      return;
    }
    commit(active.effects);
    setCompleted((current) => [...current, active.id]);
    pushLog(`${active.action} complete — ${effectLabel(active.effects)}.`);
  };

  const buildProject = (project: Project) => {
    if (built.includes(project.id)) {
      pushLog(`${project.name} is already part of the city.`);
      return;
    }
    if (city.funds < project.cost || city.materials < project.materialCost) {
      pushLog("The city needs more funds or materials. Send the Machine City crews out first.");
      return;
    }
    commit({ funds: -project.cost, materials: -project.materialCost, ...project.effects });
    setBuilt((current) => [...current, project.id]);
    pushLog(`${project.name} commissioned — ${effectLabel(project.effects)}.`);
  };

  const endDay = () => {
    if (incident || cycleFlash) return;
    const upkeep = 5 + built.length * 2;
    const foodUse = Math.max(3, Math.ceil(city.residents / 190));
    commit({ funds: 8 - upkeep, food: -foodUse, wellbeing: city.food > foodUse ? 1 : -7 });
    setCompleted([]);
    const nextDay = day + 1;
    setDay(nextDay);
    pushLog(`City cycle ${day} closed. Services were funded and ${foodUse} food was consumed.`, nextDay);

    setCycleFlash(`Day ${String(nextDay).padStart(2, "0")}`);
    flashTimer.current = window.setTimeout(() => setCycleFlash(null), 1700);
    incidentTimer.current = window.setTimeout(() => setIncident(incidents[(day - 1) % incidents.length]), 1250);
  };

  const resolveIncident = (choice: Incident["choices"][number]) => {
    commit(choice.effects);
    pushLog(`${choice.label} — ${effectLabel(choice.effects)}.`);
    setIncident(null);
  };

  const askGemma = async () => {
    setAdvising(true);
    try {
      const data = await requestGemma<GemmaTriageResponse>({
        role: "community",
        message: `Innovation City status: ${JSON.stringify(city)}. ${active.title} is active. Identify the most important trade-off the mayor should review next.`,
        context: { day, builtProjects: built, completedOperations: completed },
      });
      setAdvisor({
        title: data.result?.recommendedAction?.replaceAll("_", " ") ?? "Review city services",
        detail: data.result?.reason ?? "Review the active district before committing city resources.",
        degraded: data.degraded,
      });
    } catch {
      setAdvisor({ title: "Local advisor unavailable", detail: "Gemma could not be reached. You still retain full control of every city decision.", degraded: true });
    } finally {
      setAdvising(false);
    }
  };

  const metricCells: Array<{ key: keyof CityState; label: string; value: string }> = [
    { key: "funds", label: "Funds", value: `$${city.funds}m` },
    { key: "residents", label: "Residents", value: city.residents.toLocaleString() },
    { key: "food", label: "Food", value: String(city.food) },
    { key: "materials", label: "Materials", value: String(city.materials) },
    { key: "power", label: "Power", value: `${city.power}%` },
    { key: "trust", label: "Trust", value: `${city.trust}%` },
  ];

  return <main className={styles.game}>
    <div className={styles.worldArt} aria-hidden="true" />
    <div className={styles.skyGlow} aria-hidden="true" />
    <div className={styles.atmosphere} aria-hidden="true" />
    <div className={styles.vignette} aria-hidden="true" />

    <header className={styles.hud}>
      <div className={styles.brand}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/agrim-tech-overlord-logo.png" alt="" />
        <div><span>Agrim Tycoon</span><strong>Innovation City</strong></div>
      </div>
      <div className={styles.cycle}><span>City cycle</span><strong>Day {String(day).padStart(2, "0")}</strong></div>
      <div className={styles.metrics}>
        {metricCells.map((cell) => {
          const delta = pulses[cell.key] ?? 0;
          return <div key={cell.key}>
            <span>{cell.label}</span>
            <strong>{cell.value}</strong>
            {delta ? <em key={`${cell.key}-${day}-${delta}`} className={`${styles.delta} ${delta > 0 ? styles.deltaUp : styles.deltaDown}`}>{delta > 0 ? "+" : ""}{delta}</em> : null}
          </div>;
        })}
      </div>
      <button className={styles.exit} type="button" onClick={() => onExit ? onExit() : window.location.reload()}>Exit</button>
    </header>

    <section className={styles.worldCopy} aria-label="City overview">
      <span className={styles.liveTag}><i />Live city · Autonomous frontier</span>
      <h1>Run the city.<br />Keep it human.</h1>
      <p>Robot crews bring in the essentials. Your three businesses decide what the city becomes.</p>

      <div className={styles.healthDock}>
        <div className={styles.gauge} role="img" aria-label={`City health ${cityHealth} percent`}>
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle className={styles.gaugeTrack} cx="32" cy="32" r="26" />
            <circle
              className={styles.gaugeFill}
              cx="32" cy="32" r="26"
              strokeDasharray={GAUGE_CIRCUMFERENCE}
              strokeDashoffset={GAUGE_CIRCUMFERENCE * (1 - cityHealth / 100)}
            />
          </svg>
          <strong>{cityHealth}<small>%</small></strong>
        </div>
        <div className={styles.healthMeta}>
          <span>City health</span>
          <div className={styles.microStats}>
            <em>Innovation {city.innovation}%</em>
            <em>Wellbeing {city.wellbeing}%</em>
          </div>
        </div>
      </div>
    </section>

    <div className={styles.hotspots} aria-label="City districts">
      {businesses.map((business) => {
        const done = completed.includes(business.id);
        return <button
          key={business.id}
          type="button"
          className={`${styles.hotspot} ${styles[`hotspot${business.id[0].toUpperCase()}${business.id.slice(1)}`]} ${activeId === business.id ? styles.hotspotActive : ""} ${done ? styles.hotspotDone : ""}`}
          onClick={() => setActiveId(business.id)}
        >
          <i className={styles.beacon} aria-hidden="true" />
          <span>{business.index}</span>
          <strong>{business.title}</strong>
          <small>{done ? "Operation complete" : business.location}</small>
        </button>;
      })}
    </div>

    <aside className={styles.commandPanel} aria-live="polite">
      <div className={styles.panelArt} key={active.id}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={active.artwork} alt="" />
        <span className={styles.panelArtIndex}>{active.index}</span>
        <em className={completed.includes(active.id) ? styles.panelArtDone : ""}>{completed.includes(active.id) ? "Complete" : "Ready"}</em>
      </div>

      <div className={styles.panelBody}>
        <span className={styles.panelSector}>{active.sector} · {active.location}</span>
        <h2>{active.title}</h2>
        <p>{active.summary}</p>

        <div className={styles.effectChips}>
          {effectChips(active.effects).map(([key, value]) => <span key={key} className={value > 0 ? styles.chipUp : styles.chipDown}>
            {key} {value > 0 ? "+" : ""}{value}
          </span>)}
        </div>

        <div className={styles.statusRow}><i /><span>{active.status}</span></div>

        <button className={styles.primaryAction} type="button" onClick={operate} disabled={completed.includes(active.id)}>
          <span>{completed.includes(active.id) ? "Operation complete" : active.action}</span>
          <span aria-hidden="true">→</span>
        </button>

        <span className={styles.projectLabel}>City projects · {built.length}/3 built</span>
        <div className={styles.projects}>
          {projects.map((project) => {
            const done = built.includes(project.id);
            return <button key={project.id} type="button" className={done ? styles.projectComplete : ""} onClick={() => buildProject(project)}>
              <span className={styles.projectMark}>{done ? "✓" : "+"}</span>
              <div><strong>{project.name}</strong><small>{project.detail}</small></div>
              <em>{done ? "Built" : `$${project.cost}m`}</em>
            </button>;
          })}
        </div>

        <button className={styles.endDay} type="button" onClick={endDay} disabled={Boolean(incident) || Boolean(cycleFlash)}>
          <span>End city cycle</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>

    <section className={styles.mayorLog} aria-live="polite">
      <div className={styles.logHead}>
        <span>Mayor’s log</span>
        <button type="button" onClick={() => void askGemma()} disabled={advising}>
          <i className={advising ? styles.thinking : ""} aria-hidden="true" />
          {advising ? "Gemma is reviewing…" : "Ask Gemma"}
        </button>
      </div>
      <div className={styles.logFeed}>
        {log.map((entry, position) => <p key={entry.id} className={position === 0 ? styles.logLatest : ""}>
          <em>D{String(entry.day).padStart(2, "0")}</em>{entry.text}
        </p>)}
      </div>
      {advisor ? <article className={styles.advisor}>
        <span className={advisor.degraded ? styles.advisorDegraded : ""}>{advisor.degraded ? "Advisor fallback · no local model" : "Gemma · local chief of staff"}</span>
        <strong>{advisor.title}</strong>
        <p>{advisor.detail}</p>
      </article> : null}
    </section>

    <div className={styles.resourceTicker} aria-hidden="true">
      <span>◉ harvesters {completed.includes("machine") ? "returning" : "active"}</span>
      <span>◆ haulers online</span>
      <span>✦ city projects {built.length}/3</span>
      <span>▲ cycle {String(day).padStart(2, "0")}</span>
    </div>

    {cycleFlash ? <div className={styles.cycleFlash} aria-hidden="true">
      <div className={styles.cycleFlashInner}>
        <span>Innovation City</span>
        <strong>{cycleFlash}</strong>
        <em>New signals incoming</em>
      </div>
    </div> : null}

    {incident ? <div className={styles.incidentOverlay}>
      <i className={styles.barTop} aria-hidden="true" />
      <i className={styles.barBottom} aria-hidden="true" />
      <section className={styles.incident} role="dialog" aria-modal="true" aria-labelledby="incident-title">
        <span className={styles.incidentEyebrow}><i />{incident.eyebrow}</span>
        <h2 id="incident-title">{incident.title}</h2>
        <p>{incident.detail}</p>
        <div className={styles.incidentChoices}>
          {incident.choices.map((choice, index) => <button key={choice.label} type="button" onClick={() => resolveIncident(choice)}>
            <span className={styles.choiceKey}>{index === 0 ? "A" : "B"}</span>
            <strong>{choice.label}</strong>
            <span className={styles.choiceDetail}>{choice.detail}</span>
            <em>{effectLabel(choice.effects)}</em>
          </button>)}
        </div>
        <p className={styles.incidentHint}>Every signal shifts the city. Choose as the mayor.</p>
      </section>
    </div> : null}
  </main>;
}
