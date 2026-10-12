"use client";
import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Bookmark,
  Check,
  Compass,
  Info,
} from "lucide-react";
import { filmState as defaultFilm, shots } from "../lib/cinema";
import { supplemental, type EventRecord } from "../lib/eras";
import history from "../lib/history.json";
import annual from "../lib/annual.json";
import additional from "../lib/additional.json";
const World = dynamic(() => import("./CinematicWorld"), { ssr: false });
gsap.registerPlugin(ScrollTrigger);
const events: EventRecord[] = [
  ...(history as EventRecord[]),
  ...(annual as EventRecord[]),
  ...(additional as EventRecord[]),
  ...supplemental,
];
const eventMap = new Map(events.map((e) => [e.id, e]));
class RenderBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function FilmExperience() {
  const clock = useRef({ ...defaultFilm });
  const filmState = clock.current;
  const root = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    range = useRef<HTMLInputElement>(null),
    progress = useRef<HTMLDivElement>(null),
    lastIndex = useRef(-1),
    trigger = useRef<ScrollTrigger | null>(null);
  const [index, setIndex] = useState(0),
    [ready, setReady] = useState(false),
    [webgl, setWebgl] = useState(false),
    [reduced, setReduced] = useState(false),
    [paused, setPaused] = useState(false),
    [panel, setPanel] = useState<"event" | "search" | "eras" | "about" | null>(
      null,
    ),
    [selected, setSelected] = useState<EventRecord | null>(null),
    [tab, setTab] = useState("story"),
    [query, setQuery] = useState(""),
    [saved, setSaved] = useState<string[]>([]),
    [narration, setNarration] = useState(false),
    [onlySaved, setOnlySaved] = useState(false);
  const shot = shots[index];
  useEffect(() => {
    const c = document.createElement("canvas");
    try {
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {}
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    filmState.quality = window.innerWidth < 760 ? "mobile" : "desktop";
    try {
      const stored = JSON.parse(localStorage.getItem("epoch-saved") || "[]");
      setSaved(
        Array.isArray(stored)
          ? stored.filter((x) => typeof x === "string")
          : [],
      );
    } catch {}
    const resize = () => {
      filmState.quality = window.innerWidth < 760 ? "mobile" : "desktop";
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => {
    if (!root.current) return;
    const clock = { position: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: reduced ? true : 0.7,
            invalidateOnRefresh: true,
          },
        })
        .to(clock, {
          position: shots.length - 0.0001,
          duration: 1,
          ease: "none",
          onUpdate: () => {
            if (filmState.paused) return;
            const i = Math.floor(clock.position);
            const p = clock.position / shots.length;
            filmState.direction = p >= filmState.progress ? 1 : -1;
            filmState.progress = p;
            filmState.shot = i;
            filmState.local = clock.position - i;
            filmState.invalidate?.();
            if (range.current) range.current.value = String(p);
            if (progress.current)
              progress.current.style.transform = `scaleX(${p})`;
            if (lastIndex.current !== i) {
              lastIndex.current = i;
              setIndex(i);
            }
          },
        });
      trigger.current = tl.scrollTrigger || null;
    }, root);
    return () => {
      ctx.revert();
      trigger.current = null;
    };
  }, [reduced]);
  useEffect(() => {
    if (!narration || !window.speechSynthesis || filmState.paused) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(
      `${shot.year}. ${shot.title}. ${shot.caption}`,
    );
    speech.rate = 0.88;
    speech.volume = 0.65;
    window.speechSynthesis.speak(speech);
    return () => window.speechSynthesis.cancel();
  }, [index, narration, shot]);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (panel) {
      filmState.paused = true;
      document.body.style.overflow = "hidden";
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
      document.body.style.overflow = paused ? "hidden" : "";
      filmState.paused = paused;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel, paused]);
  const close = () => {
    setPanel(null);
    setQuery("");
    setOnlySaved(false);
  };
  const seek = (position: number) => {
    const st = trigger.current;
    if (st) {
      filmState.paused = false;
      setPaused(false);
      window.scrollTo({
        top:
          st.start +
          Math.max(0, Math.min(0.99999, position)) * (st.end - st.start),
        behavior: "instant",
      });
    }
  };
  const jump = (i: number) => {
    close();
    filmState.paused = false;
    setPaused(false);
    document.body.style.overflow = "";
    seek((i + 0.18) / shots.length);
  };
  const openEvent = (event?: EventRecord) => {
    const target =
      event ||
      eventMap.get(shot.sourceId) ||
      eventMap.get(`annual-${shot.label}`);
    if (target) {
      setSelected(target);
      setTab("story");
      setPanel("event");
    } else setPanel("about");
  };
  const toggleSaved = (id: string) => {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("epoch-saved", JSON.stringify(next));
    } catch {}
  };
  const togglePause = () => {
    const p = !paused;
    filmState.paused = p;
    setPaused(p);
    document.body.style.overflow = p ? "hidden" : "";
  };
  const backdrop =
    shot.world === "city" || shot.world === "hospital"
      ? "/images/city.webp"
      : shot.world === "egypt"
        ? "/images/egypt.webp"
        : shot.world === "dinosaurs"
          ? "/images/forest.webp"
          : shot.world === "earth"
            ? "/images/earth-hero.webp"
            : "/images/mountains.webp";
  const filtered = events.filter(
    (e) =>
      (!onlySaved || saved.includes(e.id)) &&
      `${e.year} ${e.title} ${e.people} ${e.summary}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div
      className={`film-experience ${reduced ? "film-gentle" : ""}`}
      style={{ "--accent": shot.color } as React.CSSProperties}
    >
      <a className="skip-link" href="/archive/">
        Open accessible historical archive
      </a>
      <div className="film-viewport">
        <div
          className="film-backdrop"
          style={{ backgroundImage: `url('${backdrop}')` }}
        />
        {webgl && !reduced && ["city", "hospital"].includes(shot.world) && (
          <RenderBoundary
            fallback={
              <div className="renderer-fallback">
                3D rendering unavailable. The historical archive remains
                accessible.
              </div>
            }
          >
            <World
              clock={filmState}
              index={index}
              onMarker={() => openEvent()}
              onReady={() => setReady(true)}
            />
          </RenderBoundary>
        )}
        <div className="film-vignette" />
        <div className="film-grain" aria-hidden="true" />
      </div>
      <header className="film-header">
        <button
          className="brand"
          onClick={() => jump(0)}
          aria-label="EPOCH, return to 2026"
        >
          <span className="brand-icon">E</span>
          <span>
            EPOCH<small>THE CINEMATIC TIME MACHINE</small>
          </span>
        </button>
        <nav aria-label="Film navigation">
          <button className="film-navlink" onClick={() => setPanel("eras")}>
            Destinations <Compass size={14} />
          </button>
          <button
            className="icon-button"
            onClick={() => setPanel("search")}
            aria-label="Search the historical archive"
          >
            <Search size={17} />
          </button>
          <button
            className="icon-button"
            onClick={() => setNarration(!narration)}
            aria-label={narration ? "Turn narration off" : "Turn narration on"}
          >
            {narration ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <button
            className="icon-button"
            onClick={() => setPanel("about")}
            aria-label="Experience information"
          >
            <Info size={17} />
          </button>
        </nav>
      </header>
      <div className="film-caption">
        <div className="eyebrow">
          <span className="live-dot" />
          {index === 0
            ? "THE PRESENT"
            : shot.world === "hospital"
              ? "A WORLD INTERRUPTED"
              : shot.world.toUpperCase()}
          <span className="eyebrow-line" />
          {shot.year}
        </div>
        <h1>{shot.title}</h1>
        <p>{shot.caption}</p>
        <button className="text-button" onClick={() => openEvent()}>
          {index === 0 ? "About this journey" : "Explore this moment"}
          <ArrowUpRight size={16} />
        </button>
        {index === 0 && (
          <button className="film-start" onClick={() => jump(1)}>
            Scroll to direct time <ArrowDown size={15} />
          </button>
        )}
      </div>
      <div className="film-status">
        <span />
        {webgl && !reduced && ["city", "hospital"].includes(shot.world)
          ? "CINEMATIC ENGINE PREVIEW"
          : "ARCHIVE VISUALIZATION"}
        <button onClick={() => setPanel("about")}>
          {webgl && !reduced && !ready
            ? "Preparing renderer"
            : "Detailed scene assets pending"}
        </button>
      </div>
      <div className="film-controls">
        <div className="film-year" aria-live="polite">
          <strong>{shot.label}</strong>
          <span>{index < 27 ? "YEAR BY YEAR" : "DEEP TIME"}</span>
        </div>
        <div className="film-scrubber">
          <div className="scrubber-labels">
            <span>2026</span>
            <span>YOU DIRECT TIME</span>
            <span>4.54 BILLION YEARS AGO</span>
          </div>
          <input
            ref={range}
            type="range"
            min="0"
            max="0.99999"
            step="0.0001"
            defaultValue="0"
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Historical film timeline"
            aria-valuetext={shot.year}
          />
          <div className="scrubber-ticks" aria-hidden="true">
            {[0, 6, 26, 27, 28, 29, 31, 33, 35, 38, 42, shots.length - 1].map(
              (n, i) => (
                <span
                  key={i}
                  style={{ left: `${(n / shots.length) * 100}%` }}
                />
              ),
            )}
          </div>
        </div>
        <div className="film-playback">
          <button
            className="icon-button"
            aria-label="Previous moment"
            onClick={() => jump(Math.max(0, index - 1))}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="icon-button"
            aria-label={paused ? "Resume timeline" : "Pause timeline"}
            onClick={togglePause}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            className="icon-button"
            aria-label="Next moment"
            onClick={() => jump(Math.min(shots.length - 1, index + 1))}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="film-progress" ref={progress} />
      <main
        ref={root}
        className="film-scrolltrack"
        style={{ height: `${shots.length * 180}vh` }}
        aria-label="Scroll-controlled historical film"
      >
        <h2 className="sr-only">A journey backward through time</h2>
        {shots.map((s) => (
          <section
            key={s.id}
            className="sr-only"
            aria-label={`${s.year}: ${s.title}`}
          >
            <h3>
              {s.year} — {s.title}
            </h3>
            <p>{s.caption}</p>
          </section>
        ))}
      </main>
      <dialog
        ref={dialog}
        className="archive-dialog film-dialog"
        aria-label={
          panel === "event"
            ? selected?.title
            : panel === "eras"
              ? "Choose a destination"
              : panel === "search"
                ? "Search the archive"
                : "About the experience"
        }
        onCancel={close}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="dialog-surface">
          <button
            className="icon-button dialog-close"
            aria-label="Close panel"
            onClick={close}
          >
            <X size={21} />
          </button>
          {panel === "event" && selected && (
            <>
              <div className="eyebrow">
                {selected.year}
                <span className="eyebrow-line" /> DOCUMENTARY FOCUS
              </div>
              <h2>{selected.title}</h2>
              <div className="detail-actions">
                <button
                  className="text-button"
                  onClick={() => toggleSaved(selected.id)}
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
                <span>FILM PAUSED AT YOUR POSITION</span>
              </div>
              <div
                className="detail-tabs"
                role="tablist"
                aria-label="Historical article"
              >
                {["story", "significance", "people", "sources"].map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    className={tab === t ? "selected" : ""}
                    onClick={() => setTab(t)}
                  >
                    {t === "story"
                      ? "What happened"
                      : t === "significance"
                        ? "Why it matters"
                        : t === "people"
                          ? "People & ideas"
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
                    <button
                      className="text-button"
                      onClick={() => setTab("significance")}
                    >
                      Follow the consequences
                      <ArrowUpRight size={15} />
                    </button>
                  </>
                ) : tab === "significance" ? (
                  <>
                    <h3>The world after</h3>
                    <p>{selected.why}</p>
                    <button
                      className="text-button"
                      onClick={() => setTab("people")}
                    >
                      Meet the contributors
                      <ArrowUpRight size={15} />
                    </button>
                  </>
                ) : tab === "people" ? (
                  <>
                    <h3>People, institutions, and ideas</h3>
                    {selected.people.split(" · ").map((p) => (
                      <button
                        className="person-link"
                        key={p}
                        onClick={() => {
                          setQuery(p);
                          setPanel("search");
                        }}
                      >
                        {p}
                        <Search size={15} />
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <h3>Follow the evidence</h3>
                    <p>
                      This is a concise educational account. Follow the original
                      source for evidence and wider context. Approximate dates
                      and regional differences are marked where relevant.
                    </p>
                    <a
                      className="source-link"
                      href={selected.source}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        {selected.sourceName ||
                          new URL(selected.source).hostname}
                        <small>Read the original reference</small>
                      </span>
                      <ArrowUpRight size={18} />
                    </a>
                  </>
                )}
              </article>
              <button className="text-button" onClick={close}>
                <ArrowLeft size={15} /> Return to the same moment
              </button>
            </>
          )}
          {panel === "eras" && (
            <>
              <div className="eyebrow">WHERE WOULD YOU LIKE TO GO?</div>
              <h2>
                Another time.
                <br />
                <em>Another world.</em>
              </h2>
              <div className="destination-note">
                Scene assets are being produced. Every destination has
                historical context; the 3D views are engine previews.
              </div>
              <div className="era-menu">
                {shots.map((s, i) => (
                  <button key={s.id} onClick={() => jump(i)}>
                    <span>{s.label}</span>
                    <div>
                      {s.title}
                      <small>{s.year}</small>
                    </div>
                    <ArrowUpRight size={16} />
                  </button>
                ))}
              </div>
            </>
          )}
          {panel === "search" && (
            <>
              <div className="eyebrow">FOLLOW YOUR CURIOSITY</div>
              <h2>
                Information.
                <br />
                <em>Within information.</em>
              </h2>
              <label className="search-input">
                <Search size={20} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="A year, person, invention, or civilization…"
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
                  Saved {saved.length}
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
                  <p>No matching entries. Try a year, “Moon”, or “Egypt”.</p>
                )}
              </div>
            </>
          )}
          {panel === "about" && (
            <>
              <div className="eyebrow">THE CINEMATIC TIME MACHINE</div>
              <h2>
                You direct
                <br />
                <em>the journey.</em>
              </h2>
              <div className="about-note">
                <p>
                  This local build proves a continuous scroll-controlled camera,
                  reversible skeletal animation, current-and-adjacent scene
                  streaming, historical navigation, and documentary focus
                  panels. It is an engine preview, not a finished photorealistic
                  historical reconstruction.
                </p>
                <p>
                  The available 3D catalog supplies untextured architecture and
                  vehicles but no authentic animated civilian, healthcare,
                  historical, or dinosaur models. Stock character rigs validate
                  animation engineering; they do not represent verified
                  historical clothing or healthcare staff.
                </p>
                <p>
                  Production still requires licensed, detailed environments,
                  period-specific rigged inhabitants, material textures,
                  animation sets, historical review, and cinematic sound assets.
                  Those gaps are recorded in the project’s production plan.
                </p>
              </div>
              <div className="settings-row">
                <div>
                  <strong>Gentler motion</strong>
                  <p>
                    Use the photographic archive view with the same historical
                    controls.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-label="Gentler motion"
                  aria-checked={reduced}
                  className={`toggle ${reduced ? "on" : ""}`}
                  onClick={() => setReduced(!reduced)}
                >
                  <span />
                </button>
              </div>
              <a href="/archive/" className="source-link">
                <span>
                  Open the readable archive
                  <small>
                    Detailed historical references and saved discoveries
                  </small>
                </span>
                <ArrowUpRight size={18} />
              </a>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
