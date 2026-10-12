"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  Bookmark,
  Check,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Compass,
  SlidersHorizontal,
  Globe2,
} from "lucide-react";
import { eras, supplemental, type EventRecord } from "../lib/eras";
import records from "../lib/history.json";
import annual from "../lib/annual.json";
import additional from "../lib/additional.json";
const Atmosphere = dynamic(() => import("./Atmosphere"), { ssr: false });
gsap.registerPlugin(ScrollTrigger);
const events: EventRecord[] = [
  ...(records as EventRecord[]),
  ...(annual as EventRecord[]),
  ...(additional as EventRecord[]),
  ...supplemental,
];
const eventMap = new Map(events.map((event) => [event.id, event]));
const getEvent = (id: string) => eventMap.get(id);
export default function Epoch() {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const audioNodes = useRef<AudioNode[]>([]);
  const [active, setActive] = useState(-1),
    [currentYear, setCurrentYear] = useState("2026"),
    [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [query, setQuery] = useState(""),
    [settings, setSettings] = useState(false),
    [reduced, setReduced] = useState(false),
    [sound, setSound] = useState(false),
    [selected, setSelected] = useState<EventRecord | null>(null),
    [saved, setSaved] = useState<string[]>([]),
    [tab, setTab] = useState("story"),
    [onlySaved, setOnlySaved] = useState(false),
    [webgl, setWebgl] = useState(false);
  const era = active < 0 ? null : eras[active];
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    try {
      setSaved(JSON.parse(localStorage.getItem("epoch-saved") || "[]"));
      const c = document.createElement("canvas");
      setWebgl(!!c.getContext("webgl2") && window.innerWidth > 760);
    } catch {}
  }, []);
  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const progressEl = root.current?.querySelector(
        ".journey-progress",
      ) as HTMLElement | null;
      ScrollTrigger.create({
        trigger: ".journey",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => {
          if (progressEl) progressEl.style.transform = `scaleX(${s.progress})`;
        },
      });
      ScrollTrigger.create({
        trigger: ".opening",
        start: "top top",
        end: "bottom 45%",
        onEnterBack: () => {
          setActive(-1);
          setCurrentYear("2026");
        },
      });
      gsap.utils.toArray<HTMLElement>(".era-section").forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => {
            setActive(i);
            setCurrentYear(eras[i].year);
          },
          onEnterBack: () => {
            setActive(i);
            setCurrentYear(eras[i].year);
          },
        });
        section.querySelectorAll<HTMLElement>(".event-item").forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 65%",
            end: "bottom 65%",
            onEnter: () => setCurrentYear(item.dataset.year || eras[i].year),
            onEnterBack: () =>
              setCurrentYear(item.dataset.year || eras[i].year),
          });
        });
        if (reduced) return;
        const photo = section.querySelector(".scene-image"),
          title = section.querySelector(".era-title"),
          copy = section.querySelector(".era-copy"),
          atmos = section.querySelector(".scene-atmosphere");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=105%",
            pin: section.querySelector<HTMLElement>(".era-stage"),
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        const variant = eras[i].atmosphere;
        if (variant === "digital")
          tl.fromTo(
            photo,
            {
              scale: 1.22,
              filter: "brightness(.15) saturate(0)",
              clipPath: "inset(48% 0 48% 0)",
            },
            {
              scale: 1.03,
              filter: "brightness(.72) saturate(.5)",
              clipPath: "inset(0% 0 0% 0)",
              duration: 0.45,
            },
          );
        else if (variant === "archive")
          tl.fromTo(
            photo,
            { scale: 1.12, filter: "blur(15px) grayscale(1)" },
            { scale: 1.02, filter: "blur(0px) grayscale(1)", duration: 0.5 },
          );
        else if (variant === "sand")
          tl.fromTo(
            photo,
            { scale: 1.25, xPercent: 8, filter: "blur(5px)" },
            { scale: 1.04, xPercent: 0, filter: "blur(0px)", duration: 0.5 },
          );
        else if (variant === "forest")
          tl.fromTo(
            photo,
            { scale: 1.38, yPercent: 10, filter: "brightness(.2)" },
            {
              scale: 1.07,
              yPercent: 0,
              filter: "brightness(.7)",
              duration: 0.5,
            },
          );
        else if (variant === "molten")
          tl.fromTo(
            photo,
            {
              scale: 0.88,
              rotation: -8,
              filter: "sepia(1) saturate(5) brightness(.2)",
            },
            {
              scale: 1.12,
              rotation: 0,
              filter: "sepia(1) saturate(4) brightness(.7)",
              duration: 0.5,
            },
          );
        else
          tl.fromTo(
            photo,
            { scale: 1.25, yPercent: 6 },
            { scale: 1.02, yPercent: -3, duration: 0.5 },
          );
        tl.fromTo(
          title,
          { y: 70, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.3 },
          0.05,
        )
          .fromTo(
            copy,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 },
            0.2,
          )
          .fromTo(atmos, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
          .to(photo, { scale: 1.16, duration: 0.45 }, 0.55)
          .to(title, { y: -28, opacity: 0.25, duration: 0.2 }, 0.8)
          .to(copy, { opacity: 0.3, duration: 0.2 }, 0.8);
      });
      if (!reduced) {
        gsap.to(".hero-visual", {
          yPercent: 12,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: ".opening",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.from(".intro-reveal", {
          y: 22,
          opacity: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
        });
      }
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  const anyDialog = menu || search || settings || !!selected;
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (anyDialog && !el.open) el.showModal();
    else if (!anyDialog && el.open) el.close();
  }, [anyDialog]);
  const close = () => {
    setMenu(false);
    setSearch(false);
    setSettings(false);
    setSelected(null);
    setQuery("");
    setOnlySaved(false);
  };
  const openEvent = (event: EventRecord) => {
    setMenu(false);
    setSearch(false);
    setSelected(event);
    setTab("story");
  };
  const jump = (i: number) => {
    close();
    const el = document.getElementById(i < 0 ? "present" : eras[i].id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: y + (reduced || i < 0 ? 0 : window.innerHeight * 0.35),
        behavior: reduced ? "instant" : "smooth",
      });
    }
  };
  const bookmark = (id: string) => {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("epoch-saved", JSON.stringify(next));
    } catch {}
  };
  const toggleAudio = async () => {
    if (sound) {
      await audioRef.current?.suspend();
      setSound(false);
      return;
    }
    try {
      if (!audioRef.current) {
        const ac = new AudioContext();
        audioRef.current = ac;
        const gain = ac.createGain();
        gain.gain.value = 0.025;
        gain.connect(ac.destination);
        [55, 82.41, 110].forEach((f) => {
          const osc = ac.createOscillator();
          osc.frequency.value = f;
          osc.type = "sine";
          osc.connect(gain);
          osc.start();
          audioNodes.current.push(osc);
        });
        audioNodes.current.push(gain);
      }
      await audioRef.current.resume();
      setSound(true);
    } catch {
      setSound(false);
    }
  };
  useEffect(
    () => () => {
      audioRef.current?.close();
    },
    [],
  );
  useEffect(() => {
    const ac = audioRef.current;
    if (ac && sound) {
      audioNodes.current.forEach((n) => {
        if (n instanceof OscillatorNode)
          n.frequency.setTargetAtTime(
            (active + 2) * 11 + 55,
            ac.currentTime,
            2,
          );
      });
    }
  }, [active, sound]);
  const filtered = useMemo(
    () =>
      events.filter(
        (e) =>
          (!onlySaved || saved.includes(e.id)) &&
          `${e.title} ${e.year} ${e.people} ${e.summary}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, onlySaved, saved],
  );
  return (
    <div
      ref={root}
      className={`epoch ${reduced ? "reduced" : ""}`}
      style={{ "--accent": era?.accent || "#c7b69b" } as React.CSSProperties}
    >
      <a href="#digital" className="skip-link">
        Skip to the historical journey
      </a>
      <header className="topbar">
        <button
          className="brand"
          aria-label="EPOCH, return to present"
          onClick={() => jump(-1)}
        >
          <span className="brand-icon">E</span>
          <span>
            EPOCH<small>THE TIME MACHINE</small>
          </span>
        </button>
        <nav aria-label="Main navigation">
          <button className="nav-link" onClick={() => setMenu(true)}>
            Explore the eras <Plus size={13} />
          </button>
          <span className="nav-divider" />
          <button
            className="icon-button"
            aria-label="Search the archive"
            onClick={() => setSearch(true)}
          >
            <Search size={17} />
          </button>
          <button
            className="icon-button sound-button"
            aria-label={sound ? "Mute ambient sound" : "Enable ambient sound"}
            onClick={toggleAudio}
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <button
            className="icon-button"
            aria-label="Accessibility and display settings"
            onClick={() => setSettings(true)}
          >
            <SlidersHorizontal size={17} />
          </button>
          <button className="present-button" onClick={() => jump(-1)}>
            Return to present <ArrowUpRight size={13} />
          </button>
        </nav>
      </header>
      <main className="journey">
        <section
          className="opening"
          id="present"
          aria-label="The present, 2026"
        >
          <div className="hero-visual" aria-hidden="true">
            <img src="/images/earth-hero.webp" alt="" fetchPriority="high" />
            <div className="planet-orbit orbit-one" />
            <div className="planet-orbit orbit-two" />
            <span className="orbit-label">OUR ONLY HOME</span>
          </div>
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="eyebrow intro-reveal">
              <span className="live-dot" /> YOU ARE HERE{" "}
              <span className="eyebrow-line" /> 2026 CE
            </div>
            <h1 className="intro-reveal">
              Everything
              <br />
              has a <em>before.</em>
            </h1>
            <p className="hero-description intro-reveal">
              Before the world you know, there were countless others.
              <br className="desktop-break" /> Scroll backward through the story
              of our existence.
            </p>
            <button
              className="journey-button intro-reveal"
              onClick={() => jump(0)}
            >
              <span>Begin the journey</span>
              <span className="button-arrow">
                <ArrowDown size={17} />
              </span>
            </button>
            <div className="hero-duration intro-reveal">
              <span>4.54 BILLION YEARS</span>
              <span className="tiny-dot" /> ONE EXTRAORDINARY STORY
            </div>
          </div>
          <div className="earth-coordinate">
            <span className="coordinate-cross">+</span>
            <div>
              EARTH<small>4.54 BILLION YEARS IN THE MAKING</small>
            </div>
          </div>
          <div className="hero-bottom">
            <div className="scroll-instruction">
              <span className="scroll-line" /> SCROLL TO TRAVEL BACK IN TIME
            </div>
            <p>
              Not just history.
              <br />
              <em>A change in perspective.</em>
            </p>
            <span className="hero-chapter">
              PROLOGUE <span>00 / 08</span>
            </span>
          </div>
        </section>
        <section className="orientation">
          <span className="section-index">THE JOURNEY</span>
          <p>
            Time moves backward.
            <br />
            <em>Your perspective moves forward.</em>
          </p>
          <div>
            From the world in your hands
            <br />
            to a world before anyone was here.
            <span>
              <ArrowDown size={18} />
            </span>
          </div>
        </section>
        {eras.map((e, i) => (
          <section
            key={e.id}
            id={e.id}
            className={`era-section era-${e.atmosphere}`}
            style={{ "--scene-accent": e.accent } as React.CSSProperties}
            aria-labelledby={`title-${e.id}`}
          >
            <div className="era-stage">
              <div
                className="scene-image"
                style={{ backgroundImage: `url('/images/${e.image}.webp')` }}
                role="img"
                aria-label={
                  e.atmosphere === "sand"
                    ? "Pyramids in a desert landscape"
                    : e.atmosphere === "forest"
                      ? "A densely wooded forest"
                      : e.atmosphere === "orbit"
                        ? "Earth viewed from orbit"
                        : "Atmospheric landscape illustrating the chapter"
                }
              />
              <div className="scene-shade" />
              <div className="scene-atmosphere" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="scene-symbol" aria-hidden="true">
                {e.atmosphere === "digital"
                  ? "01"
                  : e.atmosphere === "archive"
                    ? "✦"
                    : e.atmosphere === "sand"
                      ? "△"
                      : e.atmosphere === "ember"
                        ? "◯"
                        : e.atmosphere === "molten"
                          ? "◌"
                          : ""}
              </div>
              <div className="era-top">
                <span>
                  CHAPTER {e.symbol} <span className="top-slash">/</span>{" "}
                  {e.subtitle}
                </span>
                <span>{e.scale}</span>
              </div>
              <div className="era-layout">
                <div className="era-heading">
                  <div className="eyebrow">{e.range}</div>
                  <h2 id={`title-${e.id}`} className="era-title">
                    {e.title.split("\n").map((line, j) => (
                      <span key={line} className={j === 1 ? "serif-line" : ""}>
                        {line}
                      </span>
                    ))}
                  </h2>
                </div>
                <div className="era-copy">
                  <p>{e.description}</p>
                  <div className="era-fact">
                    <strong>{e.fact}</strong>
                    <span>{e.factLabel}</span>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => {
                      const ev = getEvent(e.events[0]);
                      if (ev) openEvent(ev);
                    }}
                  >
                    Step inside this era <ArrowUpRight size={17} />
                  </button>
                </div>
              </div>
              <div className="era-footer">
                <div>
                  <span className="entry-dash" />
                  {e.threshold}
                </div>
                <span>
                  SCROLL TO GO DEEPER <ArrowDown size={13} />
                </span>
              </div>
            </div>
            <div className="event-strip">
              <div className="strip-intro">
                <span className="section-index">THE LIVING ARCHIVE</span>
                <h3>A closer look.</h3>
                <p>
                  Explore the moments that
                  <br />
                  changed what came next.
                </p>
              </div>
              <div className="event-list">
                {e.events.map((id) => {
                  const ev = getEvent(id);
                  return ev ? (
                    <button
                      className={`event-item event-${id}`}
                      data-year={ev.year}
                      key={id}
                      onClick={() => openEvent(ev)}
                    >
                      <span className="event-year">{ev.year}</span>
                      <span className="event-title">{ev.title}</span>
                      <span className="event-preview">{ev.summary}</span>
                      <ArrowUpRight size={18} />
                      {saved.includes(id) && (
                        <Bookmark size={12} className="saved-mark" />
                      )}
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          </section>
        ))}
        <section className="epilogue">
          <div className="eyebrow">
            <span className="live-dot" /> THE END IS A BEGINNING
          </div>
          <h2>
            You are a moment.
            <br />
            <em>What a moment to be.</em>
          </h2>
          <p>
            Every world you crossed made this one possible.
            <br />
            Carry a little of that perspective back with you.
          </p>
          <button className="journey-button" onClick={() => jump(-1)}>
            Return to 2026 <ArrowUpRight size={17} />
          </button>
          <button
            className="text-button"
            onClick={() => {
              setSearch(true);
              setOnlySaved(true);
            }}
          >
            Revisit your discoveries <Bookmark size={15} />
          </button>
          <footer>
            <span>EPOCH — THE TIME MACHINE</span>
            <span>A living archive. A shared history.</span>
            <button onClick={() => setSettings(true)}>
              About the experience
            </button>
          </footer>
        </section>
      </main>
      <aside className="time-rail" aria-label="Era navigator">
        <span className="rail-top">TIME</span>
        <div className="rail-spine" />
        <button
          onClick={() => jump(-1)}
          className={active < 0 ? "active" : ""}
          aria-label="Jump to present"
        >
          <span>2026</span>
          <i />
        </button>
        {eras.map((e, i) => (
          <button
            key={e.id}
            onClick={() => jump(i)}
            className={active === i ? "active" : ""}
            aria-label={`Jump to ${e.name}`}
          >
            <span>
              {
                [
                  "2025",
                  "1969",
                  "1939",
                  "1760",
                  "2500 BCE",
                  "300K",
                  "66M",
                  "4.54B",
                ][i]
              }
            </span>
            <i />
          </button>
        ))}
        <span className="rail-bottom">ORIGIN</span>
      </aside>
      <div className="current-era" aria-live="polite">
        <span className="live-dot" />
        {era ? era.name : "The present"}
        <span>{currentYear}</span>
      </div>
      <div className="journey-progress" style={{ transform: "scaleX(0)" }} />
      {webgl && !reduced && (
        <div className="particle-canvas" aria-hidden="true">
          <Atmosphere color={era?.accent || "#bbcedb"} />
        </div>
      )}
      <dialog
        ref={dialog}
        aria-label={
          selected?.title ||
          (search
            ? "Search the archive"
            : menu
              ? "Choose an era"
              : "Experience settings")
        }
        className={`archive-dialog ${selected ? "detail-dialog" : ""}`}
        onCancel={close}
        onClick={(ev) => {
          if (ev.target === dialog.current) close();
        }}
      >
        <div className="dialog-surface">
          <button
            className="dialog-close icon-button"
            onClick={close}
            aria-label="Close panel"
          >
            <X size={21} />
          </button>
          {menu && (
            <>
              <div className="eyebrow">CHOOSE YOUR DESTINATION</div>
              <h2>
                Every era.
                <br />
                <em>Another world.</em>
              </h2>
              <div className="era-menu">
                <button onClick={() => jump(-1)}>
                  <span>00</span>
                  <div>
                    The present<small>2026 CE</small>
                  </div>
                  <ArrowUpRight size={20} />
                </button>
                {eras.map((e, i) => (
                  <button
                    key={e.id}
                    onClick={() => jump(i)}
                    style={
                      { "--scene-accent": e.accent } as React.CSSProperties
                    }
                  >
                    <span>{e.symbol}</span>
                    <div>
                      {e.name}
                      <small>{e.range}</small>
                    </div>
                    <ArrowUpRight size={20} />
                  </button>
                ))}
              </div>
            </>
          )}
          {search && (
            <>
              <div className="eyebrow">THE LIVING ARCHIVE</div>
              <h2>
                Follow your
                <br />
                <em>curiosity.</em>
              </h2>
              <label className="search-input">
                <Search size={21} />
                <input
                  autoFocus
                  placeholder="A year, event, person, or civilization…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search history"
                />
              </label>
              <div className="search-filter">
                <button
                  className={!onlySaved ? "chosen" : ""}
                  onClick={() => setOnlySaved(false)}
                >
                  All discoveries
                </button>
                <button
                  className={onlySaved ? "chosen" : ""}
                  onClick={() => setOnlySaved(true)}
                >
                  Saved <span>{saved.length}</span>
                </button>
                <span>{filtered.length} RESULTS</span>
              </div>
              <div className="search-results">
                {filtered.map((e) => (
                  <button key={e.id} onClick={() => openEvent(e)}>
                    <span>{e.year}</span>
                    <div>
                      <strong>{e.title}</strong>
                      <small>{e.people}</small>
                    </div>
                    <ArrowUpRight size={17} />
                  </button>
                ))}
                {!filtered.length && (
                  <p>No discoveries found. Try “Moon”, “Egypt”, or “2020”.</p>
                )}
              </div>
            </>
          )}
          {selected && (
            <>
              <button
                className="back-archive text-button"
                onClick={() => {
                  setSelected(null);
                  setSearch(true);
                }}
              >
                <ArrowLeft size={14} /> Back to archive
              </button>
              <div className="eyebrow">
                {selected.year} <span className="eyebrow-line" /> A CLOSER LOOK
              </div>
              <h2>{selected.title}</h2>
              <div className="detail-actions">
                <button
                  className="text-button"
                  onClick={() => bookmark(selected.id)}
                >
                  {saved.includes(selected.id) ? (
                    <Check size={15} />
                  ) : (
                    <Bookmark size={15} />
                  )}{" "}
                  {saved.includes(selected.id)
                    ? "Saved to discoveries"
                    : "Save discovery"}
                </button>
                <span>HISTORICAL CONTEXT</span>
              </div>
              <div
                className="detail-tabs"
                role="tablist"
                aria-label="Article sections"
              >
                {["story", "significance", "people", "sources"].map((t) => (
                  <button
                    role="tab"
                    aria-selected={tab === t}
                    key={t}
                    className={tab === t ? "selected" : ""}
                    onClick={() => setTab(t)}
                  >
                    {t === "story"
                      ? "What happened"
                      : t === "significance"
                        ? "Why it matters"
                        : t === "people"
                          ? "People & institutions"
                          : "Sources"}
                  </button>
                ))}
              </div>
              <article className="detail-article" role="tabpanel">
                {tab === "story" ? (
                  <>
                    <h3>The moment</h3>
                    <p>{selected.summary}</p>
                    {selected.details && <p>{selected.details}</p>}
                    <blockquote>
                      “{selected.why}”
                      <small>Educational summary by EPOCH</small>
                    </blockquote>
                  </>
                ) : tab === "significance" ? (
                  <>
                    <h3>The world after</h3>
                    <p>{selected.why}</p>
                    <p>
                      Explore the original source for more detail, evidence, and
                      the wider context of this moment.
                    </p>
                  </>
                ) : tab === "people" ? (
                  <>
                    <h3>History is made by people</h3>
                    {selected.people.split(/ · |; /).map((person) => (
                      <button
                        className="person-link"
                        key={person}
                        onClick={() => {
                          setQuery(person);
                          setSelected(null);
                          setSearch(true);
                        }}
                      >
                        <span>{person}</span>
                        <Search size={16} />
                      </button>
                    ))}
                    <p className="context-note">
                      Select a name to explore related discoveries in this
                      archive.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>Follow the evidence</h3>
                    <p>
                      History is complex. This account is a concise educational
                      summary. Approximate dates and regional differences are
                      marked where relevant.
                    </p>
                    <a
                      className="source-link"
                      href={selected.source}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe2 size={18} />
                      <span>
                        {selected.sourceName ||
                          new URL(selected.source).hostname}
                        <small>Read the original reference</small>
                      </span>
                      <ArrowUpRight size={19} />
                    </a>
                  </>
                )}
              </article>
              <div className="related-discoveries">
                <span className="section-index">KEEP EXPLORING</span>
                {eras
                  .filter((e) => e.events.includes(selected.id))
                  .flatMap((e) =>
                    e.events.filter((id) => id !== selected.id).slice(0, 2),
                  )
                  .map((id) => {
                    const ev = getEvent(id);
                    return ev ? (
                      <button key={id} onClick={() => openEvent(ev)}>
                        {ev.title}
                        <ArrowRight size={16} />
                      </button>
                    ) : null;
                  })}
              </div>
            </>
          )}
          {settings && (
            <>
              <div className="eyebrow">YOUR EXPERIENCE</div>
              <h2>
                A different
                <br />
                <em>perspective.</em>
              </h2>
              <div className="settings-row">
                <div>
                  <strong>Gentler motion</strong>
                  <p>Show chapters without pinned camera movement.</p>
                </div>
                <button
                  role="switch"
                  aria-checked={reduced}
                  aria-label="Gentler motion"
                  className={`toggle ${reduced ? "on" : ""}`}
                  onClick={() => setReduced(!reduced)}
                >
                  <span />
                </button>
              </div>
              <div className="settings-row">
                <div>
                  <strong>Ambient sound</strong>
                  <p>A quiet, evolving tone. Sound starts only by choice.</p>
                </div>
                <button
                  role="switch"
                  aria-checked={sound}
                  aria-label="Ambient sound"
                  className={`toggle ${sound ? "on" : ""}`}
                  onClick={toggleAudio}
                >
                  <span />
                </button>
              </div>
              <div className="about-note">
                <Compass size={25} />
                <h3>An archive, always expanding.</h3>
                <p>
                  EPOCH follows selected moments across human and planetary
                  history. Eras overlap; dates for deep time are approximate.
                  Recent-year selections highlight scientific milestones rather
                  than a complete annual history.
                </p>
                <p>
                  Historical summaries include original references. Atmospheric
                  imagery is illustrative, including an AI-created Earth vista,
                  and is not presented as archival evidence. Saved discoveries
                  stay in this browser.
                </p>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
