"use client";

import { useEffect, useState } from "react";

const sectionLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Feedback Router", href: "#feedback-router" },
  { label: "Launch Readiness", href: "#command-center" },
  { label: "Risks", href: "#risks" },
  { label: "Support Hub", href: "#support-hub" },
  { label: "Partner View", href: "#partner-view" },
  { label: "Insights", href: "#insights" },
  { label: "Role Mapping", href: "#demo-mapping" },
];

export function SectionNavigation() {
  const [activeHref, setActiveHref] = useState(sectionLinks[0].href);

  useEffect(() => {
    let frameId = 0;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 120;
      const isAtPageBottom =
        Math.ceil(window.scrollY + window.innerHeight) >=
        document.documentElement.scrollHeight - 2;

      if (isAtPageBottom) {
        setActiveHref(sectionLinks[sectionLinks.length - 1].href);
        return;
      }

      const currentLink = sectionLinks.reduce((current, link) => {
        const section = document.getElementById(link.href.slice(1));

        if (section && section.offsetTop <= scrollPosition) {
          return link.href;
        }

        return current;
      }, sectionLinks[0].href);

      setActiveHref(currentLink);
    };

    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        updateActiveSection();
        frameId = 0;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <nav className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 md:px-8">
        <div
          className="flex min-w-max gap-2 py-3"
          aria-label="Product Readiness OS sections"
        >
          {sectionLinks.map((link) => {
            const isActive = activeHref === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-700 text-white shadow-sm"
                    : "text-stone-700 hover:bg-teal-50 hover:text-teal-800"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
