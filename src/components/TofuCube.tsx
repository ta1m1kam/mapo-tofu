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

// すべての面を白〜ごく薄い cream の単色に。コーナー (border-radius) から
// 暗色が透けないよう、グラデーションも darker stop も排除。
const SKIN: Record<NonNullable<Props['hue']>, { top: string; side: string }> = {
  cream: { top: '#ffffff', side: '#fbf6e6' },
  gold:  { top: '#fffef0', side: '#fff5d6' },
  pink:  { top: '#fffaf6', side: '#fff0e8' },
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
        {/* 全 6 面 単色 (light cream)。コーナーから透ける色も全部白系。 */}
        <span class="face top"    style={{ background: skin().top  }}/>
        <span class="face bottom" style={{ background: skin().side }}/>
        <span class="face front"  style={{ background: skin().top  }}/>
        <span class="face back"   style={{ background: skin().side }}/>
        <span class="face left"   style={{ background: skin().side }}/>
        <span class="face right"  style={{ background: skin().side }}/>
      </div>
    </div>
  );
}
