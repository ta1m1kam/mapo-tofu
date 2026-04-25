import type { JSX } from 'solid-js';

type Props = {
  size: number;
  /** in-plane (z-axis) rotation of the wrapper */
  rotation: number;
  /** 3D rotateX in degrees (typical: -40 to -15) */
  rotateX: number;
  /** 3D rotateY in degrees (typical: 20 to 70) */
  rotateY: number;
  x: number;
  y: number;
  hue?: 'cream' | 'gold' | 'pink';
  seed?: number;
};

const SKIN: Record<NonNullable<Props['hue']>, { top: string; side: string; back: string }> = {
  cream: { top: '#fdf8e8', side: '#ebdcb6', back: '#9d8a5a' },
  gold:  { top: '#fff5d0', side: '#ecd49a', back: '#9c7c45' },
  pink:  { top: '#fff1ea', side: '#e9cfc4', back: '#9d6f5e' },
};

export function TofuCube(props: Props): JSX.Element {
  const skin = () => SKIN[props.hue ?? 'cream'];

  const wrapStyle = (): JSX.CSSProperties => ({
    left:  `${props.x}%`,
    top:   `${props.y}%`,
    width:  `${props.size}px`,
    height: `${props.size}px`,
    '--rot':  `${props.rotation}deg`,
    '--size': `${props.size}px`,
    transform: `translate(-50%, -50%) rotate(${props.rotation}deg)`,
  });

  const cubeStyle = (): JSX.CSSProperties => ({
    transform: `rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg)`,
  });

  return (
    <div class="tofu" style={wrapStyle()}>
      <div class="cube" style={cubeStyle()}>
        <span
          class="face top"
          style={{ background: `linear-gradient(135deg, #ffffff 0%, ${skin().top} 60%, ${skin().side} 100%)` }}
        />
        <span
          class="face bottom"
          style={{ background: skin().back }}
        />
        <span
          class="face front"
          style={{ background: `linear-gradient(180deg, ${skin().top} 0%, ${skin().side} 100%)` }}
        />
        <span
          class="face back"
          style={{ background: skin().back }}
        />
        <span
          class="face left"
          style={{ background: `linear-gradient(90deg, ${skin().back} 0%, ${skin().side} 100%)` }}
        />
        <span
          class="face right"
          style={{ background: `linear-gradient(270deg, ${skin().back} 0%, ${skin().side} 100%)` }}
        />
      </div>
    </div>
  );
}
