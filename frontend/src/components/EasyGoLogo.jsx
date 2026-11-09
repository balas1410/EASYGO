import React from 'react';

/**
 * Custom 2D Wheelchair Logo for EASY GO
 * Features:
 * - Friendly human silhouette seated in a wheelchair
 * - Large wheelchair rear wheel and small front caster wheel
 * - Rounded geometric shapes with electric blue (#2563EB), cyan (#22D3EE), and teal (#14B8A6) accents
 * - Subtle wheel rotation animation support
 */
export default function EasyGoLogo({
  size = 44,
  showText = true,
  showTagline = false,
  animateWheel = false,
  className = ''
}) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-blue-600/15 via-cyan-400/15 to-teal-500/15 p-1.5 border border-cyan-400/30 shadow-sm"
        style={{ width: size + 8, height: size + 8 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="EASY GO 2D Wheelchair Logo"
        >
          <defs>
            <linearGradient id="easyGoPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="55%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
            <linearGradient id="easyGoWheelGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>

          {/* Friendly human head */}
          <circle cx="58" cy="23" r="11" fill="url(#easyGoPrimaryGrad)" />

          {/* Friendly seated torso & active forward arm */}
          <path
            d="M54 38 C54 38 68 43 74 51 C77 55 73 60 68 57 L57 49 L55 63 L78 63 C83 63 86 66 87 71 L91 87 C92 91 87 94 83 90 L78 72 L50 72 C45 72 43 68 44 62 L47 42 C48 38 51 37 54 38 Z"
            fill="url(#easyGoPrimaryGrad)"
          />

          {/* Wheelchair rounded backrest & seat frame */}
          <path
            d="M38 43 L38 71 L68 71"
            stroke="#14B8A6"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Frame strut to front wheel */}
          <path
            d="M68 71 L85 95"
            stroke="#22D3EE"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Large rear wheelchair wheel (rotates subtly when animateWheel=true) */}
          <g
            style={{
              transformOrigin: '48px 83px',
              animation: animateWheel ? 'spin 6s linear infinite' : 'none'
            }}
          >
            <circle
              cx="48"
              cy="83"
              r="24"
              stroke="url(#easyGoPrimaryGrad)"
              strokeWidth="6.5"
              fill="none"
            />
            <circle
              cx="48"
              cy="83"
              r="16"
              stroke="#22D3EE"
              strokeWidth="2.2"
              strokeDasharray="6 5"
              fill="none"
            />
            <line x1="48" y1="59" x2="48" y2="107" stroke="#22D3EE" strokeWidth="2" strokeOpacity="0.6" />
            <line x1="24" y1="83" x2="72" y2="83" stroke="#22D3EE" strokeWidth="2" strokeOpacity="0.6" />
            <circle cx="48" cy="83" r="5.5" fill="#14B8A6" />
          </g>

          {/* Small front caster wheel */}
          <g
            style={{
              transformOrigin: '85px 95px',
              animation: animateWheel ? 'spin 3s linear infinite' : 'none'
            }}
          >
            <circle
              cx="85"
              cy="95"
              r="10"
              stroke="url(#easyGoWheelGrad)"
              strokeWidth="5"
              fill="none"
            />
            <circle cx="85" cy="95" r="3.5" fill="#2563EB" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-lg sm:text-xl bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              EASY GO
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
              Mobility AI
            </span>
          </div>
          {showTagline && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Accessible Routes. Independent Journeys.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
