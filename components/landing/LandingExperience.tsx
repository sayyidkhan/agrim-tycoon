"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameExperience } from "@/components/game/GameExperience";
import styles from "./landing.module.css";

type Screen = "landing" | "departing" | "game";
type SummaryPhase = "typing" | "holding" | "deleting" | "waiting";

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

export function LandingExperience() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [showGuide, setShowGuide] = useState(false);
  const [showBackstory, setShowBackstory] = useState(false);
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

  const startGame = useCallback(() => {
    if (screen !== "landing" || showGuide || showBackstory) return;
    setScreen("departing");
    window.setTimeout(() => setScreen("game"), 720);
  }, [screen, showBackstory, showGuide]);

  const closeGuide = useCallback(() => {
    setShowGuide(false);
    window.requestAnimationFrame(() => howToButtonRef.current?.focus());
  }, []);

  const startFromGuide = useCallback(() => {
    setShowGuide(false);
    setScreen("departing");
    window.setTimeout(() => setScreen("game"), 720);
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
        startGame();
      }

      if (event.key.toLowerCase() === "h" && screen === "landing") {
        event.preventDefault();
        setShowGuide(true);
      }

      if (event.key.toLowerCase() === "a" && screen === "landing") {
        event.preventDefault();
        openBackstory();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    closeBackstory,
    closeGuide,
    openBackstory,
    screen,
    showBackstory,
    showGuide,
    showNextChapter,
    showPreviousChapter,
    startGame,
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
    if (screen !== "landing") return;

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
  }, [reduceMotion, screen, summaryLength, summaryPhase]);

  const activeStory = STORY_CHAPTERS[storyChapter];
  const storyMotionClass = [
    styles.storyMotionOne,
    styles.storyMotionTwo,
    styles.storyMotionThree,
    styles.storyMotionFour,
  ][storyChapter] ?? styles.storyMotionFinal;

  if (screen === "game") {
    return <GameExperience />;
  }

  return (
    <main
      className={`${styles.landing} ${
        screen === "departing" ? styles.isDeparting : ""
      }`}
    >
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
        <p className={styles.issue}>Singapore · Gemini AI Hackathon 2026</p>
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
          <button className={styles.startButton} type="button" onClick={startGame}>
            <span>Start the week</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </button>
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
          <span>65labs</span>
          <span>Code with AI</span>
          <span>SpaceXAI</span>
        </div>
        <div className={styles.models} aria-label="Powered by artificial intelligence models">
          <span>Local intelligence by Gemma</span>
          <span>World direction by Gemini</span>
        </div>
      </footer>

      <p className={styles.beginHint} aria-hidden="true">Press Enter to begin</p>

      {showGuide ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={closeGuide}>
          <section
            ref={modalRef}
            className={styles.modal}
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
              <p className={styles.modalEyebrow}>Your objective</p>
              <h2 id="guide-title">Survive one impossible week.</h2>
              <p id="guide-description" className={styles.modalIntro}>
                Keep all three worlds moving without running Agrim into the ground.
              </p>

              <ol className={styles.instructions}>
                <li>
                  <span>01</span>
                  <div>
                    <strong>Choose what matters</strong>
                    <p>Move between community, classroom, and SpaceXAI crises.</p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>Make the call</strong>
                    <p>Act yourself or trust Gemma to handle the queue.</p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>Protect your energy</strong>
                    <p>Every decision costs time. Neglected problems get worse.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className={styles.modalFooter}>
              <p>Good luck, operator.</p>
              <button type="button" onClick={startFromGuide}>
                Start the week <span aria-hidden="true">↗</span>
              </button>
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
                          <span>01 · 65LABS</span>
                          <h3>Protect the community.</h3>
                          <p>
                            Create rooms where AI builders can meet, learn and build—
                            while keeping spam, scams and empty hype outside.
                          </p>
                        </article>
                        <article>
                          <span>02 · CODE WITH AI</span>
                          <h3>Teach people to ship.</h3>
                          <p>
                            Help beginners move from zero to a working app using
                            modern AI-assisted coding tools.
                          </p>
                        </article>
                        <article>
                          <span>03 · SPACEX AI</span>
                          <h3>Build the impossible.</h3>
                          <p>
                            At mission control, ambitious ideas only matter when they
                            become useful systems—fast.
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
