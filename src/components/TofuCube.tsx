import type { JSX } from 'solid-js';
import { createMemo } from 'solid-js';

type Props = {
  size: number;
  rotation: number;
  x: number;
  y: number;
  hue?: 'cream' | 'gold' | 'pink';
  spinSpeed?: number;
  delay?: number;
  /** stable pseudo-random source, e.g. tofu id */
  seed?: number;
};

const SKIN: Record<NonNullable<Props['hue']>, { body: string; bodyDeep: string; cheek: string; sauce: string }> = {
  cream: { body: '#fffaf0', bodyDeep: '#f3e8c8', cheek: '#ffb5b5', sauce: '#d63031' },
  gold:  { body: '#fff5d0', bodyDeep: '#f0d68c', cheek: '#ff9b6b', sauce: '#c0392b' },
  pink:  { body: '#fff0eb', bodyDeep: '#ffd7c8', cheek: '#ff8aa3', sauce: '#e74c3c' },
};

// 4 expression variants — mix of (eyes × mouth)
const EXPRESSIONS = [
  // 0: smiley closed eyes
  {
    eyes: (
      <>
        <path d="M30 56 Q36 50 42 56" stroke="#3a2a1a" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <path d="M58 56 Q64 50 70 56" stroke="#3a2a1a" stroke-width="2.6" fill="none" stroke-linecap="round" />
      </>
    ),
    mouth: <path d="M42 70 Q50 76 58 70" stroke="#3a2a1a" stroke-width="2.6" fill="none" stroke-linecap="round" />,
  },
  // 1: open eyes + small mouth
  {
    eyes: (
      <>
        <circle cx="36" cy="55" r="3" fill="#3a2a1a" />
        <circle cx="64" cy="55" r="3" fill="#3a2a1a" />
        <circle cx="37" cy="54" r="1" fill="#fff" />
        <circle cx="65" cy="54" r="1" fill="#fff" />
      </>
    ),
    mouth: <ellipse cx="50" cy="72" rx="4" ry="2.5" fill="#3a2a1a" />,
  },
  // 2: wink
  {
    eyes: (
      <>
        <path d="M30 55 Q36 49 42 55" stroke="#3a2a1a" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <circle cx="64" cy="55" r="3" fill="#3a2a1a" />
        <circle cx="65" cy="54" r="1" fill="#fff" />
      </>
    ),
    mouth: <path d="M44 72 Q50 76 56 72" stroke="#3a2a1a" stroke-width="2.6" fill="none" stroke-linecap="round" />,
  },
  // 3: dot eyes + big smile
  {
    eyes: (
      <>
        <circle cx="36" cy="55" r="2.5" fill="#3a2a1a" />
        <circle cx="64" cy="55" r="2.5" fill="#3a2a1a" />
      </>
    ),
    mouth: <path d="M40 68 Q50 80 60 68" stroke="#3a2a1a" stroke-width="2.6" fill="none" stroke-linecap="round" />,
  },
];

export function TofuCube(props: Props): JSX.Element {
  const skin = () => SKIN[props.hue ?? 'cream'];

  // pick a stable expression based on seed (or random if absent)
  const expr = createMemo(() => {
    const idx = props.seed != null
      ? props.seed % EXPRESSIONS.length
      : Math.floor(Math.random() * EXPRESSIONS.length);
    return EXPRESSIONS[idx];
  });

  const innerStyle = (): JSX.CSSProperties => ({
    width: '100%',
    height: '100%',
    animation: props.spinSpeed
      ? `spin-slow ${props.spinSpeed}s linear infinite`
      : undefined,
    'animation-delay': props.delay ? `${props.delay}s` : undefined,
  });

  const wrapStyle = (): JSX.CSSProperties => ({
    left: `${props.x}%`,
    top: `${props.y}%`,
    width: `${props.size}px`,
    height: `${props.size}px`,
    '--rot': `${props.rotation}deg`,
    transform: `translate(-50%, -50%) rotate(${props.rotation}deg)`,
  });

  const filterId = () => `tofu-shadow-${props.seed ?? 0}`;

  return (
    <div class="tofu" style={wrapStyle()}>
      <div style={innerStyle()}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible">
          <defs>
            <filter id={filterId()} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#5a0e0e" flood-opacity="0.35"/>
            </filter>
            <linearGradient id={`grad-${props.seed ?? 0}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stop-color="#ffffff" />
              <stop offset="55%"  stop-color={skin().body} />
              <stop offset="100%" stop-color={skin().bodyDeep} />
            </linearGradient>
          </defs>

          {/* body — fluffy rounded tofu block */}
          <rect
            x="8" y="16" width="84" height="78" rx="16"
            fill={`url(#grad-${props.seed ?? 0})`}
            filter={`url(#${filterId()})`}
          />

          {/* top highlight stripe (3D hint) */}
          <path
            d="M 14 22 Q 50 16 86 22 L 86 28 Q 50 22 14 28 Z"
            fill="#ffffff"
            opacity="0.7"
          />

          {/* sauce drips on top */}
          <path d="M 28 16 Q 30 26 26 32 Q 24 36 27 38 Q 32 33 32 26 Q 32 20 28 16 Z" fill={skin().sauce}/>
          <path d="M 58 14 Q 62 28 56 36 Q 53 40 57 42 Q 64 36 64 26 Q 64 18 58 14 Z" fill={skin().sauce}/>
          <circle cx="76" cy="22" r="3" fill={skin().sauce}/>

          {/* tiny sansho specks */}
          <circle cx="36" cy="36" r="1.2" fill="#7a4a1a" opacity="0.7"/>
          <circle cx="50" cy="42" r="1.0" fill="#7a4a1a" opacity="0.7"/>
          <circle cx="68" cy="38" r="1.2" fill="#7a4a1a" opacity="0.7"/>

          {/* face */}
          {expr().eyes}
          {expr().mouth}

          {/* cheek blush */}
          <ellipse cx="24" cy="68" rx="6" ry="3.5" fill={skin().cheek} opacity="0.7"/>
          <ellipse cx="76" cy="68" rx="6" ry="3.5" fill={skin().cheek} opacity="0.7"/>
        </svg>
      </div>
    </div>
  );
}
