import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./scroll-gallery.css";
import OptimizedImage from "../OptimizedImage.jsx";

gsap.registerPlugin(ScrollTrigger);

const MASK_HIDDEN = "linear-gradient(to bottom, transparent 0%, transparent 100%)";
const MASK_REVEALED = "linear-gradient(to bottom, black 0%, black 100%)";

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function createStripBounds(count) {
  return Array.from({ length: count }, (_, index) => {
    const position = count - index - 1;
    const step = 100 / count;
    const upper = position * step;
    return {
      lower: (position + 1) * step,
      upperGap: upper - 0.1,
      delay: (index / count) * 0.5,
    };
  });
}

function buildStripMask(bounds, progress, revealSpeed) {
  const intervals = [];

  for (const strip of bounds) {
    const amount = clamp01((progress - strip.delay) * revealSpeed);
    if (amount <= 0) continue;
    const height = strip.lower - strip.upperGap;
    intervals.push({
      top: strip.lower - amount * height,
      bottom: strip.lower,
    });
  }

  if (!intervals.length) return MASK_HIDDEN;
  intervals.sort((a, b) => a.top - b.top);
  const merged = [];

  for (const interval of intervals) {
    const previous = merged.at(-1);
    if (previous && interval.top <= previous.bottom) {
      previous.bottom = Math.max(previous.bottom, interval.bottom);
    } else {
      merged.push({ ...interval });
    }
  }

  const stops = [];
  let cursor = 0;
  for (const { top, bottom } of merged) {
    if (top > cursor) stops.push(`transparent ${cursor}%`, `transparent ${top}%`);
    stops.push(`black ${top}%`, `black ${bottom}%`);
    cursor = bottom;
  }
  if (cursor < 100) stops.push(`transparent ${cursor}%`, "transparent 100%");
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

function setMask(image, value) {
  image.style.maskImage = value;
  image.style.webkitMaskImage = value;
}

export default function ScrollGallery({
  slides = [],
  prefixLabel = "Featured",
  scrollPerTransition = 80,
  initialDelay = 40,
  finalDelay = 40,
  stripsCount = 20,
  titleChangeThreshold = 0.3,
  imageScale = 1.25,
  className = "",
}) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const prefixRef = useRef(null);
  const countRef = useRef(null);
  const metaRef = useRef(null);
  const imageRefs = useRef([]);
  const currentTitleRef = useRef(0);

  useGSAP(() => {
    if (slides.length < 2 || !sectionRef.current) return;

    const images = imageRefs.current.filter(Boolean);
    if (images.length !== slides.length) return;

    const section = sectionRef.current;
    const title = titleRef.current;
    const stripBounds = createStripBounds(stripsCount);
    const totalDistance = initialDelay + finalDelay + (slides.length - 1) * scrollPerTransition;
    const scaleFrom = imageScale;
    const scaleTo = 1;
    const scaleStep = (scaleFrom - scaleTo) / 2;

    images.forEach((image, index) => {
      image.style.transform = `translate3d(0, 0, 0) scale(${scaleFrom})`;
      setMask(image, index === 0 ? MASK_REVEALED : MASK_HIDDEN);
    });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${(totalDistance * window.innerHeight) / 100}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true,
      refreshPriority: -1,
      onUpdate(self) {
        const scrollValue = clamp01(self.progress) * totalDistance;
        const imageProgress = Math.max(0, Math.min(slides.length - 1, (scrollValue - initialDelay) / scrollPerTransition));
        const currentIndex = Math.floor(imageProgress);
        const fraction = imageProgress - currentIndex;

        images.forEach((image, index) => {
          const difference = imageProgress - index;
          const scale = difference <= 0
            ? scaleFrom
            : difference >= 2
              ? scaleTo
              : scaleFrom - scaleStep * difference;
          image.style.transform = `translate3d(0, 0, 0) scale(${scale})`;

          if (index === 0) return;
          const layerProgress = imageProgress - (index - 1);
          if (layerProgress <= 0) {
            setMask(image, MASK_HIDDEN);
          } else if (layerProgress >= 1) {
            setMask(image, MASK_REVEALED);
          } else {
            setMask(image, buildStripMask(stripBounds, layerProgress, 2));
          }
        });

        if (title) {
          const nextTitleIndex = Math.min(
            Math.floor(imageProgress) + (fraction >= titleChangeThreshold ? 1 : 0),
            slides.length - 1,
          );
          if (nextTitleIndex !== currentTitleRef.current) {
            const previousTitleIndex = currentTitleRef.current;
            currentTitleRef.current = nextTitleIndex;
            const textTargets = [
              prefixRef.current,
              title,
              descriptionRef.current,
              countRef.current,
              metaRef.current,
            ].filter(Boolean);
            const direction = nextTitleIndex > previousTitleIndex ? -1 : 1;
            gsap.killTweensOf(textTargets);

            gsap.timeline()
              .to(textTargets, {
                y: `${direction * 120}%`,
                autoAlpha: 0,
                duration: 0.2,
                stagger: 0.025,
                ease: "power2.in",
              })
              .call(() => {
                title.textContent = slides[nextTitleIndex].title;
                if (descriptionRef.current) {
                  descriptionRef.current.textContent = slides[nextTitleIndex].description ?? "";
                }
                if (countRef.current) {
                  countRef.current.textContent = `${String(nextTitleIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
                }
                if (metaRef.current) {
                  metaRef.current.textContent = slides[nextTitleIndex].meta ?? "";
                }
              })
              .fromTo(textTargets, {
                y: `${direction * -120}%`,
                autoAlpha: 0,
              }, {
                y: "0%",
                autoAlpha: 1,
                duration: 0.28,
                stagger: 0.025,
                ease: "power2.out",
              });
          }
        }
      },
    });

    ScrollTrigger.refresh();
    return () => trigger.kill();
  }, {
    scope: sectionRef,
    dependencies: [slides, initialDelay, finalDelay, scrollPerTransition, stripsCount, titleChangeThreshold, imageScale],
    revertOnUpdate: true,
  });

  const singleSlide = slides.length < 2;

  return (
    <section
      className={`scroll-gallery${singleSlide ? " scroll-gallery--single" : ""}${className ? ` ${className}` : ""}`}
      ref={sectionRef}
      aria-label="Things to do in Tokyo"
    >
      <div className="scroll-gallery__images" aria-hidden="true">
        {slides.map((slide, index) => (
          <div className="scroll-gallery__image-frame" key={`${slide.title}-${index}`}>
            <OptimizedImage
              alt=""
              className="scroll-gallery__image"
              decoding="async"
              priority={index === 0}
              sizes="(max-width: 850px) 180vh, 100vw"
              ref={(element) => { imageRefs.current[index] = element; }}
              src={slide.image}
            />
          </div>
        ))}
      </div>
      {slides.length > 0 && (
        <div className="scroll-gallery__info">
          <div className="scroll-gallery__info-inner">
            <div className="scroll-gallery__prefix" ref={prefixRef}>{prefixLabel}</div>
            <div className="scroll-gallery__title-wrap">
              <h2 className="scroll-gallery__title" ref={titleRef}>{slides[0].title}</h2>
              {slides[0].description && <p className="scroll-gallery__description" ref={descriptionRef}>{slides[0].description}</p>}
            </div>
            <div className="scroll-gallery__side-info">
              <span className="scroll-gallery__count" ref={countRef}>01 / {String(slides.length).padStart(2, "0")}</span>
              {slides[0].meta && <span className="scroll-gallery__meta" ref={metaRef}>{slides[0].meta}</span>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}