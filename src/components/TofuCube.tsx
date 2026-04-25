import type { JSX } from 'solid-js';

type Props = {
  size: number;
  rotation: number;
  rotateX: number;
  rotateY: number;
  x: number;
  y: number;
  hue?: 'cream' | 'gold' | 'pink';
  seed?: number;
};

// 実物の麻婆豆腐のような、ソースに艶めく綺麗なクリーム白
const SKIN: Record<NonNullable<Props['hue']>, { top: string; side: string }> = {
  cream: { top: '#fff8e8', side: '#f3e6c2' },
  gold:  { top: '#fff5d8', side: '#ecdba0' },
  pink:  { top: '#fff2e8', side: '#f0d8c2' },
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
        {/* TOP: 軽くソースの艶 */}
        <span
          class="face top"
          style={{
            background: `linear-gradient(135deg, #ffffff 0%, ${skin().top} 55%, ${skin().side} 100%)`,
          }}
        />
        {/* FRONT */}
        <span
          class="face front"
          style={{
            background: `linear-gradient(180deg, ${skin().top} 0%, ${skin().side} 100%)`,
          }}
        />
        {/* RIGHT — ソースに浸る側面、すこし飴色寄り */}
        <span
          class="face right"
          style={{
            background: `linear-gradient(90deg, ${skin().side} 0%, #d4b478 100%)`,
          }}
        />
        {/* 残り3面: 単色 cream */}
        <span class="face bottom" style={{ background: skin().side }}/>
        <span class="face back"   style={{ background: skin().side }}/>
        <span class="face left"   style={{ background: skin().side }}/>
      </div>
    </div>
  );
}
