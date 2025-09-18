import { memo, useMemo, useState, useEffect } from "react";
import reactLocal from "../assets/tech-icons/react.svg?url";
import jsLocal from "../assets/tech-icons/javascript.svg?url";
import tsLocal from "../assets/tech-icons/typescript.svg?url";
import htmlLocal from "../assets/tech-icons/html5.svg?url";
import cssLocal from "../assets/tech-icons/css3.svg?url";
import figmaLocal from "../assets/tech-icons/figma.svg?url";
import gitLocal from "../assets/tech-icons/git.svg?url";
import githubLocal from "../assets/tech-icons/github.svg?url";
import nodeLocal from "../assets/tech-icons/nodejs.svg?url";
import javaLocal from "../assets/tech-icons/java.svg?url";
import pythonLocal from "../assets/tech-icons/python.svg?url";
import mysqlLocal from "../assets/tech-icons/mysql.svg?url";
import mongoLocal from "../assets/tech-icons/mongodb.svg?url";
import vscodeLocal from "../assets/tech-icons/vscode.svg?url";
import dockerLocal from "../assets/tech-icons/docker.svg?url";
import bootstrapLocal from "../assets/tech-icons/bootstrap.svg?url";

export const TechBackgroundSVG = memo(
  function TechBackgroundSVG() {
  // Use local SVGs only (no external network dependency)
  // Keep order stable for animation variety
    const localIcons = [
      reactLocal,
      jsLocal,
      tsLocal,
      htmlLocal,
      cssLocal,
      figmaLocal,
      gitLocal,
      githubLocal,
      nodeLocal,
      javaLocal,
      pythonLocal,
      mysqlLocal,
      mongoLocal,
      vscodeLocal,
      dockerLocal,
      bootstrapLocal,
    ];
  // Always use local icons
  const iconsToUse = localIcons;

    // Pause animations when tab is hidden
    const [paused, setPaused] = useState(false);
    useEffect(() => {
      const onVis = () => setPaused(document.hidden);
      document.addEventListener('visibilitychange', onVis);
      onVis();
      return () => document.removeEventListener('visibilitychange', onVis);
    }, []);

    // Mobile/coarse-pointer fallback: animate HTML <img> icons instead of SVG <image>
    const isCoarsePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  if (isCoarsePointer) {
      // Precompute positions/durations to keep stable between renders
      const items = useMemo(() => {
        const arr = [] as { src: string; left: number; delay: number; duration: number; size: number }[];
        const count = 16;
        for (let i = 0; i < count; i++) {
          const src = iconsToUse[i % iconsToUse.length];
          const left = 5 + (i * (90 / (count - 1))); // 5% .. 95%
          const delay = (i % 4) * 1.3; // stagger
          const duration = 10 + (i % 5) * 2; // 10s..18s
          const size = 18 + (i % 4) * 3; // 18..27 px
          arr.push({ src, left, delay, duration, size });
        }
        return arr;
      }, []);

      return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-50">
          <style>{`
            @keyframes fallY { 0% { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.9; } 100% { transform: translateY(110vh); opacity: 0; } }
            .bg-icon { position: absolute; top: 0; will-change: transform, opacity; animation-name: fallY; animation-timing-function: linear; animation-iteration-count: infinite; image-rendering: -webkit-optimize-contrast; }
          `}</style>
          {items.map((it, idx) => (
            <img
              key={idx}
              src={it.src}
              alt=""
              className="bg-icon"
              style={{ left: `${it.left}%`, width: it.size, height: it.size, animationDuration: `${it.duration}s`, animationDelay: `${it.delay}s`, animationPlayState: paused ? 'paused' : 'running' }}
            />
          ))}
        </div>
      );
    }

    // Create column data with different icons, durations, and delays
  const createColumn = (
      x: number,
      startY: number,
      duration: number,
      delay: number,
      iconIndex: number,
    ) => {
  const iconUrl = iconsToUse[iconIndex % iconsToUse.length];

      return (
        <g
          key={`column-${x}-${iconIndex}`}
          transform={`translate(${x}, 0)`}
        >
          {/* Tech icon (CSS animation for broader mobile compatibility) */}
          <image
            href={iconUrl}
            xlinkHref={iconUrl}
            x="-12"
            y={startY}
            width="24"
            height="24"
            className="icon-fall"
            style={{
              // Per-icon timing
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              animationPlayState: paused ? 'paused' : 'running',
            }}
          />
        </g>
      );
    };

    // Generate fewer columns for better performance
    const columns = useMemo(() => {
      const cols = [];
      for (let i = 0; i < 10; i++) {
        // Increased to 10 to ensure Figma icon appears
        const x = 100 + i * 180; // Adjusted spacing
        const startY = -50 + (i % 4) * 25; // Varied positioning
        const duration = 12 + (i % 4) * 2; // Varied duration
        const delay = (i % 4) * 2; // Varied delay
        const iconIndex = i; // Direct mapping to ensure all icons appear

        cols.push(
          createColumn(x, startY, duration, delay, iconIndex),
        );
      }
      return cols;
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-50">
        {/* Inline SVG Matrix Background with Real Tech Icons */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          style={{
            imageRendering: "crisp-edges",
            shapeRendering: "geometricPrecision",
          }}
        >
          <defs>
            {/* CSS animation for icon fall (avoids SMIL issues on mobile browsers) */}
            <style>{`
              @keyframes fall {
                0% { transform: translateY(-60px); opacity: 0; }
                10% { opacity: 0.85; }
                100% { transform: translateY(800px); opacity: 0; }
              }
              .icon-fall {
                animation-name: fall;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                will-change: transform, opacity;
              }
            `}</style>
            {/* Matrix green gradient for trails */}
            <linearGradient
              id="matrixTrail"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#00ff41", stopOpacity: 1 }}
              />
              <stop
                offset="15%"
                style={{
                  stopColor: "#00cc33",
                  stopOpacity: 0.9,
                }}
              />
              <stop
                offset="40%"
                style={{
                  stopColor: "#009926",
                  stopOpacity: 0.7,
                }}
              />
              <stop
                offset="70%"
                style={{
                  stopColor: "#006619",
                  stopOpacity: 0.4,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "#003d0f",
                  stopOpacity: 0.1,
                }}
              />
            </linearGradient>

            {/* Removed icon filters for better mobile support */}

            {/* Subtle background tech pattern */}
            <pattern
              id="techPattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <rect width="40" height="40" fill="transparent" />
              <circle
                cx="20"
                cy="20"
                r="0.5"
                fill="#00ff41"
                opacity="0.03"
              />
              <rect
                x="18"
                y="15"
                width="4"
                height="0.5"
                fill="#00ff41"
                opacity="0.02"
              />
              <rect
                x="18"
                y="24.5"
                width="4"
                height="0.5"
                fill="#00ff41"
                opacity="0.02"
              />
            </pattern>
          </defs>

          {/* Background tech pattern - static for better performance */}
          <rect
            width="100%"
            height="100%"
            fill="url(#techPattern)"
          />

          {/* Generated columns with real tech icons */}
          {columns}
        </svg>
      </div>
    );
  },
);