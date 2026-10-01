import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./progressive-carousel.css";

const ProgressSliderContext = createContext(null);

export function useProgressSliderContext() {
  const context = useContext(ProgressSliderContext);
  if (!context) {
    throw new Error("ProgressSlider children must be rendered inside ProgressSlider.");
  }
  return context;
}

export function ProgressSlider({
  children,
  duration = 6000,
  fastDuration = 400,
  vertical = false,
  activeSlider,
  className = "",
}) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(activeSlider);
  const [progress, setProgress] = useState(0);
  const [isFastForward, setIsFastForward] = useState(false);
  const frame = useRef(0);
  const targetValue = useRef(null);
  const progressValue = useRef(0);

  const sliderContent = useMemo(
    () => React.Children.toArray(children).find((child) => React.isValidElement(child) && child.type === SliderContent),
    [children],
  );
  const sliderValues = useMemo(
    () => React.Children.toArray(sliderContent?.props.children)
      .filter((child) => React.isValidElement(child) && typeof child.props.value === "string")
      .map((child) => child.props.value),
    [sliderContent],
  );

  useEffect(() => {
    if (activeSlider && activeSlider !== active) {
      setActive(activeSlider);
      setProgress(0);
    }
  }, [activeSlider]);

  useEffect(() => {
    if (sliderValues.length > 0 && !sliderValues.includes(active)) {
      setActive(sliderValues[0]);
    }
  }, [active, sliderValues]);

  useEffect(() => {
    if (!sliderValues.length) return undefined;

    const currentDuration = isFastForward ? fastDuration : duration;
    const startProgress = isFastForward ? progressValue.current : 0;
    const startTime = performance.now();
    if (!isFastForward) {
      progressValue.current = 0;
      setProgress(0);
    }

    const animate = (now) => {
      const fraction = Math.min((now - startTime) / currentDuration, 1);
      const nextProgress = startProgress + (100 - startProgress) * fraction;
      progressValue.current = nextProgress;
      setProgress(nextProgress);

      if (fraction < 1) {
        frame.current = requestAnimationFrame(animate);
        return;
      }

      if (isFastForward && targetValue.current) {
        setActive(targetValue.current);
        targetValue.current = null;
        setIsFastForward(false);
      } else {
        const index = sliderValues.indexOf(active);
        setActive(sliderValues[(index + 1) % sliderValues.length]);
      }
      progressValue.current = 0;
      setProgress(0);
    };

    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, [active, duration, fastDuration, isFastForward, reducedMotion, sliderValues]);

  const handleButtonClick = (value) => {
    if (value === active) return;
    if (reducedMotion) {
      progressValue.current = 0;
      setProgress(0);
      setActive(value);
      return;
    }
    targetValue.current = value;
    setIsFastForward(true);
  };

  const contextValue = {
    active,
    progress,
    handleButtonClick,
    vertical,
  };

  return (
    <ProgressSliderContext.Provider value={contextValue}>
      <div
        className={`progressive-carousel${vertical ? " progressive-carousel--vertical" : ""}${className ? ` ${className}` : ""}`}
      >
        {children}
      </div>
    </ProgressSliderContext.Provider>
  );
}

export function SliderContent({ children, className = "" }) {
  const { active } = useProgressSliderContext();
  const slides = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.type === SliderWrapper);
  const activeSlide = slides.find((slide) => slide.props.value === active);

  return (
    <div className={`progressive-carousel__content ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {activeSlide && (
          <motion.div
            key={activeSlide.props.value}
            className={`progressive-carousel__slide ${activeSlide.props.className ?? ""}`}
            initial={{ opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {activeSlide.props.children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SliderWrapper({ children }) {
  return children;
}

export function SliderBtnGroup({ children, className = "" }) {
  return <div className={`progressive-carousel__controls ${className}`}>{children}</div>;
}

export function SliderBtn({
  children,
  value,
  className = "",
  progressBarClass = "",
  onSelect,
}) {
  const { active, progress, handleButtonClick, vertical } = useProgressSliderContext();
  const selected = active === value;

  return (
    <button
      type="button"
      className={`progressive-carousel__button${selected ? " is-active" : ""}${className ? ` ${className}` : ""}`}
      onClick={() => {
        handleButtonClick(value);
        onSelect?.(value);
      }}
      aria-pressed={selected}
    >
      {children}
      <span
        className={`progressive-carousel__progress${vertical ? " is-vertical" : ""}`}
        role="progressbar"
        aria-label={`${value} slide progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={selected ? Math.round(progress) : 0}
      >
        <span
          className={`progressive-carousel__progress-fill ${progressBarClass}`}
          style={{ [vertical ? "height" : "width"]: selected ? `${progress}%` : "0%" }}
        />
      </span>
    </button>
  );
}