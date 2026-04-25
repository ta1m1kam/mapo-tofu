import type { JSX } from 'solid-js';
import { For, createMemo } from 'solid-js';

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

const SKIN: Record<NonNullable<Props['hue']>, { top: string; side: string }> = {
  cream: { top: '#fff8e8', side: '#f3e6c2' },
  gold:  { top: '#fff5d8', side: '#ecdba0' },
  pink:  { top: '#fff2e8', side: '#f0d8c2' },
};

function rng(seed: number) {
  let s = (seed | 0) * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type Speck = {
  kind: 'meat' | 'oil';
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  shape: string;
};

function makeSpecks(seed: number): Speck[] {
  const r = rng(seed);
  const out: Speck[] = [];

  // 挽肉 — 1-2 個、ごく小さく豆腐に "ちょっと付いている" だけ
  const meatCount = 1 + Math.floor(r() * 2);
  for (let i = 0; i < meatCount; i++) {
    out.push({
      kind: 'meat',
      x: 18 + r() * 64,
      y: 18 + r() * 64,
      w: 6 + r() * 6,
      h: 5 + r() * 5,
      rot: r() * 360,
      shape: `${40 + r()*30}% ${40 + r()*30}% ${40 + r()*30}% ${40 + r()*30}%`,
    });
  }

  // 油 — 0-1 個、極稀に少量
  if (r() < 0.55) {
    out.push({
      kind: 'oil',
      x: 20 + r() * 60,
      y: 20 + r() * 60,
      w: 5 + r() * 4,
      h: 4 + r() * 3,
      rot: r() * 360,
      shape: '50%',
    });
  }

  return out;
}

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

  const specks = createMemo(() => makeSpecks((props.seed ?? 0) * 7 + 1));

  return (
    <div class="tofu" style={wrapStyle()}>
      <div class="cube" style={cubeStyle()}>
        {/* TOP — ソースの艶 + 控えめな挽肉粒 */}
        <span
          class="face top"
          style={{
            background: `linear-gradient(135deg, #ffffff 0%, ${skin().top} 50%, ${skin().side} 100%)`,
          }}
        >
          <For each={specks()}>
            {(s) => (
              <span
                class={`tofu-speck speck-${s.kind}`}
                style={{
                  left: `${s.x}%`,
                  top:  `${s.y}%`,
                  width:  `${s.w}%`,
                  height: `${s.h}%`,
                  'border-radius': s.shape,
                  transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
                }}
              />
            )}
          </For>
        </span>

        {/* FRONT — 下部にソースが垂れた茶色のグラデ */}
        <span
          class="face front"
          style={{
            background: `linear-gradient(180deg, ${skin().top} 0%, ${skin().side} 55%, #b8884a 100%)`,
          }}
        />
        {/* RIGHT — 飴色寄り、下に沈んだソース感 */}
        <span
          class="face right"
          style={{
            background: `linear-gradient(180deg, ${skin().side} 0%, #c89858 65%, #8a5a2c 100%)`,
          }}
        />
        {/* 残り3面: 単色 cream */}
        <span class="face bottom" style={{ background: '#8a5a2c' }}/>
        <span class="face back"   style={{ background: skin().side }}/>
        <span class="face left"   style={{ background: `linear-gradient(180deg, ${skin().side} 0%, #c89858 70%, #8a5a2c 100%)` }}/>
      </div>
    </div>
  );
}
