"use client";

import { useEffect } from "react";

export function WebVitalsReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Only load web-vitals in development for debugging (optional package)
      import("web-vitals")
        .then((webVitals) => {
          const reportWebVital = (metric: {
            name: string;
            value: number;
            rating: string;
            entries?: unknown[];
          }) => {
            console.log(
              `[WebVitals] ${metric.name}:`,
              metric.value,
              metric.rating
            );

            // Track INP specifically for typing performance
            if (metric.name === "INP") {
              console.log(`[WebVitals] INP Details:`, {
                value: metric.value,
                rating: metric.rating,
                entries: metric.entries,
              });
            }
          };

          webVitals.onCLS(reportWebVital);
          webVitals.onFCP(reportWebVital);
          webVitals.onLCP(reportWebVital);
          webVitals.onTTFB(reportWebVital);
          webVitals.onINP(reportWebVital);
        })
        .catch(() => {
          // web-vitals not available, ignore
        });
    }
  }, []);

  return null;
}
