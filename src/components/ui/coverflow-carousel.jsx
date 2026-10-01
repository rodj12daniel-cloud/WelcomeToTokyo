import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./coverflow-carousel.css";

const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : useEffect;

export function CoverflowCarousel({
  slides = [],
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(148px, 22vw, 260px)",
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  label = "Cover carousel",
  className = "",
}) {
  const count = slides.length;
  const frameRef = useRef(null);
  const cardRefs = useRef([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const widthRef = useRef(0);
  const rafRef = useRef(null);
  const dragRef = useRef(null);
  const [selected, setSelected] = useState(0);

  const indexAt = (position) => ((Math.round(position) % count) + count) % count;

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width || !count) return;
    const pitch = width * (1 + gap);
    const position = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      let offset = index - position;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
      card.style.transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      card.setAttribute("aria-hidden", distance > 0.5 ? "true" : "false");
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = (target) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    targetRef.current = target;
    setSelected(indexAt(target));

    const step = () => {
      const remaining = target - posRef.current;
      if (Math.abs(remaining) < 0.0004) {
        posRef.current = target;
        paint();
        rafRef.current = null;
        return;
      }
      posRef.current += remaining * 0.16;
      paint();
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const clamp = (position) => loop ? position : Math.max(0, Math.min(count - 1, position));
  const goTo = (index) => {
    const target = loop ? index + Math.round((targetRef.current - index) / count) * count : index;
    settle(clamp(target));
  };
  const nudge = (by) => settle(clamp(Math.round(targetRef.current) + by));

  const handlePointerDown = (event) => {
    if (!count || event.button !== 0) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      velocity: 0,
      time: performance.now(),
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.velocity = ((posRef.current - previous) / Math.max(now - drag.time, 1)) * 1000;
    drag.time = now;

    const nextSelected = indexAt(posRef.current);
    setSelected((current) => current === nextSelected ? current : nextSelected);
    paint();
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = Math.max(-2, Math.min(2, drag.velocity * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || !count) return undefined;
    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  if (!count) return null;
  const active = slides[selected];

  return (
    <div
      className={`coverflow-carousel${className ? ` ${className}` : ""}`}
      style={{ "--cf-card": cardWidth, "--cf-perspective": perspective }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="coverflow-carousel__stage">
        <div
          ref={frameRef}
          className="coverflow-carousel__frame"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          style={{ perspective: `calc(var(--cf-card) * var(--cf-perspective))` }}
        >
          <div className="coverflow-carousel__cards" style={{ height: "var(--cf-card)" }}>
            {slides.map((slide, index) => (
              <div
                key={`${slide.title}-${index}`}
                ref={(node) => { cardRefs.current[index] = node; }}
                className="coverflow-carousel__card"
                style={{ width: "var(--cf-card)" }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
              >
                <img src={slide.src} alt={slide.alt} draggable="false" />
              </div>
            ))}
          </div>
        </div>

        {showNavigation && count > 1 && (
          <>
            <button className="coverflow-carousel__nav coverflow-carousel__nav--prev" type="button" onClick={() => nudge(-1)} aria-label="Previous place">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button className="coverflow-carousel__nav coverflow-carousel__nav--next" type="button" onClick={() => nudge(1)} aria-label="Next place">
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {showCaption && active && (
        <div className="coverflow-carousel__caption" aria-live="polite">
          <p className="coverflow-carousel__title">{active.title}</p>
          {active.subtitle && <p className="coverflow-carousel__subtitle">{active.subtitle}</p>}
          {active.meta?.length > 0 && (
            <dl className="coverflow-carousel__meta">
              {active.meta.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {active.mapUrl && <a className="coverflow-carousel__map-link" href={active.mapUrl} target="_blank" rel="noopener noreferrer">Find on map <span aria-hidden="true">↗</span></a>}
        </div>
      )}

      {showPagination && count > 1 && (
        <div className="coverflow-carousel__pagination" aria-label="Choose a place">
          {slides.map((slide, index) => (
            <button
              key={`${slide.title}-pagination`}
              type="button"
              className={index === selected ? "is-active" : ""}
              aria-label={`Show ${slide.title}`}
              aria-current={index === selected ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}