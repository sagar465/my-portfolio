import { memo, useMemo } from "react";
import reactLocal from "../assets/tech-icons/react.svg";
import jsLocal from "../assets/tech-icons/javascript.svg";
import tsLocal from "../assets/tech-icons/typescript.svg";
import htmlLocal from "../assets/tech-icons/html5.svg";
import cssLocal from "../assets/tech-icons/css3.svg";
import figmaLocal from "../assets/tech-icons/figma.svg";
import gitLocal from "../assets/tech-icons/git.svg";
import githubLocal from "../assets/tech-icons/github.svg";
import nodeLocal from "../assets/tech-icons/nodejs.svg";
import javaLocal from "../assets/tech-icons/java.svg";
import pythonLocal from "../assets/tech-icons/python.svg";
import mysqlLocal from "../assets/tech-icons/mysql.svg";
import mongoLocal from "../assets/tech-icons/mongodb.svg";
import vscodeLocal from "../assets/tech-icons/vscode.svg";
import dockerLocal from "../assets/tech-icons/docker.svg";
import bootstrapLocal from "../assets/tech-icons/bootstrap.svg";

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

    // Create column data with different icons, durations, and delays
    const createColumn = (
      x: number,
      startY: number,
      duration: number,
      delay: number,
      iconIndex: number,
    ) => {
  const iconUrl = iconsToUse[iconIndex % iconsToUse.length];
  const isFigma = iconUrl.includes('figma');

      return (
        <g
          key={`column-${x}-${iconIndex}`}
          transform={`translate(${x}, 0)`}
        >
          {/* Lead tech icon with glow */}
          <image
            href={iconUrl}
            xlinkHref={iconUrl}
            x="-12"
            y={startY}
            width="24"
            height="24"
            style={{ 
              filter: isFigma ? "url(#figmaGlow)" : "url(#techGlow)",
              opacity: isFigma ? "0.9" : undefined
            }}
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              values={`0,${startY - 50}; 0,${startY + 800}`}
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values={isFigma ? "0;0.9;0.9;0" : "0;0.8;0.8;0"}
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </image>
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

            {/* Tech icon glow filter */}
            <filter
              id="techGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation="2"
                result="coloredBlur"
              />
              <feColorMatrix
                in="coloredBlur"
                values="0 1 0.2 0 0  0 1 0.2 0 0  0 1 0.2 0 0  0 0 0 1 0"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Special Figma icon glow filter with purple tint */}
            <filter
              id="figmaGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation="3"
                result="coloredBlur"
              />
              <feColorMatrix
                in="coloredBlur"
                values="0.8 0 1 0 0  0.2 0 1 0 0  0.8 0 1 0 0  0 0 0 1 0"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

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