import React, { useEffect, useRef, useState } from "react";
import "./sakura-editorial-poster.css";
import OptimizedImage from "./components/OptimizedImage.jsx";

export const SAKURA_EDITORIAL_DEFAULT_KEYWORDS = [
  { label: "Bloom" },
  { label: "Pause" },
  { label: "Return" },
];

const DEFAULT_BODY =
  "For a few still days the canopy turns pale pink, and the street below goes quiet. Walk while the color lasts - it is already leaving, petal by petal, into the wind.";
const DEFAULT_SCENE = "https://design-layer.com/dev/sakura-editorial-poster/hero-scene-bg.jpg";
const DEFAULT_FOREGROUND = "https://design-layer.com/dev/sakura-editorial-poster/hero-branch.png?v=2";

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function getScrollParent(element) {
  let node = element.parentElement;
  while (node) {
    const style = window.getComputedStyle(node);
    if (["auto", "scroll", "overlay"].includes(style.overflowY) && node.scrollHeight > node.clientHeight + 1) {
      return node === document.documentElement || node === document.body ? window : node;
    }
    node = node.parentElement;
  }
  return window;
}

function readScrollProgress(track, scrollRoot) {
  if (scrollRoot === window) {
    const scrollable = track.offsetHeight - window.innerHeight;
    return scrollable <= 0 ? 1 : clamp01(-track.getBoundingClientRect().top / scrollable);
  }
  const rootRect = scrollRoot.getBoundingClientRect();
  const trackRect = track.getBoundingClientRect();
  const scrollable = track.offsetHeight - scrollRoot.clientHeight;
  return scrollable <= 0 ? 1 : clamp01((rootRect.top - trackRect.top) / scrollable);
}

function splitTitle(title) {
  const chars = Array.from(title);
  const middle = Math.max(chars.length - 1, 1) / 2;
  return chars.map((char, index) => ({
    key: `${index}-${char === " " ? "space" : char}`,
    char: char === " " ? "\u00a0" : char,
    index,
    fromCenter: Math.abs(index - middle) / middle,
  }));
}

function revealForCharacter(progress, fromCenter) {
  const start = fromCenter * 0.55;
  const end = Math.min(1, start + 0.38);
  return clamp01((progress - start) / Math.max(0.001, end - start));
}

function PosterTitle({ title, progress }) {
  const wrapperRef = useRef(null);
  const probeRef = useRef(null);
  const [fontSize, setFontSize] = useState(null);
  const chars = splitTitle(title);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const probe = probeRef.current;
    if (!wrapper || !probe) return undefined;
    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      const next = (wrapper.clientWidth / Math.max(1, probe.scrollWidth)) * 100;
      if (Number.isFinite(next) && next > 0) setFontSize(next);
    };
    const observer = new ResizeObserver(fit);
    observer.observe(wrapper);
    const fonts = document.fonts;
    const onFontsLoaded = () => void fonts.ready.then(fit);
    fonts.addEventListener?.("loadingdone", onFontsLoaded);
    void fonts.load('800 100px "Saira Extra Condensed"').then(fit).catch(fit);
    fit();
    return () => {
      cancelled = true;
      observer.disconnect();
      fonts.removeEventListener?.("loadingdone", onFontsLoaded);
    };
  }, [title]);

  const titleStyle = {
    fontFamily: '"Saira Extra Condensed", "Arial Narrow", sans-serif',
    fontWeight: 800,
    letterSpacing: "0.02em",
  };

  return (
    <div className="sakura-poster-title-wrap" ref={wrapperRef}>
      <span className="sakura-poster-title-probe" ref={probeRef} style={{ ...titleStyle, fontSize: 100 }} aria-hidden="true">
        {title}
      </span>
      <h1 className="sakura-poster-title" style={{ ...titleStyle, fontSize: fontSize ? `${fontSize}px` : "24vw" }}>
        {chars.map((item) => {
          const amount = revealForCharacter(progress, item.fromCenter);
          const y = (1 - amount) * (18 + item.fromCenter * 24);
          const direction = item.index < chars.length / 2 ? 1 : -1;
          const x = (1 - amount) * item.fromCenter * 16 * direction;
          return (
            <span key={item.key} aria-hidden="true" style={{ opacity: amount, transform: `translate3d(${x}px, ${y}px, 0)` }}>
              {item.char}
            </span>
          );
        })}
        <span className="sakura-poster-sr-only">{title}</span>
      </h1>
    </div>
  );
}

export default function SakuraEditorialPoster({
  title = "SAKURA",
  keywords = SAKURA_EDITORIAL_DEFAULT_KEYWORDS,
  headline = "Petals Hold the Light | 花びらが光を抱く。",
  body = DEFAULT_BODY,
  subheadline = "Stay for the fall. 散るまで、見ていて。",
  footerLeft = "DesignLayer",
  footerCenter = "Vol. 01",
  footerRight = "03.26 2026",
  socialHandle = "@designlayer",
  sceneSrc = DEFAULT_SCENE,
  sceneAlt = "Soft bokeh cherry blossoms background",
  foregroundSrc = DEFAULT_FOREGROUND,
  foregroundAlt = "Cherry blossom branch in the foreground",
  height = "280vh",
  forceProgress,
  preview = false,
  className = "",
}) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(forceProgress ?? 0);
  const [stickyHeight, setStickyHeight] = useState(null);
  const locked = Number.isFinite(forceProgress);
  const fillViewport = locked || preview;
  const useSticky = !locked && !preview;
  const keywordItems = keywords.filter((item) => item.label.trim().length > 0);

  useEffect(() => {
    if (locked || preview) {
      setProgress(clamp01(forceProgress ?? 0));
      setStickyHeight(null);
      return undefined;
    }

    const track = trackRef.current;
    if (!track) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return undefined;
    }

    const scrollRoot = getScrollParent(track);
    let target = readScrollProgress(track, scrollRoot);
    let current = target;
    let frame = 0;
    const updateProgress = () => {
      const delta = target - current;
      current += Math.abs(delta) > 0.35 ? delta * 0.22 : delta * 0.14;
      if (Math.abs(delta) < 0.0008) current = target;
      setProgress(current);
      if (current !== target) frame = requestAnimationFrame(updateProgress);
      else frame = 0;
    };
    const scheduleUpdate = () => {
      target = readScrollProgress(track, scrollRoot);
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };
    const updateSize = () => {
      setStickyHeight(scrollRoot === window ? window.innerHeight : scrollRoot.clientHeight);
      scheduleUpdate();
    };

    updateSize();
    scrollRoot.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", updateSize);
    return () => {
      scrollRoot.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(frame);
    };
  }, [forceProgress, locked, preview]);

  const revealProgress = locked || preview ? clamp01(forceProgress ?? 0) : progress;
  const copyProgress = clamp01((revealProgress - 0.78) / 0.22);
  const panelHeight = useSticky && stickyHeight != null ? `${stickyHeight}px` : "100svh";

  return (
    <section
      ref={trackRef}
      className={`sakura-poster-track ${fillViewport ? "sakura-poster-fill" : ""} ${className}`}
      style={{ height: useSticky ? height : undefined }}
    >
      <div className={`sakura-poster-sticky ${useSticky ? "is-sticky" : ""}`} style={{ height: panelHeight }}>
        <article className="sakura-poster-frame">
          <div className="sakura-poster-visual">
            <OptimizedImage className="sakura-poster-scene" src={sceneSrc} alt={sceneAlt} priority sizes="100vw" draggable="false" />
            <PosterTitle title={title} progress={revealProgress / 0.4} />
            {foregroundSrc && <OptimizedImage className="sakura-poster-foreground" src={foregroundSrc} alt={foregroundAlt} priority sizes="100vw" draggable="false" />}
            <div className="sakura-poster-image-wash" aria-hidden="true" />
          </div>
          <div className="sakura-poster-copy" style={{ transform: `translate3d(0, ${(1 - copyProgress) * 100}%, 0)` }}>
            <div className="sakura-poster-keywords">
              {keywordItems.map((item) => <span key={item.label}>{item.label}</span>)}
            </div>
            <h2>{headline}</h2>
            <p className="sakura-poster-body">{body}</p>
            <p className="sakura-poster-subheadline">{subheadline}</p>
            <div className="sakura-poster-footer">
              <span>{footerLeft}</span><span>{footerCenter}</span><span>{footerRight}</span>
            </div>
            {socialHandle && <span className="sakura-poster-handle">{socialHandle}</span>}
          </div>
        </article>
      </div>
    </section>
  );
}