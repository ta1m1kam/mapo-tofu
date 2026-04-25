import type { JSX } from 'solid-js';

type Props = {
  size: number;
  rotation: number;
  x: number; // %
  y: number; // %
  hue?: 'cream' | 'gold' | 'pink';
  spinSpeed?: number; // seconds per full rotation; 0 = no spin
  delay?: number;
};

const FACES: Record<NonNullable<Props['hue']>, { top: string; left: string; right: string }> = {
  cream: { top: '#fffbe8', left: '#ffeeb0', right: '#e9c971' },
  gold:  { top: '#fff5c7', left: '#ffd97a', right: '#c89a3c' },
  pink:  { top: '#ffeae0', left: '#ffc3a8', right: '#c87a5a' },
};

export function TofuCube(props: Props): JSX.Element {
  const c = () => FACES[props.hue ?? 'cream'];
  const innerStyle = () => ({
    width: '100%',
    height: '100%',
    animation: props.spinSpeed
      ? `spin-slow ${props.spinSpeed}s linear infinite`
      : undefined,
    'animation-delay': props.delay ? `${props.delay}s` : undefined,
  } as JSX.CSSProperties);

  const wrapStyle = () => ({
    left: `${props.x}%`,
    top: `${props.y}%`,
    width: `${props.size}px`,
    height: `${props.size}px`,
    '--rot': `${props.rotation}deg`,
    transform: `translate(-50%, -50%) rotate(${props.rotation}deg)`,
  } as JSX.CSSProperties);

  return (
    <div class="tofu" style={wrapStyle()}>
      <div style={innerStyle()}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible">
          <polygon points="50,8 92,32 50,56 8,32"  fill={c().top}   stroke="#8b1a1a" stroke-width="2" stroke-linejoin="round"/>
          <polygon points="8,32 50,56 50,94 8,68"  fill={c().left}  stroke="#8b1a1a" stroke-width="2" stroke-linejoin="round"/>
          <polygon points="92,32 50,56 50,94 92,68" fill={c().right} stroke="#8b1a1a" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="40" cy="28" r="1.6" fill="#7a4a1a"/>
          <circle cx="58" cy="22" r="1.4" fill="#7a4a1a"/>
          <circle cx="64" cy="38" r="1.2" fill="#7a4a1a"/>
          <circle cx="36" cy="40" r="1.0" fill="#7a4a1a"/>
          <ellipse cx="44" cy="22" rx="9" ry="2" fill="#ffffff" opacity="0.85"/>
          {props.size > 60 && (
            <g>
              <circle cx="40" cy="78" r="2.4" fill="#3a2a1a">
                <animate attributeName="ry" values="2.4;0.4;2.4" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="60" cy="78" r="2.4" fill="#3a2a1a">
                <animate attributeName="ry" values="2.4;0.4;2.4" dur="3s" repeatCount="indefinite"/>
              </circle>
              <path d="M44 84 Q50 88 56 84" stroke="#3a2a1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
              <circle cx="34" cy="83" r="2.4" fill="#ff8a8a" opacity="0.7"/>
              <circle cx="66" cy="83" r="2.4" fill="#ff8a8a" opacity="0.7"/>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
