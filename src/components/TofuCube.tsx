import type { JSX } from 'solid-js';

type Props = {
  size: number;
  rotation: number;
  x: number;
  y: number;
  hue?: 'cream' | 'gold' | 'pink';
  spinSpeed?: number;
  delay?: number;
  seed?: number;
};

const SKIN: Record<NonNullable<Props['hue']>, { top: string; bottom: string }> = {
  // 純白系・ほぼ等しい彩度。差は極わずかに留める（philosophical = 静か）
  cream: { top: '#ffffff', bottom: '#efe6cf' },
  gold:  { top: '#fffdf3', bottom: '#e7d8a8' },
  pink:  { top: '#fffafa', bottom: '#ecd9d2' },
};

export function TofuCube(props: Props): JSX.Element {
  const skin = () => SKIN[props.hue ?? 'cream'];
  const seed = () => props.seed ?? 0;

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

  return (
    <div class="tofu" style={wrapStyle()}>
      <div style={innerStyle()}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible">
          <defs>
            <filter id={`s-${seed()}`} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#1a0405" flood-opacity="0.45"/>
            </filter>
            <linearGradient id={`g-${seed()}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stop-color={skin().top} />
              <stop offset="100%" stop-color={skin().bottom} />
            </linearGradient>
          </defs>

          {/* 唯一の要素 — 角丸の白い豆腐 */}
          <rect
            x="8" y="10" width="84" height="80" rx="6" ry="6"
            fill={`url(#g-${seed()})`}
            filter={`url(#s-${seed()})`}
          />
          {/* 1px 内側の罫線、ごく弱く（あるかなしか） */}
          <rect
            x="8" y="10" width="84" height="80" rx="6" ry="6"
            fill="none"
            stroke="#000"
            stroke-opacity="0.06"
            stroke-width="1"
          />
        </svg>
      </div>
    </div>
  );
}
