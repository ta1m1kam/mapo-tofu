import type { JSX } from 'solid-js';

type Props = {
  size: number;
  aspect: number;          // unused for now (perfect cubes)
  rotation: number;        // in-plane Z rotation (slight tilt)
  rotateX: number;         // unused with SVG iso (kept for type compat)
  rotateY: number;         // unused with SVG iso
  x: number;
  y: number;
  hue?: 'cream' | 'gold' | 'pink';
  seed?: number;
};

const SKIN: Record<NonNullable<Props['hue']>, { top: string; topHi: string; left: string; right: string; bottom: string }> = {
  cream: { top: '#fff8e8', topHi: '#ffffff', left: '#f0e0bb', right: '#caa66a', bottom: '#7a4a1c' },
  gold:  { top: '#fff5d8', topHi: '#fffef0', left: '#ecd49a', right: '#bf9450', bottom: '#714014' },
  pink:  { top: '#fff2e8', topHi: '#fffaf0', left: '#f0d4be', right: '#c8a080', bottom: '#7a4424' },
};

export function TofuCube(props: Props): JSX.Element {
  const skin = () => SKIN[props.hue ?? 'cream'];

  // 1個1個の豆腐は1個の SVG。継ぎ目が出ないよう面同士は完全に隣接。
  // viewBox 100x100 内でアイソメ立方体を描く。
  // 8 vertices of the cube, projected to 2D iso:
  //   top face   : T1, T2, T3, T4  (top square viewed from above-front)
  //   bottom     : B1, B2, B3, B4
  //
  //          T1
  //         /  \
  //       T4    T2
  //         \  /
  //          T3---B3
  //         /|   /|
  //       T4 |  / |
  //          B4   B2
  //
  // For simplicity we draw 3 visible faces (top, left-front, right-front).

  const wrapStyle = (): JSX.CSSProperties => ({
    left:  `${props.x}%`,
    top:   `${props.y}%`,
    width:  `${props.size}px`,
    height: `${props.size}px`,
    '--rot':  `${props.rotation}deg`,
    transform: `translate(-50%, -50%) rotate(${props.rotation}deg)`,
  });

  const id = props.seed ?? 0;

  return (
    <div class="tofu" style={wrapStyle()}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible">
        <defs>
          <linearGradient id={`g-top-${id}`} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%"   stop-color={skin().topHi}/>
            <stop offset="100%" stop-color={skin().top}/>
          </linearGradient>
          <linearGradient id={`g-left-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color={skin().left}/>
            <stop offset="100%" stop-color={skin().bottom}/>
          </linearGradient>
          <linearGradient id={`g-right-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color={skin().right}/>
            <stop offset="100%" stop-color={skin().bottom}/>
          </linearGradient>
        </defs>

        {/* TOP face — rhombus from above */}
        <polygon
          points="50,8 92,32 50,56 8,32"
          fill={`url(#g-top-${id})`}
        />
        {/* LEFT-front face */}
        <polygon
          points="8,32 50,56 50,94 8,68"
          fill={`url(#g-left-${id})`}
        />
        {/* RIGHT-front face */}
        <polygon
          points="92,32 50,56 50,94 92,68"
          fill={`url(#g-right-${id})`}
        />
      </svg>
    </div>
  );
}
