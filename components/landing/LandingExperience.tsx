"use client";

import { useCallback, useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import styles from "./landing.module.css";

type SummaryPhase = "typing" | "holding" | "deleting" | "waiting";

type SharedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
};

function Image({ fill, style, ...props }: SharedImageProps) {
  const { priority, unoptimized, ...imageProps } = props;
  void priority;
  void unoptimized;

  return (
    // The desktop bundle uses this same component without Next's image runtime.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...imageProps}
      alt={imageProps.alt ?? ""}
      style={
        fill
          ? { inset: 0, width: "100%", height: "100%", position: "absolute", ...style }
          : style
      }
    />
  );
}

const DEFAULT_MAC_DOWNLOAD_URL =
  "https://github.com/sayyidkhan/agrim-tycoon/releases";
const MAC_DOWNLOAD_URL =
  typeof process === "undefined"
    ? DEFAULT_MAC_DOWNLOAD_URL
    : process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL || DEFAULT_MAC_DOWNLOAD_URL;

const SUMMARY =
  "Protect the community. Teach the builders. Ship something brilliant before Elon asks twice.";

const STORY_CHAPTERS = [
  {
    image: "/images/agrim-origin-comic.png",
    panel: 0,
    panels: 4,
    cue: "The first build",
    eyebrow: "2013 · Before the titles",
    title: "There was only the build.",
    copy: "No company. No community. No safety net. Just a student chasing one dangerous question: could he turn an impossible idea into something real before the clock hit zero?",
  },
  {
    image: "/images/agrim-origin-comic.png",
    panel: 1,
    panels: 4,
    cue: "Prototype storm",
    eyebrow: "2014—15 · The obsession begins",
    title: "One breakthrough was never enough.",
    copy: "Predict dengue. Make rubbish sort itself. Bend reality with cardboard and code. Every finished prototype exposed a harder problem—and Agrim kept choosing the harder problem.",
  },
  {
    image: "/images/agrim-origin-comic.png",
    panel: 2,
    panels: 4,
    cue: "The breakthrough",
    eyebrow: "2016 · Project Deep Question",
    title: "Then the machine learned empathy.",
    copy: "Project Deep Question adjusted each lesson from a student's answers, then used emotion recognition to offer support when she became frustrated. Built to help more girls access STEM education, it won AngelHack Singapore and Project Inspire.",
  },
  {
    image: "/images/agrim-origin-comic.png",
    panel: 3,
    panels: 4,
    cue: "Level up",
    eyebrow: "The level-up",
    title: "The hacker became an operator.",
    copy: "Projects became products. Teams became communities. Shipping was no longer enough. Now he had to help other people ship.",
  },
  {
    image: "/images/agrim-backstory-comic.png",
    panel: 0,
    panels: 1,
    cue: "Three worlds collide",
    eyebrow: "Today · Three worlds collide",
    title: "Now he does all three. At once.",
    copy: "Protect the 65labs community. Turn beginners into builders at Code with AI. Ship ambitious aerospace systems before the clock runs out. Different worlds, same rule: make it useful and make it real.",
  },
] as const;

export function LandingExperience({ onPlay }: { onPlay?: () => void }) {
  const [showGuide, setShowGuide] = useState(false);
  const [showBackstory, setShowBackstory] = useState(false);
  const [showElonPlotTwist, setShowElonPlotTwist] = useState(false);
  const [storyChapter, setStoryChapter] = useState(0);
  const [summaryLength, setSummaryLength] = useState(0);
  const [summaryPhase, setSummaryPhase] = useState<SummaryPhase>("typing");
  const [reduceMotion, setReduceMotion] = useState(false);
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const howToButtonRef = useRef<HTMLButtonElement>(null);
  const backstoryModalRef = useRef<HTMLElement>(null);
  const backstoryCloseButtonRef = useRef<HTMLButtonElement>(null);
  const backstoryButtonRef = useRef<HTMLButtonElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const downloadButtonRef = useRef<HTMLAnchorElement>(null);

  const closeGuide = useCallback(() => {
    setShowElonPlotTwist(false);
    setShowGuide(false);
    window.requestAnimationFrame(() => howToButtonRef.current?.focus());
  }, []);

  const closeBackstory = useCallback(() => {
    setShowBackstory(false);
    window.requestAnimationFrame(() => backstoryButtonRef.current?.focus());
  }, []);

  const openBackstory = useCallback(() => {
    setStoryChapter(0);
    setShowBackstory(true);
  }, []);

  const showPreviousChapter = useCallback(() => {
    setStoryChapter((chapter) => Math.max(0, chapter - 1));
  }, []);

  const showNextChapter = useCallback(() => {
    setStoryChapter((chapter) =>
      Math.min(STORY_CHAPTERS.length - 1, chapter + 1),
    );
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (showGuide || showBackstory) {
        if (event.key === "Escape") {
          event.preventDefault();
          if (showBackstory) closeBackstory();
          else closeGuide();
        }

        if (event.key === "Tab") {
          const activeModal = showBackstory
            ? backstoryModalRef.current
            : modalRef.current;
          const focusable = activeModal?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          );
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }

        if (showBackstory && event.key === "ArrowLeft") {
          event.preventDefault();
          showPreviousChapter();
        }

        if (showBackstory && event.key === "ArrowRight") {
          event.preventDefault();
          showNextChapter();
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select")) return;

      if (event.key === "Enter") {
        event.preventDefault();
        if (onPlay) playButtonRef.current?.click();
        else downloadButtonRef.current?.click();
      }

      if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        setShowGuide(true);
      }

      if (event.key.toLowerCase() === "a") {
        event.preventDefault();
        openBackstory();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    closeBackstory,
    closeGuide,
    onPlay,
    openBackstory,
    showBackstory,
    showGuide,
    showNextChapter,
    showPreviousChapter,
  ]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (showGuide) {
        if (modalRef.current) modalRef.current.scrollTop = 0;
        closeButtonRef.current?.focus({ preventScroll: true });
      }

      if (showBackstory) {
        if (backstoryModalRef.current) backstoryModalRef.current.scrollTop = 0;
        backstoryCloseButtonRef.current?.focus({ preventScroll: true });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [showBackstory, showGuide]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    let timer: number | undefined;

    if (reduceMotion) {
      timer = window.setTimeout(() => setSummaryLength(SUMMARY.length), 0);
      return () => window.clearTimeout(timer);
    }

    if (summaryPhase === "typing") {
      if (summaryLength < SUMMARY.length) {
        timer = window.setTimeout(
          () => setSummaryLength((length) => length + 1),
          38,
        );
      } else {
        timer = window.setTimeout(() => setSummaryPhase("holding"), 0);
      }
    } else if (summaryPhase === "holding") {
      timer = window.setTimeout(() => setSummaryPhase("deleting"), 3000);
    } else if (summaryPhase === "deleting") {
      if (summaryLength > 0) {
        timer = window.setTimeout(
          () => setSummaryLength((length) => length - 1),
          22,
        );
      } else {
        timer = window.setTimeout(() => setSummaryPhase("waiting"), 0);
      }
    } else {
      timer = window.setTimeout(() => setSummaryPhase("typing"), 700);
    }

    return () => window.clearTimeout(timer);
  }, [reduceMotion, summaryLength, summaryPhase]);

  const activeStory = STORY_CHAPTERS[storyChapter];
  const storyMotionClass = [
    styles.storyMotionOne,
    styles.storyMotionTwo,
    styles.storyMotionThree,
    styles.storyMotionFour,
  ][storyChapter] ?? styles.storyMotionFinal;

  return (
    <main className={styles.landing}>
      <div className={styles.portrait} aria-hidden="true">
        <Image
          src="/images/agrim-hero.png"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className={styles.portraitImage}
        />
      </div>
      <div className={styles.grain} aria-hidden="true" />

      <header className={styles.masthead}>
        <a href="#main-menu" className={styles.wordmark} aria-label="Agrim Tycoon home">
          <Image
            src="/images/agrim-tech-overlord-logo.png"
            alt=""
            width={512}
            height={512}
            unoptimized
            className={styles.mastheadLogo}
          />
          <span>Agrim Tycoon</span>
        </a>
        <a
          className={styles.githubLink}
          href="https://github.com/sayyidkhan/agrim-tycoon"
          target="_blank"
          rel="noreferrer"
          aria-label="View the Agrim Tycoon project on GitHub"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.49c-2.23.48-2.7-.95-2.7-.95-.36-.93-.89-1.18-.89-1.18-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.66.07-.51.28-.87.51-1.07-1.78-.2-3.65-.88-3.65-3.96 0-.88.32-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .68-.21 2.2.82A7.7 7.7 0 0 1 8 4.8c.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.27.83 2.15 0 3.08-1.87 3.75-3.65 3.95.29.25.54.72.54 1.46v2.17c0 .21.14.45.55.38A8 8 0 0 0 8 0Z" />
          </svg>
          <span>View on GitHub</span>
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className={styles.menu} id="main-menu" aria-labelledby="game-title">
        <div className={styles.kickerRow}>
          <span className={styles.kicker}>A career survival game</span>
          <span className={styles.rule} aria-hidden="true" />
          <span className={styles.version}>v1.0</span>
        </div>

        <div className={styles.titleLockup}>
          <Image
            src="/images/agrim-tech-overlord-logo.png"
            alt=""
            width={512}
            height={512}
            unoptimized
            className={styles.titleEmblem}
          />
          <h1 className={styles.title} id="game-title">
            <span>AGRIM</span>
            <span>TYCOON</span>
          </h1>
          <span className={styles.titleSpark} aria-hidden="true">
            <span />
          </span>
          <span className={styles.titleSparkles} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        </div>

        <div className={styles.landingTagline}>
          <p>Build the city. Tame the AI. Stay mayor.</p>
          <span>
            Can you be a <strong className={styles.mayorHighlight}>better mayor</strong> than Agrim?
          </span>
        </div>

        <div
          className={styles.stakes}
          aria-label="One week. Three jobs. Zero time."
        >
          <div className={styles.stakesWeek}>
            <span className={styles.weekNumber}>1</span>
            <span className={styles.stakesLabel}>Week</span>
          </div>

          <span className={styles.stakesConnector} aria-hidden="true" />

          <div className={styles.stakesJobs}>
            <span className={styles.jobsCount}>
              <strong>3</strong>
              <span>Jobs</span>
            </span>
            <span className={styles.jobMarks}>
              <a
                className={styles.jobIdentity}
                href="https://www.spacex.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit SpaceX website"
              >
                <span className={`${styles.jobMark} ${styles.jobMarkSpace}`}>
                  <Image
                    src="/images/spacex-logo.png"
                    alt=""
                    fill
                    unoptimized
                    sizes="64px"
                  />
                </span>
                <span className={styles.jobName}>SpaceX</span>
              </a>
              <a
                className={styles.jobIdentity}
                href="https://www.65labs.org/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit 65labs website"
              >
                <span className={`${styles.jobMark} ${styles.jobMarkLabs}`}>
                  <Image
                    src="/images/65labs-logo.png"
                    alt=""
                    fill
                    unoptimized
                    sizes="64px"
                  />
                </span>
                <span className={styles.jobName}>65labs</span>
              </a>
              <a
                className={styles.jobIdentity}
                href="https://www.codewithai.xyz/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit Code with AI website"
              >
                <span className={`${styles.jobMark} ${styles.jobMarkCode}`}>
                  <Image
                    src="/images/code-with-ai-logo.png"
                    alt=""
                    fill
                    unoptimized
                    sizes="64px"
                  />
                </span>
                <span className={styles.jobName}>Code with AI</span>
              </a>
            </span>
          </div>

          <span className={styles.stakesConnector} aria-hidden="true" />

          <div className={styles.stakesTime}>
            <svg viewBox="0 0 28 34" aria-hidden="true">
              <path d="M5 2h18M5 32h18" />
              <path d="M8 4c0 6 2.6 8.3 6 11-3.4 2.7-6 5-6 11h12c0-6-2.6-8.3-6-11 3.4-2.7 6-5 6-11H8Z" />
              <path className={styles.hourglassSand} d="m10.5 25 3.5-4 3.5 4h-7Zm1-17h5L14 12l-2.5-4Z" />
            </svg>
            <span className={styles.timeLabel}>
              <strong>Zero</strong>
              <span>Time</span>
            </span>
          </div>
        </div>

        <p className={styles.summary} aria-label={SUMMARY}>
          <span aria-hidden="true">{SUMMARY.slice(0, summaryLength)}</span>
          {!reduceMotion ? (
            <span className={styles.typewriterCursor} aria-hidden="true" />
          ) : null}
        </p>

        <nav className={styles.actions} aria-label="Game menu">
          {onPlay ? (
            <button
              ref={playButtonRef}
              className={styles.startButton}
              type="button"
              onClick={onPlay}
            >
              <span>Play the game</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </button>
          ) : (
            <a
              ref={downloadButtonRef}
              className={styles.startButton}
              href={MAC_DOWNLOAD_URL}
              download="AgrimTycoon-0.1.0-arm64.dmg"
            >
              <span>Download for macOS</span>
              <span className={styles.arrow} aria-hidden="true">↓</span>
            </a>
          )}
          <button
            ref={backstoryButtonRef}
            className={styles.guideButton}
            type="button"
            onClick={openBackstory}
          >
            Who is Agrim?
            <span className={styles.shortcut} aria-hidden="true">A</span>
          </button>
          <button
            ref={howToButtonRef}
            className={styles.guideButton}
            type="button"
            onClick={() => setShowGuide(true)}
          >
            How to play
            <span className={styles.shortcut} aria-hidden="true">H</span>
          </button>
        </nav>
      </section>

      <footer className={styles.footer}>
        <div className={styles.roles} aria-label="Agrim's three roles">
          <span>SpaceXAI</span>
          <span>65labs</span>
          <span>Code with AI</span>
        </div>
        <div className={styles.models} aria-label="Powered by artificial intelligence models">
          <span>Gemma runs locally on your Mac</span>
          <span>Local Gemma decision support</span>
        </div>
      </footer>

      <p className={styles.beginHint} aria-hidden="true">
        {onPlay ? "Press Enter to play" : "Press Enter to download"}
      </p>

      {showGuide ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={closeGuide}>
          <section
            ref={modalRef}
            className={`${styles.modal} ${styles.guideModal}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-title"
            aria-describedby="guide-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <p>Field manual · 01</p>
              <button
                ref={closeButtonRef}
                className={styles.closeButton}
                type="button"
                onClick={closeGuide}
                aria-label="Close how to play"
              >
                Close <span aria-hidden="true">×</span>
              </button>
            </header>

            <div className={styles.modalBody}>
              <p className={styles.modalEyebrow}>The grand vision</p>
              <h2 id="guide-title">Become Mayor of Innovation City.</h2>
              <p id="guide-description" className={styles.modalIntro}>
                Two outcomes: build the next-generation Innovation City—or be
                owned by the AI meant to run it. Win the mayorship, keep it,
                and balance the city&apos;s people, skills, and machines.
              </p>

              <ol className={styles.instructions}>
                <li>
                  <div className={styles.missionArtwork}>
                    <Image
                      src="/images/field-manual-machines.jpg"
                      alt="A human operator building and directing a vast AI-run robotics and aerospace city in 2077"
                      fill
                      unoptimized
                      sizes="(max-width: 980px) 45vw, 30vw"
                    />
                    <button
                      className={styles.elonArtworkOverlay}
                      type="button"
                      aria-label="Reveal the Elon plot twist"
                      aria-pressed={showElonPlotTwist}
                      onPointerEnter={() => setShowElonPlotTwist(true)}
                      onPointerLeave={() => setShowElonPlotTwist(false)}
                      onFocus={() => setShowElonPlotTwist(true)}
                      onBlur={() => setShowElonPlotTwist(false)}
                      onClick={() => setShowElonPlotTwist(true)}
                    >
                      <Image
                        src="/images/elon-twist.jpg"
                        alt="Elon Musk"
                        fill
                        unoptimized
                        sizes="180px"
                      />
                    </button>
                    <span className={styles.missionNumber}>01</span>
                    <span className={styles.plotTwistBadge}>Plot twist</span>
                  </div>
                  <div className={styles.missionCopy}>
                    <span className={styles.missionLabel}>SpaceXAI · Machine city</span>
                    <strong>Build the machines</strong>
                    <p
                      className={showElonPlotTwist ? styles.plotTwistCopy : undefined}
                      aria-live="polite"
                    >
                      {showElonPlotTwist
                        ? "Elon may accelerate Innovation City—or destabilize it. Gemma simulates both futures; Agrim must capture the upside without handing him control of the city."
                        : "Build the systems that make Innovation City real—then make sure every machine still answers to people."}
                    </p>
                  </div>
                </li>
                <li>
                  <div className={styles.missionArtwork}>
                    <Image
                      src="/images/field-manual-recruit.jpg"
                      alt="Researchers and applied AI innovators entering a futuristic civic recruitment forum"
                      fill
                      unoptimized
                      sizes="(max-width: 980px) 45vw, 30vw"
                    />
                    <span className={styles.missionNumber}>02</span>
                  </div>
                  <div className={styles.missionCopy}>
                    <span className={styles.missionLabel}>65labs · Talent network</span>
                    <strong>Recruit the researchers</strong>
                    <p>
                      Discover, onboard, and activate the researchers and applied
                      AI innovators who will drive the city&apos;s next era.
                    </p>
                  </div>
                </li>
                <li>
                  <div className={styles.missionArtwork}>
                    <Image
                      src="/images/field-manual-hitl.jpg"
                      alt="Human operators steering and verifying autonomous AI systems in a futuristic command academy"
                      fill
                      unoptimized
                      sizes="(max-width: 980px) 45vw, 30vw"
                    />
                    <span className={styles.missionNumber}>03</span>
                  </div>
                  <div className={styles.missionCopy}>
                    <span className={styles.missionLabel}>Code With AI · Builder academy</span>
                    <strong>Grow the builders</strong>
                    <p>
                      Turn curiosity into capability. Train people to steer
                      agents, challenge decisions, and ship what the city needs.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className={styles.modalFooter}>
              <p>Good luck, Mayor.</p>
              {onPlay ? (
                <button type="button" onClick={onPlay}>
                  Play the game <span aria-hidden="true">→</span>
                </button>
              ) : (
                <a href={MAC_DOWNLOAD_URL} download="AgrimTycoon-0.1.0-arm64.dmg">
                  Download for macOS <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {showBackstory ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={closeBackstory}
        >
          <section
            ref={backstoryModalRef}
            className={`${styles.modal} ${styles.backstoryModal}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="backstory-title"
            aria-describedby="backstory-intro"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <p>Origin file · Agrim Singh</p>
              <button
                ref={backstoryCloseButtonRef}
                className={styles.closeButton}
                type="button"
                onClick={closeBackstory}
                aria-label="Close Agrim's backstory"
              >
                Close <span aria-hidden="true">×</span>
              </button>
            </header>

            <div className={styles.backstoryBody}>
              <div className={styles.storyProgress} aria-label="Story progress">
                <span>
                  Chapter {String(storyChapter + 1).padStart(2, "0")} /{" "}
                  {String(STORY_CHAPTERS.length).padStart(2, "0")}
                </span>
                <div aria-hidden="true">
                  <i
                    style={{
                      width: `${((storyChapter + 1) / STORY_CHAPTERS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div
                className={`${styles.storyReader} ${
                  activeStory.panels === 1 ? styles.storyReaderWide : ""
                }`}
              >
                <div
                  key={`${activeStory.image}-${activeStory.panel}`}
                  className={`${styles.storyArtwork} ${storyMotionClass}`}
                  role="img"
                  aria-label={`Comic scene ${storyChapter + 1}: ${activeStory.title}`}
                >
                  <span
                    className={styles.storyArtworkCanvas}
                    aria-hidden="true"
                    style={{
                      backgroundImage: `url(${activeStory.image})`,
                      backgroundPosition: `${
                        activeStory.panels === 1
                          ? 0
                          : (activeStory.panel / (activeStory.panels - 1)) * 100
                      }% center`,
                      backgroundSize: `${activeStory.panels * 100}% auto`,
                    }}
                  />
                  <span className={styles.cinemaFlare} aria-hidden="true" />
                  <span className={styles.cinemaBarTop} aria-hidden="true" />
                  <span className={styles.cinemaBarBottom} aria-hidden="true" />
                  {storyChapter === STORY_CHAPTERS.length - 1 ? (
                    <span className={styles.finalPanelCurtains} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : null}
                  {activeStory.cue ? (
                    <span className={styles.storyChapterCue} aria-hidden="true">
                      {activeStory.cue}
                    </span>
                  ) : null}
                  <span className={styles.panelNumber} aria-hidden="true">
                    {String(storyChapter + 1).padStart(2, "0")}
                  </span>
                </div>

                <article
                  key={`copy-${storyChapter}`}
                  className={`${styles.storyCopy} ${
                    storyChapter === STORY_CHAPTERS.length - 1
                      ? styles.storyCopyRoles
                      : ""
                  }`}
                  aria-live="polite"
                >
                  {storyChapter === STORY_CHAPTERS.length - 1 ? (
                    <>
                      <p className={styles.presentRolesEyebrow} id="backstory-title">
                        Today · three worlds collide
                      </p>
                      <div className={styles.presentRoles} id="backstory-intro">
                        <article>
                          <span>01 · SPACEX AI</span>
                          <h3>Build the impossible.</h3>
                          <p>
                            At mission control, ambitious ideas only matter when they
                            become useful systems—fast.
                          </p>
                        </article>
                        <article>
                          <span>02 · 65LABS</span>
                          <h3>Recruit the community.</h3>
                          <p>
                            Create rooms where AI builders can meet, learn and build—
                            while keeping spam, scams and empty hype outside.
                          </p>
                        </article>
                        <article>
                          <span>03 · CODE WITH AI</span>
                          <h3>Grow people who ship.</h3>
                          <p>
                            Help beginners move from zero to a working app using
                            modern AI-assisted coding tools.
                          </p>
                        </article>
                      </div>
                      <p className={styles.bossReveal}>
                        Boss fight unlocked: one week, three jobs, zero time.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={styles.modalEyebrow}>{activeStory.eyebrow}</p>
                      <h2 id="backstory-title">{activeStory.title}</h2>
                      <p id="backstory-intro">{activeStory.copy}</p>
                    </>
                  )}

                  <div className={styles.storyControls}>
                    <button
                      type="button"
                      onClick={showPreviousChapter}
                      disabled={storyChapter === 0}
                    >
                      <span aria-hidden="true">←</span> Previous
                    </button>
                    {storyChapter < STORY_CHAPTERS.length - 1 ? (
                      <button type="button" onClick={showNextChapter}>
                        Next panel <span aria-hidden="true">→</span>
                      </button>
                    ) : null}
                  </div>

                  <p className={styles.storyHint}>Use ← → arrow keys</p>
                </article>
              </div>

            </div>

          </section>
        </div>
      ) : null}

      <div className={styles.curtain} aria-hidden="true" />
    </main>
  );
}
