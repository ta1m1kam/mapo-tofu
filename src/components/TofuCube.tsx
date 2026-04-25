import type { JSX } from 'solid-js';

type Props = {
  size: number;
  aspect: number;
  rotation: number;
  rotateX: number;
  rotateY: number;
  x: number;
  y: number;
  hue?: 'cream' | 'gold' | 'pink';
  seed?: number;
};

const SKIN: Record<NonNullable<Props['hue']>, { top: string; topHi: string; left: string; right: string; bottom: string; fill: string }> = {
  cream: { top: '#fff8e8', topHi: '#ffffff', left: '#f0e0bb', right: '#caa66a', bottom: '#7a4a1c', fill: '#e8d09a' },
  gold:  { top: '#fff5d8', topHi: '#fffef0', left: '#ecd49a', right: '#bf9450', bottom: '#714014', fill: '#e0c282' },
  pink:  { top: '#fff2e8', topHi: '#fffaf0', left: '#f0d4be', right: '#c8a080', bottom: '#7a4424', fill: '#dfba94' },
};

type Pt = [number, number];

// 4頂点の四角形を全角を半径 r で丸めた SVG path に変換
function roundedQuad(pts: Pt[], r: number): string {
  const n = pts.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];

    const v1x = prev[0] - curr[0], v1y = prev[1] - curr[1];
    const v2x = next[0] - curr[0], v2y = next[1] - curr[1];
    const len1 = Math.hypot(v1x, v1y);
    const len2 = Math.hypot(v2x, v2y);
    const rr = Math.min(r, len1 / 2, len2 / 2);

    const p1x = curr[0] + (v1x / len1) * rr;
    const p1y = curr[1] + (v1y / len1) * rr;
    const p2x = curr[0] + (v2x / len2) * rr;
    const p2y = curr[1] + (v2y / len2) * rr;

    if (i === 0) d += `M ${p1x.toFixed(2)} ${p1y.toFixed(2)} `;
    else         d += `L ${p1x.toFixed(2)} ${p1y.toFixed(2)} `;
    d += `Q ${curr[0]} ${curr[1]} ${p2x.toFixed(2)} ${p2y.toFixed(2)} `;
  }
  d += 'Z';
  return d;
}

// アイソメ立方体の頂点 (viewBox 100x100)
const TOP_V: Pt[]   = [[50, 8],  [92, 32], [50, 56], [8, 32]];
const LEFT_V: Pt[]  = [[8, 32],  [50, 56], [50, 94], [8, 68]];
const RIGHT_V: Pt[] = [[92, 32], [50, 56], [50, 94], [92, 68]];

// 全体シルエット（裏打ち、シーム消し用）
const SILHOUETTE: Pt[] = [
  [50, 8], [92, 32], [92, 68], [50, 94], [8, 68], [8, 32],
];

const RADIUS = 5;

export function TofuCube(props: Props): JSX.Element {
  const skin = () => SKIN[props.hue ?? 'cream'];
  const id = props.seed ?? 0;

  const wrapStyle = (): JSX.CSSProperties => ({
    left:  `${props.x}%`,
    top:   `${props.y}%`,
    width:  `${props.size}px`,
    height: `${props.size}px`,
    '--rot':  `${props.rotation}deg`,
    transform: `translate(-50%, -50%) rotate(${props.rotation}deg)`,
  });

  const silhouettePath = roundedQuad(SILHOUETTE, RADIUS);
  const topPath   = roundedQuad(TOP_V,   RADIUS);
  const leftPath  = roundedQuad(LEFT_V,  RADIUS);
  const rightPath = roundedQuad(RIGHT_V, RADIUS);

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

        {/* 裏打ち: シルエット全体を fill 色で塗りつぶし。
            各面の角を丸めることで生じる隙間を埋める。 */}
        <path d={silhouettePath} fill={skin().fill}/>

        {/* 3 visible faces, each with rounded corners */}
        <path d={topPath}   fill={`url(#g-top-${id})`}/>
        <path d={leftPath}  fill={`url(#g-left-${id})`}/>
        <path d={rightPath} fill={`url(#g-right-${id})`}/>
      </svg>
    </div>
  );
}
