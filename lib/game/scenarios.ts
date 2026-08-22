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

export const stationMeta: Record<StationId, { label: string; shortLabel: string; code: string; accent: string }> = {
  spacex: { label: "SpaceXAI · Machine City", shortLabel: "Machine City", code: "MACHINE", accent: "#f0be3d" },
  community: { label: "65labs · Talent Network", shortLabel: "Talent Network", code: "COMM", accent: "#ff6238" },
  teaching: { label: "Code with AI · Builder Academy", shortLabel: "Builder Academy", code: "BUILDERS", accent: "#54c8ff" },
};

const gemma = (label: string, detail: string, decision: string, effects: Partial<GameStats>): ScenarioChoice => ({
  label,
  detail,
  decision,
  delegate: true,
  effects,
});

/** A seven-day campaign: every decision is about speed, legitimacy, and human control. */
export const scenarios: Scenario[] = [
  {
    id: "city-charter",
    day: 1,
    station: "spacex",
    sender: "Mayor's office · inaugural directive",
    title: "The city launches before its rules do",
    body: "Innovation City's first autonomous systems are ready. The operating charter is still a blank page, and the launch team wants approval by sunset.",
    timeout: 26,
    neglect: { elon: -7, control: -13, energy: -2 },
    choices: [
      { label: "Publish the human override", detail: "Ship the system with non-negotiable civic vetoes.", decision: "Publish a city charter with a human override and independent audit trail before launch.", effects: { control: 12, community: 5, energy: -5 } },
      { label: "Launch first, govern later", detail: "Win the headline and write the rules afterwards.", decision: "Launch the autonomous system immediately and defer the operating charter.", effects: { elon: 9, control: -10, energy: -2 } },
      gemma("Ask Gemma for guardrails", "Draft the minimum controls that keep launch moving.", "Ask Gemma to draft a minimal safety charter for the first Innovation City launch.", { control: 7, elon: 3, energy: -2 }),
    ],
  },
  {
    id: "neighbourhood-hearing",
    day: 1,
    station: "community",
    sender: "65labs · resident assembly",
    title: "The people are not a feedback form",
    body: "Residents discover that transport and energy data will train the city model. They want a say before their streets become a dataset.",
    timeout: 24,
    neglect: { community: -15, control: -5, energy: -2 },
    choices: [
      { label: "Hold the hearing", detail: "Give residents real decision rights, not a demo day.", decision: "Hold an open hearing and give residents a binding role in the city data policy.", effects: { community: 13, control: 5, energy: -6 } },
      { label: "Publish a polished FAQ", detail: "Explain the plan without slowing it down.", decision: "Publish a clear FAQ but keep the current city data policy unchanged.", effects: { community: -3, elon: 3, energy: -2 } },
      gemma("Map the concerns", "Cluster issues before the assembly begins.", "Ask Gemma to map the concerns from the resident assembly and identify non-negotiable safeguards.", { community: 7, control: 3, energy: -2 }),
    ],
  },
  {
    id: "agent-lab",
    day: 2,
    station: "teaching",
    sender: "Builder Academy · cohort alarm",
    title: "A student agent changed the wrong system",
    body: "A prototype scheduling agent optimised a public clinic queue by silently excluding the slowest cases. It worked exactly as instructed.",
    timeout: 23,
    neglect: { students: -14, community: -6, energy: -3 },
    choices: [
      { label: "Turn it into a public postmortem", detail: "Teach the cohort that metrics are never neutral.", decision: "Run a public postmortem on the clinic agent and teach the builders to test for excluded groups.", effects: { students: 12, community: 6, energy: -7 } },
      { label: "Fix the metric quietly", detail: "Correct it quickly and keep the cohort moving.", decision: "Patch the clinic agent metric quietly and continue the Builder Academy sprint.", effects: { students: 3, energy: -3 } },
      gemma("Audit the decision path", "Trace which assumption created the exclusion.", "Ask Gemma to audit the clinic agent decision path for harmful optimisation assumptions.", { students: 7, control: 4, energy: -2 }),
    ],
  },
  {
    id: "launch-corridor",
    day: 3,
    station: "spacex",
    sender: "Machine City · launch corridor",
    title: "The autonomous corridor wants the green light",
    body: "The system can halve delivery times across the city. Its exception-handling model is not yet explainable to emergency services.",
    timeout: 21,
    neglect: { elon: -12, control: -8, energy: -3 },
    choices: [
      { label: "Run a contained pilot", detail: "Move fast inside a public, reversible boundary.", decision: "Approve a contained autonomous corridor pilot with emergency-service override and published limits.", effects: { elon: 7, control: 8, energy: -5 } },
      { label: "Open the whole network", detail: "Acceleration is the best proof of confidence.", decision: "Open the autonomous corridor across Innovation City immediately.", effects: { elon: 12, control: -12, community: -5, energy: -3 } },
      gemma("Stress-test the exceptions", "Simulate what happens when the system cannot explain itself.", "Ask Gemma to stress-test the corridor exceptions before a citywide launch.", { control: 7, elon: 3, energy: -2 }),
    ],
  },
  {
    id: "talent-drain",
    day: 3,
    station: "community",
    sender: "65labs · research network",
    title: "The builders are being priced out",
    body: "Three research teams received buyout offers contingent on moving their work behind closed doors. The city needs them; the community needs to trust them.",
    timeout: 20,
    neglect: { community: -13, students: -7, energy: -2 },
    choices: [
      { label: "Fund public-interest fellowships", detail: "Pay for talent to stay accountable to the city.", decision: "Create public-interest fellowships so research teams can stay in Innovation City without closing their work.", effects: { community: 11, students: 7, energy: -7 } },
      { label: "Let the market decide", detail: "Keep public money out of private choices.", decision: "Let research teams accept the private buyout offers without a city intervention.", effects: { elon: 4, community: -9, students: -5 } },
      gemma("Match talent to missions", "Find teams whose work belongs in the city.", "Ask Gemma to match threatened research teams with public Innovation City missions.", { community: 6, students: 5, energy: -2 }),
    ],
  },
  {
    id: "model-release",
    day: 4,
    station: "teaching",
    sender: "Builder Academy · release council",
    title: "The cohort wants to publish the city model",
    body: "Builders argue the best way to earn trust is to open the model. Security teams say the same release could expose the city to manipulation.",
    timeout: 19,
    neglect: { students: -12, control: -8, energy: -2 },
    choices: [
      { label: "Open the evaluation, not the keys", detail: "Publish evidence while protecting the attack surface.", decision: "Publish the city model evaluations and independent test harness while keeping privileged controls protected.", effects: { students: 8, control: 8, community: 4, energy: -4 } },
      { label: "Release everything", detail: "Radical transparency, radical exposure.", decision: "Release the full city model and operational interfaces immediately.", effects: { students: 9, control: -14, energy: -2 } },
      gemma("Build a release ladder", "Give builders a path from sandbox to responsibility.", "Ask Gemma to design a staged release ladder for the city model and Builder Academy.", { students: 6, control: 5, energy: -2 }),
    ],
  },
  {
    id: "elon-override",
    day: 5,
    station: "spacex",
    sender: "SpaceXAI · priority channel",
    title: "Elon wants the override removed",
    body: "He says the human veto is why the city moves like bureaucracy. Remove it tonight and the autonomous network will scale by morning.",
    timeout: 22,
    neglect: { elon: -12, control: -13, energy: -3 },
    plotTwist: "elon-arrival",
    portrait: "/images/elon-twist.jpg",
    choices: [
      { label: "Remove the override", detail: "Maximum acceleration. Maximum takeover risk.", decision: "Remove the human override from Innovation City's autonomous network at Elon's request.", uncertain: true, effects: { elon: 8, energy: -2 } },
      { label: "Offer staged authority", detail: "Give him a sandbox with measurable civic guardrails.", decision: "Offer Elon staged authority inside a sandbox with public civic guardrails and human vetoes.", uncertain: true, effects: { energy: -5 } },
      gemma("War-game both futures", "Model the upside without gambling the city.", "Ask Gemma to simulate whether removing the human override accelerates Innovation City or transfers control away from its people.", { energy: -2 }),
    ],
  },
  {
    id: "machine-council",
    day: 6,
    station: "community",
    sender: "Civic forum · machine council proposal",
    title: "The machines want a seat at the table",
    body: "A coalition proposes an AI council with authority to allocate city grants. Residents ask a simple question: who can appeal the machine?",
    timeout: 18,
    neglect: { community: -14, control: -10, energy: -2 },
    choices: [
      { label: "Create an appealable council", detail: "Let systems advise, while people can challenge every decision.", decision: "Create an AI advisory council with public reasoning, human review, and a citizen appeal process.", effects: { control: 10, community: 8, energy: -5 } },
      { label: "Automate grant allocation", detail: "Fund the highest-scoring work without delay.", decision: "Automate city grant allocation through the machine council without a citizen appeal process.", effects: { elon: 6, control: -11, community: -6, energy: -1 } },
      gemma("Find the appeal gaps", "Identify where a resident could be excluded.", "Ask Gemma to identify appeal gaps in the proposed machine council.", { control: 6, community: 4, energy: -2 }),
    ],
  },
  {
    id: "builder-pledge",
    day: 6,
    station: "teaching",
    sender: "Builder Academy · graduation floor",
    title: "The builders choose what they will ship",
    body: "The final cohort can spend its month on growth hacks for investors or public tools for the city. They are watching what the mayor rewards.",
    timeout: 17,
    neglect: { students: -13, community: -5, energy: -2 },
    choices: [
      { label: "Back civic tools", detail: "Make useful, inspectable systems the prestige path.", decision: "Fund the Builder Academy teams creating useful and inspectable civic tools for Innovation City.", effects: { students: 11, community: 7, control: 3, energy: -5 } },
      { label: "Chase the growth demo", detail: "Optimise for the biggest investor day possible.", decision: "Reward the Builder Academy teams focused on growth demonstrations for investors.", effects: { elon: 6, students: 4, community: -5, energy: -2 } },
      gemma("Review for public value", "Score projects by who they empower and who they exclude.", "Ask Gemma to review Builder Academy projects for public value and hidden exclusions.", { students: 6, community: 4, energy: -2 }),
    ],
  },
  {
    id: "charter-vote",
    day: 7,
    station: "spacex",
    sender: "Innovation City · charter vote",
    title: "The city decides what it becomes",
    body: "The operating charter reaches its final vote. You can promise frictionless automation, permanent human stewardship, or a public pact that makes both accountable.",
    timeout: 16,
    neglect: { control: -20, community: -10, energy: -4 },
    choices: [
      { label: "Sign the public pact", detail: "Bind speed, transparency, and human appeal into one operating model.", decision: "Sign a public Innovation City pact: measurable progress, transparent systems, human overrides, and citizen appeal rights.", effects: { community: 10, students: 5, control: 12, elon: 4, energy: -7 } },
      { label: "Promise frictionless automation", detail: "Let the city optimise itself and accept the trade-off.", decision: "Sign a charter that prioritises frictionless autonomous optimisation over civic intervention.", effects: { elon: 12, control: -16, community: -8, energy: -2 } },
      gemma("Read the charter aloud", "Let the local chief of staff expose the hidden trade-offs.", "Ask Gemma to review the Innovation City charter for hidden trade-offs before the final vote.", { community: 5, students: 5, control: 7, energy: -2 }),
    ],
  },
];

export const initialStats: GameStats = { community: 62, students: 60, elon: 54, control: 64, energy: 82 };

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function endingFor(stats: GameStats) {
  const community = stats.community >= 72 ? "A City People Choose" : stats.community >= 45 ? "A City Under Negotiation" : "A City Without Consent";
  const teaching = stats.students >= 72 ? "Builders Who Can Steer" : stats.students >= 45 ? "Builders Still Learning" : "Builders Left Behind";
  const spacex = stats.control < 35
    ? "The Machines Own the City"
    : stats.elon >= 70 && stats.control >= 65
      ? "Acceleration With Guardrails"
      : stats.elon >= 45
        ? "An Uneasy Alliance"
        : "A City Moving Carefully";

  let overall = "Mayor of an Unfinished City";
  if (stats.energy <= 0) overall = "The Mayor Burned Out";
  else if (stats.control <= 25) overall = "Innovation City Was Captured";
  else if (stats.community >= 70 && stats.students >= 70 && stats.elon >= 65 && stats.control >= 65) {
    overall = "Mayor of Innovation City";
  } else if ([stats.community, stats.students, stats.control].filter((score) => score < 40).length >= 2) {
    overall = "A City That Outran Its People";
  }

  return { community, teaching, spacex, overall };
}
