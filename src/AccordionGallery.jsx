import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./AccordionGallery.css";

const EMPTY_ITEMS = [];

export default function AccordionGallery({
  items = EMPTY_ITEMS,
  defaultIndex = 2,
  accentColor = "#d4a46b",
  overlayColor = "#121a15",
  textColor = "#f1f2ec",
  height = 500,
  gap = 8,
  radius = 4,
  expandRatio = 0.46,
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 5,
  stagger = 0.06,
  trigger = "hover",
  showLabels = true,
  grayscale = false,
  onActiveClick,
  className = "",
}) {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const barRefs = useRef([]);
  const textRefs = useRef([]);
  const timelineRef = useRef(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)));
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const applyLayout = useCallback((animate) => {
    const panels = panelRefs.current;
    if (!panels.length || !count) return;

    const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9);
    const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;
    const mediaSize = mediaSizeRef.current;
    timelineRef.current?.kill();

    const transitionDuration = animate && !prefersReduced ? duration : 0;
    const timeline = gsap.timeline();

    panels.forEach((panel, index) => {
      if (!panel) return;
      const isActive = index === active;
      const media = mediaRefs.current[index];
      const bar = barRefs.current[index];
      const text = textRefs.current[index];
      const rotation = isActive ? 0 : index < active ? tilt : -tilt;
      const rotationStyle = { rotateY: rotation };

      timeline.to(panel, {
        flexGrow: isActive ? grow : 1,
        ...rotationStyle,
        "--ag-dim": isActive ? 0 : 0.35,
        duration: transitionDuration,
        ease,
      }, 0);

      if (media) {
        const drift = Math.max(-1.5, Math.min(1.5, active - index));
        const shift = drift * parallax * mediaSize * 0.06;
        timeline.to(media, {
          xPercent: -50,
          yPercent: -50,
          x: isActive ? 0 : shift,
          y: 0,
          "--ag-gray": grayscale && !isActive ? 1 : 0,
          duration: transitionDuration,
          ease,
        }, 0);
      }

      if (showLabels && bar && text) {
        if (isActive) {
          timeline.to([bar, text], {
            opacity: 1,
            x: 0,
            duration: transitionDuration,
            ease,
            stagger: prefersReduced ? 0 : stagger,
          }, 0);
        } else {
          timeline.to([bar, text], {
            opacity: 0,
            x: -14,
            duration: transitionDuration * 0.6,
            ease,
          }, 0);
        }
      }
    });

    timelineRef.current = timeline;
  }, [active, count, duration, ease, expandRatio, grayscale, parallax, prefersReduced, showLabels, stagger, tilt]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const usable = Math.max(rect.width - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      element.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [applyLayout, count, expandRatio, gap]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(() => () => timelineRef.current?.kill(), []);

  const handleClick = (index, event) => {
    if (index !== active) {
      event.preventDefault();
      setActive(index);
      return;
    }
    if (onActiveClick) {
      event.preventDefault();
      onActiveClick(items[index], index, event);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index + 1) % count);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index - 1 + count) % count);
    } else if ((event.key === "Enter" || event.key === " ") && index === active && onActiveClick) {
      event.preventDefault();
      onActiveClick(items[index], index, event);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${className ? ` ${className}` : ""}`}
      style={{
        "--ag-accent": accentColor,
        "--ag-overlay": overlayColor,
        "--ag-text": textColor,
        "--ag-gap": `${gap}px`,
        "--ag-radius": `${radius}px`,
        height: `${height}px`,
      }}
      role="list"
      aria-label="Tokyo photo gallery"
    >
      {items.map((item, index) => {
        const isActive = index === active;
        const Tag = item.link ? "a" : "div";

        return (
          <Tag
            key={item.id ?? index}
            ref={(element) => { panelRefs.current[index] = element; }}
            className={`ag-panel${isActive ? " ag-panel--active" : ""}`}
            href={item.link || undefined}
            onClick={(event) => handleClick(index, event)}
            onMouseEnter={() => { if (trigger === "hover") setActive(index); }}
            onFocus={() => setActive(index)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? "true" : undefined}
            aria-label={item.label || "Gallery image"}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={(element) => { mediaRefs.current[index] = element; }}>
                <img src={item.image} alt={item.alt || item.label || ""} draggable="false" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span className="ag-panel__bar" ref={(element) => { barRefs.current[index] = element; }} />
                <span className="ag-panel__text" ref={(element) => { textRefs.current[index] = element; }}>
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}