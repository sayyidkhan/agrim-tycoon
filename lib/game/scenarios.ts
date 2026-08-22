export type StationId = "community" | "teaching" | "spacex";

export interface GameStats {
  community: number;
  students: number;
  elon: number;
  control: number;
  energy: number;
}

export interface ScenarioChoice {
  label: string;
  detail: string;
  decision: string;
  delegate?: boolean;
  uncertain?: boolean;
  effects: Partial<GameStats>;
}

export interface Scenario {
  id: string;
  day: number;
  station: StationId;
  sender: string;
  title: string;
  body: string;
  timeout: number;
  neglect: Partial<GameStats>;
  plotTwist?: "elon-arrival";
  portrait?: string;
  choices: [ScenarioChoice, ScenarioChoice, ScenarioChoice];
}

export const stationMeta: Record<
  StationId,
  { label: string; shortLabel: string; code: string; accent: string }
> = {
  community: {
    label: "65labs Community",
    shortLabel: "65labs",
    code: "COMM",
    accent: "#ef5b32",
  },
  teaching: {
    label: "Code with AI",
    shortLabel: "Classroom",
    code: "TEACH",
    accent: "#76a8ff",
  },
  spacex: {
    label: "SpaceXAI",
    shortLabel: "Mission",
    code: "SHIP",
    accent: "#b8ef63",
  },
};

export const scenarios: Scenario[] = [
  {
    id: "token-maxxing",
    day: 1,
    station: "community",
    sender: "#general · @moonbuilder",
    title: "Token maxxing has entered the chat",
    body: "‘Guaranteed 100x. DM me your wallet and seed phrase.’ Twelve members are already typing.",
    timeout: 24,
    neglect: { community: -14, energy: -3 },
    choices: [
      {
        label: "Ban and explain",
        detail: "Remove the threat and publish a short safety note.",
        decision: "Ban the scammer and explain the community safety rule.",
        effects: { community: 9, energy: -5 },
      },
      {
        label: "Ask for evidence",
        detail: "Give them one chance to prove the claim.",
        decision: "Request evidence before taking moderation action.",
        effects: { community: -3, energy: -2 },
      },
      {
        label: "Delegate to Gemma",
        detail: "Let the local moderation agent classify it.",
        decision: "Delegate the suspicious token promotion to Gemma.",
        delegate: true,
        effects: { community: 5, energy: -1 },
      },
    ],
  },
  {
    id: "api-key",
    day: 1,
    station: "teaching",
    sender: "Cohort 08 · Live demo",
    title: "A student shipped their API key",
    body: "The app works beautifully. The production key is also visible beautifully—in the browser console.",
    timeout: 22,
    neglect: { students: -15, energy: -2 },
    choices: [
      {
        label: "Stop the demo",
        detail: "Rotate the key and turn the failure into a lesson.",
        decision: "Stop the demo, rotate the key, and teach secret handling.",
        effects: { students: 10, energy: -6 },
      },
      {
        label: "Patch it quietly",
        detail: "Fix it while the class keeps moving.",
        decision: "Quietly patch the exposed API key during class.",
        effects: { students: 3, energy: -4 },
      },
      {
        label: "Ask Gemma to triage",
        detail: "Get a remediation checklist immediately.",
        decision: "Delegate the exposed API key incident to Gemma for triage.",
        delegate: true,
        effects: { students: 6, energy: -2 },
      },
    ],
  },
  {
    id: "elon-arrives",
    day: 2,
    station: "spacex",
    sender: "SpaceXAI · Unscheduled arrival",
    title: "Elon has entered the city",
    body: "He could accelerate Innovation City by a decade—or quietly redesign it around himself before sunrise. Gemma sees both futures.",
    timeout: 24,
    neglect: { elon: -14, community: -5, energy: -3 },
    plotTwist: "elon-arrival",
    portrait: "/images/elon-twist.jpg",
    choices: [
      {
        label: "Hand him the controls",
        detail: "Maximum acceleration. Maximum takeover risk.",
        decision: "Give Elon immediate control of SpaceXAI's city systems and ask him to accelerate the roadmap.",
        uncertain: true,
        effects: { energy: -3 },
      },
      {
        label: "Make him earn access",
        detail: "Use a sandbox, civic guardrails, and staged authority.",
        decision: "Give Elon a sandboxed SpaceXAI mandate with public guardrails and staged access to city systems.",
        uncertain: true,
        effects: { energy: -5 },
      },
      {
        label: "Ask Gemma to war-game him",
        detail: "Simulate both futures before opening the gates.",
        decision: "Ask Gemma to simulate whether Elon's arrival improves Innovation City or gives him control of it.",
        delegate: true,
        uncertain: true,
        effects: { energy: -2 },
      },
    ],
  },
  {
    id: "self-promo",
    day: 2,
    station: "community",
    sender: "#showcase · 17 new posts",
    title: "Everyone launched the same wrapper",
    body: "Seventeen founders copied one README and each claims to have reinvented agentic AI.",
    timeout: 20,
    neglect: { community: -10 },
    choices: [
      {
        label: "Create Demo Friday",
        detail: "Require evidence, users, and one hard lesson.",
        decision: "Create a structured Demo Friday for self-promotion.",
        effects: { community: 10, energy: -5 },
      },
      {
        label: "Delete all seventeen",
        detail: "Restore signal through decisive force.",
        decision: "Delete every duplicate self-promotional post.",
        effects: { community: -5, energy: -2 },
      },
      {
        label: "Gemma sorts the queue",
        detail: "Keep only posts with credible proof of work.",
        decision: "Delegate seventeen showcase posts to Gemma for evidence scoring.",
        delegate: true,
        effects: { community: 6, energy: -1 },
      },
    ],
  },
  {
    id: "vibe-bug",
    day: 3,
    station: "teaching",
    sender: "Office hours · @shipfast",
    title: "The vibe-coded app deleted production",
    body: "The student says the database was ‘acting negative’ and asks if more prompting will bring it back.",
    timeout: 19,
    neglect: { students: -13, energy: -3 },
    choices: [
      {
        label: "Run the incident",
        detail: "Recover data, write a postmortem, teach backups.",
        decision: "Lead a production incident review and teach recovery.",
        effects: { students: 12, energy: -8 },
      },
      {
        label: "Send the backup guide",
        detail: "Give them the playbook and keep moving.",
        decision: "Send a database recovery guide and let the student lead.",
        effects: { students: 4, energy: -2 },
      },
      {
        label: "Gemma triages damage",
        detail: "Classify urgency before spending the afternoon.",
        decision: "Delegate the production data incident to Gemma for urgency triage.",
        delegate: true,
        effects: { students: 5, energy: -2 },
      },
    ],
  },
  {
    id: "rocket-latency",
    day: 3,
    station: "spacex",
    sender: "Flight systems · P0",
    title: "The model is correct—four minutes late",
    body: "Anomaly detection accuracy reached 99%. Unfortunately, the rocket has already landed by inference time.",
    timeout: 18,
    neglect: { elon: -14, energy: -2 },
    choices: [
      {
        label: "Cut the architecture",
        detail: "Trade a little accuracy for real-time decisions.",
        decision: "Simplify the model to meet the latency budget.",
        effects: { elon: 11, energy: -7 },
      },
      {
        label: "Rename it batch AI",
        detail: "A positioning solution to an engineering problem.",
        decision: "Reframe the slow system as post-flight batch intelligence.",
        effects: { elon: -4, energy: 1 },
      },
      {
        label: "Gemma ranks bottlenecks",
        detail: "Delegate log analysis before rewriting anything.",
        decision: "Ask Gemma to prioritise the inference bottlenecks.",
        delegate: true,
        effects: { elon: 5, energy: -2 },
      },
    ],
  },
  {
    id: "meetup-fire",
    day: 4,
    station: "community",
    sender: "Meetup ops · 327 attendees",
    title: "The venue cancelled",
    body: "Doors open in four hours. The replacement venue has twelve chairs and a suspicious karaoke machine.",
    timeout: 17,
    neglect: { community: -15, energy: -4 },
    choices: [
      {
        label: "Turn it into unconference",
        detail: "Use the chaos as the format.",
        decision: "Convert the cancelled meetup into a distributed unconference.",
        effects: { community: 12, energy: -8 },
      },
      {
        label: "Move online",
        detail: "Stable, sensible, slightly less legendary.",
        decision: "Move the 65labs meetup online at short notice.",
        effects: { community: 5, energy: -3 },
      },
      {
        label: "Gemma handles questions",
        detail: "Automate attendee support while finding a room.",
        decision: "Delegate meetup attendee triage to Gemma.",
        delegate: true,
        effects: { community: 7, energy: -2 },
      },
    ],
  },
  {
    id: "student-launch",
    day: 5,
    station: "teaching",
    sender: "Graduation day · 48 projects",
    title: "Everyone wants launch feedback",
    body: "Forty-eight demos, ninety minutes, and one student has built a dating app for autonomous agents.",
    timeout: 16,
    neglect: { students: -12, energy: -3 },
    choices: [
      {
        label: "Rapid-fire reviews",
        detail: "Ninety seconds of brutal clarity per team.",
        decision: "Run rapid-fire launch reviews for every student team.",
        effects: { students: 10, energy: -9 },
      },
      {
        label: "Peer review circles",
        detail: "Teach the cohort to critique each other.",
        decision: "Organise peer review circles for the student launches.",
        effects: { students: 8, energy: -4 },
      },
      {
        label: "Gemma pre-screens demos",
        detail: "Surface security and reliability risks first.",
        decision: "Delegate student demo risk screening to Gemma.",
        delegate: true,
        effects: { students: 6, energy: -2 },
      },
    ],
  },
  {
    id: "elon-call",
    day: 5,
    station: "spacex",
    sender: "Incoming call · E",
    title: "Explain it in ten words",
    body: "The entire architecture review has been compressed into one sentence and six seconds of silence.",
    timeout: 15,
    neglect: { elon: -15 },
    choices: [
      {
        label: "AI that spots risk early",
        detail: "Simple enough to survive the room.",
        decision: "Describe SpaceXAI as AI that spots flight risk early.",
        effects: { elon: 12, energy: -4 },
      },
      {
        label: "Show the architecture",
        detail: "Words failed. Diagrams may also fail.",
        decision: "Respond with the complete SpaceXAI architecture diagram.",
        effects: { elon: -5, energy: -3 },
      },
      {
        label: "Gemma writes ten words",
        detail: "Delegate executive compression to the local model.",
        decision: "Ask Gemma to compress the product into ten words.",
        delegate: true,
        effects: { elon: 4, energy: -1 },
      },
    ],
  },
  {
    id: "community-war",
    day: 6,
    station: "community",
    sender: "#general · 184 replies",
    title: "Tabs versus spaces became personal",
    body: "Two respected members are now debating moral character, ancestry, and formatter configuration.",
    timeout: 14,
    neglect: { community: -13 },
    choices: [
      {
        label: "Lock and mediate",
        detail: "Reset the norm without humiliating anyone.",
        decision: "Lock the thread and privately mediate the conflict.",
        effects: { community: 10, energy: -6 },
      },
      {
        label: "Post the formatter config",
        detail: "Resolve ideology with automation.",
        decision: "Mandate one formatter configuration for the community.",
        effects: { community: 4, energy: -2 },
      },
      {
        label: "Gemma measures toxicity",
        detail: "Find the escalation point before intervening.",
        decision: "Delegate the heated community thread to Gemma.",
        delegate: true,
        effects: { community: 5, energy: -1 },
      },
    ],
  },
  {
    id: "final-build",
    day: 7,
    station: "spacex",
    sender: "Launch review · T−45",
    title: "The final build is red",
    body: "One test fails intermittently. Nobody can reproduce it twice. The review begins in forty-five minutes.",
    timeout: 13,
    neglect: { elon: -20, energy: -5 },
    choices: [
      {
        label: "Trace it properly",
        detail: "Spend the remaining energy on evidence.",
        decision: "Trace the intermittent final-build failure properly.",
        effects: { elon: 14, energy: -10 },
      },
      {
        label: "Quarantine the test",
        detail: "Ship now and own the follow-up.",
        decision: "Quarantine the flaky test and document the risk.",
        effects: { elon: 6, energy: -4 },
      },
      {
        label: "Gemma reads the failure",
        detail: "Use the final delegation on root-cause triage.",
        decision: "Delegate the intermittent build failure to Gemma.",
        delegate: true,
        effects: { elon: 7, energy: -2 },
      },
    ],
  },
];

export const initialStats: GameStats = {
  community: 68,
  students: 66,
  elon: 52,
  control: 68,
  energy: 86,
};

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function endingFor(stats: GameStats) {
  const community =
    stats.community >= 70 ? "Community Legend" : stats.community >= 40 ? "Busy Moderator" : "Discord Tyrant";
  const teaching =
    stats.students >= 70 ? "Great Sage" : stats.students >= 40 ? "Helpful Tutor" : "Vibe Coding Fraud";
  const spacex = stats.control < 35
    ? "The Machines Own the City"
    : stats.elon >= 70 && stats.control >= 65
      ? "Tamed the Machines"
      : stats.elon >= 40
        ? "An Uneasy Alliance"
        : "Locked Out of SpaceXAI";

  let overall = "The Three-Job Survivor";
  if (stats.control <= 25) overall = "Owned by AI";
  else if (stats.energy <= 0) overall = "Burnout% Speedrun";
  else if (stats.community >= 70 && stats.students >= 70 && stats.elon >= 70 && stats.control >= 65) {
    overall = "Mayor of Innovation City";
  }
  else if ([stats.community, stats.students, stats.elon].filter((score) => score < 40).length >= 2) {
    overall = "Task Failed Successfully";
  }

  return { community, teaching, spacex, overall };
}
