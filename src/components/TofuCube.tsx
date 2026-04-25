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

// Isometric face palettes — stroke-less; depth comes purely from face shading.
const SKIN: Record<NonNullable<Props['hue']>, { top: string; left: string; right: string }> = {
  cream: { top: '#fdf8e8', left: '#ebe0bf', right: '#bda77a' },
  gold:  { top: '#fff5d6', left: '#ecd49a', right: '#a98855' },
  pink:  { top: '#fff1ea', left: '#e9cfc4', right: '#b88577' },
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
            <filter id={`s-${seed()}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#0a0202" flood-opacity="0.5"/>
            </filter>
            {/* gradients to give each face a subtle in-face shading */}
            <linearGradient id={`gt-${seed()}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.85"/>
              <stop offset="100%" stop-color={skin().top} stop-opacity="0"/>
            </linearGradient>
            <linearGradient id={`gl-${seed()}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stop-color={skin().left} stop-opacity="1"/>
              <stop offset="100%" stop-color="#000000"     stop-opacity="0.08"/>
            </linearGradient>
            <linearGradient id={`gr-${seed()}`} x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%"   stop-color={skin().right} stop-opacity="1"/>
              <stop offset="100%" stop-color="#000000"      stop-opacity="0.0"/>
            </linearGradient>
          </defs>

          <g filter={`url(#s-${seed()})`}>
            {/* TOP face */}
            <polygon points="50,12 90,35 50,58 10,35" fill={skin().top}/>
            <polygon points="50,12 90,35 50,58 10,35" fill={`url(#gt-${seed()})`}/>

            {/* LEFT face */}
            <polygon points="10,35 50,58 50,92 10,69" fill={skin().left}/>
            <polygon points="10,35 50,58 50,92 10,69" fill={`url(#gl-${seed()})`}/>

            {/* RIGHT face — darkest, gives depth */}
            <polygon points="90,35 50,58 50,92 90,69" fill={skin().right}/>
            <polygon points="90,35 50,58 50,92 90,69" fill={`url(#gr-${seed()})`}/>
          </g>
        </svg>
      </div>
    </div>
  );
}
