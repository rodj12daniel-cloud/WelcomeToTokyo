import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./animated-tabs.css";

export function AnimatedTabs({
  tabs = [],
  defaultTab,
  ariaLabel = "Fare options",
  className = "",
}) {
  const generatedId = useId().replaceAll(":", "");
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const reduceMotion = useReducedMotion();
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(defaultTab ?? tabs[0]?.id ?? "");
    }
  }, [activeTab, defaultTab, tabs]);

  if (!tabs.length || !active) return null;

  const handleKeyDown = (event, index) => {
    let nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    document.getElementById(`${generatedId}-tab-${nextTab.id}`)?.focus();
  };

  return (
    <div className={`animated-tabs ${className}`.trim()}>
      <div className="animated-tabs__list" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab, index) => {
          const selected = tab.id === active.id;
          return (
            <button
              key={tab.id}
              id={`${generatedId}-tab-${tab.id}`}
              className={`animated-tabs__tab${selected ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${generatedId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span>{tab.label}</span>
              {selected && !reduceMotion && (
                <motion.span
                  className="animated-tabs__indicator"
                  layoutId={`${generatedId}-active-indicator`}
                  transition={{ type: "spring", duration: 0.55 }}
                />
              )}
              {selected && reduceMotion && <span className="animated-tabs__indicator" />}
            </button>
          );
        })}
      </div>

      <div
        className="animated-tabs__panel"
        id={`${generatedId}-panel`}
        role="tabpanel"
        aria-labelledby={`${generatedId}-tab-${active.id}`}
        tabIndex={0}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            className="animated-tabs__content"
            initial={reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: "easeOut" }}
          >
            {active.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}