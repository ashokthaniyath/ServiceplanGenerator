import React, { useState } from 'react';

// Asset image lookup: files dropped into the /assets folder are served from the site root.
// e.g. assets/images/variant-raven-black.png -> /images/variant-raven-black.png
const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

interface EarbudsCaseMockupProps {
  colorHex: string;
  secondaryHex?: string;
  name: string;
  imageUrl?: string;
  isSmartVariant?: boolean;
  className?: string;
  showNameBelow?: boolean;
}

export const EarbudsCaseMockup: React.FC<EarbudsCaseMockupProps> = ({
  colorHex,
  secondaryHex = '#1e293b',
  name,
  imageUrl,
  isSmartVariant,
  className = '',
  showNameBelow = true,
}) => {
  // Prefer an explicit imageUrl, then a variant image file from /assets, then the SVG render
  const [assetFailed, setAssetFailed] = useState(false);
  const assetUrl = `/images/variant-${slugify(name)}.png`;
  const resolvedImageUrl = imageUrl || (!assetFailed ? assetUrl : undefined);

  const isLight = colorHex.toLowerCase() === '#f3f4f6' || colorHex.toLowerCase() === '#ffffff' || colorHex.toLowerCase() === '#f9fafb';
  const textColor = isLight ? '#0f172a' : '#f8fafc';
  const strokeColor = isLight ? '#cbd5e1' : '#334155';

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/5 border border-slate-200 transition-all hover:shadow-md ${className}`}>
      <div className="relative w-full aspect-square max-h-36 flex items-center justify-center overflow-hidden">
        {resolvedImageUrl ? (
          <img
            src={resolvedImageUrl}
            alt={name}
            className="w-full h-full object-contain border-0 outline-none mx-auto"
            referrerPolicy="no-referrer"
            onError={() => {
              if (!imageUrl) setAssetFailed(true);
            }}
          />
        ) : (
          /* SVG Earbuds & Charging Case Graphic */
          <svg viewBox="0 0 200 200" className="w-full h-full max-h-36 drop-shadow-md">
            {/* Charging Case Body */}
            <rect
              x="35"
              y="45"
              width="130"
              height="115"
              rx="38"
              fill={colorHex}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* Case Lid Seam */}
            <line
              x1="35"
              y1="82"
              x2="165"
              y2="82"
              stroke={isLight ? '#94a3b8' : '#475569'}
              strokeWidth="2"
              strokeDasharray="2 2"
            />
            {/* Subtle Metallic Trim / Hinge */}
            <rect
              x="85"
              y="80"
              width="30"
              height="5"
              rx="2.5"
              fill={secondaryHex}
              opacity="0.8"
            />
            {/* Center LED Indicator */}
            <circle
              cx="100"
              cy="115"
              r="3.5"
              fill={isLight ? '#22c55e' : '#38bdf8'}
              className="animate-pulse"
            />
            {/* boAt / Dolby Branding on Case */}
            <text
              x="60"
              y="72"
              fill={textColor}
              fontSize="8"
              fontFamily="sans-serif"
              fontWeight="bold"
              opacity="0.75"
            >
              Dolby Audio
            </text>
            <text
              x="125"
              y="72"
              fill={textColor}
              fontSize="9"
              fontFamily="sans-serif"
              fontWeight="900"
              letterSpacing="0.5"
              opacity="0.85"
            >
              boAt
            </text>

            {/* Left Earbud in Dock */}
            <g transform="translate(58, 48) scale(0.65)">
              <ellipse cx="25" cy="20" rx="14" ry="18" fill={secondaryHex} stroke={strokeColor} strokeWidth="2" />
              <rect x="20" y="24" width="10" height="36" rx="5" fill={colorHex} stroke={strokeColor} strokeWidth="2" />
              <circle cx="25" cy="28" r="2.5" fill="#38bdf8" />
            </g>

            {/* Right Earbud in Dock */}
            <g transform="translate(108, 48) scale(0.65)">
              <ellipse cx="25" cy="20" rx="14" ry="18" fill={secondaryHex} stroke={strokeColor} strokeWidth="2" />
              <rect x="20" y="24" width="10" height="36" rx="5" fill={colorHex} stroke={strokeColor} strokeWidth="2" />
              <circle cx="25" cy="28" r="2.5" fill="#38bdf8" />
            </g>
          </svg>
        )}

        {isSmartVariant && (
          <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-white rounded-full shadow">
            SMART
          </span>
        )}
      </div>

      {showNameBelow && (
        <div className="mt-2 text-center w-full">
          <p className="text-xs font-semibold text-slate-800 truncate">{name}</p>
        </div>
      )}
    </div>
  );
};

export const HearablesAppScreenMockup: React.FC<{
  tabType: 'sound' | 'touch' | 'system';
  title: string;
  className?: string;
  imageUrl?: string;
}> = ({ tabType, title, className = '', imageUrl }) => {
  // A user-uploaded picture always takes priority and is what appears in the final document.
  if (imageUrl) {
    return (
      <div className={`w-full max-w-42 sm:max-w-44.5 mx-auto ${className}`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-81.25 object-contain rounded-xl border border-slate-200 bg-white"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Otherwise render the built-in vector mockup (crisp, complete, resolution-independent).
  return (
    <div data-mockup={tabType} className={`w-full max-w-42 sm:max-w-44.5 h-81.25 bg-slate-950 text-white rounded-xl p-2.5 border border-slate-800 shadow-sm flex flex-col font-sans text-xs select-none mx-auto ${className}`}>
      {/* Top Status Bar */}
      <div className="flex justify-between items-center text-[9px] text-slate-400 pb-1.5 border-b border-slate-800">
        <span>12:30</span>
        <span className="font-semibold text-slate-200 text-[9px] truncate max-w-22.5">boAt Hearables</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[8px]">90%</span>
        </div>
      </div>

      {/* Earbuds Render in App Header */}
      <div className="py-1.5 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-6 bg-slate-300 rounded-full border border-slate-400"></div>
            <div className="w-2.5 h-6 bg-slate-300 rounded-full border border-slate-400"></div>
          </div>
        </div>
        <div className="flex gap-2.5 text-[8px] text-slate-400 mt-1">
          <span>L: 90%</span>
          <span>Case: 80%</span>
          <span>R: 90%</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-around bg-slate-900 rounded-md p-0.5 text-[9px] mb-1.5 font-medium">
        <span className={`px-1.5 py-0.5 rounded text-[8.5px] ${tabType === 'sound' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'}`}>
          Sound
        </span>
        <span className={`px-1.5 py-0.5 rounded text-[8.5px] ${tabType === 'touch' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}>
          Touch
        </span>
        <span className={`px-1.5 py-0.5 rounded text-[8.5px] ${tabType === 'system' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}>
          System
        </span>
      </div>

      {/* Tab Specific Content */}
      <div className="flex-1 overflow-hidden space-y-1.5 text-[9px]">
        {tabType === 'sound' && (
          <>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-400 text-[8.5px]">Dolby Audio</span>
                <span className="w-5 h-2.5 bg-red-600 rounded-full flex items-center justify-end px-0.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </div>
              <p className="text-[7.5px] text-slate-400 mt-0.5">Spatial Cinema Staging</p>
            </div>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
              <span className="font-semibold text-slate-300 text-[8px]">Equalizer Modes</span>
              <div className="grid grid-cols-3 gap-0.5 mt-1">
                <span className="bg-red-950/60 text-red-300 border border-red-800 text-center py-0.5 rounded text-[7px] font-bold">
                  Balanced
                </span>
                <span className="bg-slate-800 text-slate-300 text-center py-0.5 rounded text-[7px]">Pop</span>
                <span className="bg-slate-800 text-slate-300 text-center py-0.5 rounded text-[7px]">Rock</span>
                <span className="bg-slate-800 text-slate-300 text-center py-0.5 rounded text-[7px]">Jazz</span>
                <span className="bg-slate-800 text-slate-300 text-center py-0.5 rounded text-[7px]">Club</span>
                <span className="bg-slate-800 text-slate-300 text-center py-0.5 rounded text-[7px]">Custom</span>
              </div>
            </div>
            <div className="bg-slate-900 p-1 rounded flex items-center justify-between text-[7.5px] text-slate-400">
              <span>Streaming Integration</span>
              <span className="text-red-400 font-bold">JioSaavn / KuKu FM</span>
            </div>
          </>
        )}

        {tabType === 'touch' && (
          <>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800 space-y-0.5">
              <div className="text-blue-400 font-bold text-[8px]">LEFT EARBUD (CTC)</div>
              <div className="flex justify-between text-slate-300 text-[7.5px]">
                <span>1 Tap:</span>
                <span className="text-slate-400">Accept Call</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[7.5px]">
                <span>2 Taps:</span>
                <span className="text-slate-400">Dolby / Reject</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[7.5px]">
                <span>3 Taps:</span>
                <span className="text-slate-400">Prev Track</span>
              </div>
            </div>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800 space-y-0.5">
              <div className="text-blue-400 font-bold text-[8px]">RIGHT EARBUD (CTC)</div>
              <div className="flex justify-between text-slate-300 text-[7.5px]">
                <span>2 Taps:</span>
                <span className="text-blue-300 font-semibold">BEAST™ (45ms)</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[7.5px]">
                <span>3 Taps:</span>
                <span className="text-slate-400">Next Track</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[7.5px]">
                <span>Long Press:</span>
                <span className="text-slate-400">Voice Assistant</span>
              </div>
            </div>
          </>
        )}

        {tabType === 'system' && (
          <>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-200 text-[8px]">Multipoint Connect</div>
                <div className="text-[7px] text-slate-400">Dual link pairing</div>
              </div>
              <span className="w-5 h-2.5 bg-emerald-600 rounded-full flex items-center justify-end px-0.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </div>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-200 text-[8px]">In-Ear Detection</div>
                <div className="text-[7px] text-slate-400">Auto pause sensor</div>
              </div>
              <span className="w-5 h-2.5 bg-emerald-600 rounded-full flex items-center justify-end px-0.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </div>
            <div className="bg-slate-900 p-1 rounded border border-slate-800 flex justify-between text-[7.5px]">
              <span className="text-slate-300">Firmware</span>
              <span className="text-emerald-400 font-mono">v0.0.0.19</span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Smart Diagnostics Bar */}
      <div className="mt-auto pt-1.5">
        <div className="bg-red-600 text-white text-center py-1 rounded font-bold text-[8px] shadow-xs">
          Diagnose My Device 🎧
        </div>
      </div>
    </div>
  );
};
