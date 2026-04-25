import type { JSX } from 'solid-js';
import { For, createMemo } from 'solid-js';

type Props = {
  size: number;
  aspect: number;        // width/height ratio for the front face — 1.0 = perfect cube
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

  // 挽肉: 0-3 個。サイズ・形状を大きく不揃いに、たまに端っこに寄せる
  const meatCount = Math.floor(r() * 4);
  for (let i = 0; i < meatCount; i++) {
    const onEdge = r() < 0.45;
    const xPos = onEdge
      ? (r() < 0.5 ? 8 + r() * 18 : 74 + r() * 18)
      : 18 + r() * 64;
    const yPos = onEdge
      ? (r() < 0.5 ? 8 + r() * 18 : 74 + r() * 18)
      : 18 + r() * 64;
    out.push({
      kind: 'meat',
      x: xPos,
      y: yPos,
      w: 7 + r() * 14,
      h: 5 + r() * 11,
      rot: r() * 360,
      shape: `${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}% / ${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}%`,
    });
  }

  // 油滴: 0-2 個
  const oilCount = Math.floor(r() * 3);
  for (let i = 0; i < oilCount; i++) {
    out.push({
      kind: 'oil',
      x: 16 + r() * 68,
      y: 16 + r() * 68,
      w: 4 + r() * 5,
      h: 3 + r() * 4,
      rot: r() * 360,
      shape: '50%',
    });
  }

  return out;
}

type SauceCoat = {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  shape: string;
  opacity: number;
};

// 上面に流れたソースの不規則なコーティング
function makeSauceCoats(seed: number): SauceCoat[] {
  const r = rng(seed);
  const count = 1 + Math.floor(r() * 2);
  return Array.from({ length: count }, () => ({
    x: r() * 100,
    y: r() * 100,
    w: 50 + r() * 70,
    h: 30 + r() * 60,
    rot: r() * 360,
    shape: `${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}% / ${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}%`,
    opacity: 0.2 + r() * 0.35,
  }));
}

export function TofuCube(props: Props): JSX.Element {
  const skin = () => SKIN[props.hue ?? 'cream'];

  const wrapStyle = (): JSX.CSSProperties => ({
    left:  `${props.x}%`,
    top:   `${props.y}%`,
    // aspect で 横幅 を変える: 1.0 = 正方形, >1 = 横長, <1 = 縦長
    width:  `${props.size * props.aspect}px`,
    height: `${props.size}px`,
    '--rot':  `${props.rotation}deg`,
    '--size': `${props.size}px`,
    transform: `translate(-50%, -50%) rotate(${props.rotation}deg)`,
  });

  const cubeStyle = (): JSX.CSSProperties => ({
    transform: `rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg)`,
  });

  const specks = createMemo(() => makeSpecks((props.seed ?? 0) * 7 + 1));
  const coats  = createMemo(() => makeSauceCoats((props.seed ?? 0) * 17 + 5));

  return (
    <div class="tofu" style={wrapStyle()}>
      <div class="cube" style={cubeStyle()}>
        {/* TOP — ソースの艶 + ランダムな垂れ + 控えめな挽肉粒 */}
        <span
          class="face top"
          style={{
            background: `linear-gradient(135deg, #ffffff 0%, ${skin().top} 50%, ${skin().side} 100%)`,
          }}
        >
          {/* ソースの不規則コーティング */}
          <For each={coats()}>
            {(c) => (
              <span
                class="sauce-coat"
                style={{
                  left: `${c.x}%`,
                  top:  `${c.y}%`,
                  width:  `${c.w}%`,
                  height: `${c.h}%`,
                  'border-radius': c.shape,
                  transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
                  opacity: c.opacity,
                }}
              />
            )}
          </For>
          {/* 挽肉粒・油滴 */}
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

        {/* FRONT — 下半分にソースが垂れた茶色のグラデ */}
        <span
          class="face front"
          style={{
            background: `linear-gradient(180deg, ${skin().top} 0%, ${skin().side} 50%, #b8884a 100%)`,
          }}
        />
        {/* RIGHT */}
        <span
          class="face right"
          style={{
            background: `linear-gradient(180deg, ${skin().side} 0%, #c89858 60%, #8a5a2c 100%)`,
          }}
        />
        {/* LEFT */}
        <span
          class="face left"
          style={{
            background: `linear-gradient(180deg, ${skin().side} 0%, #c89858 65%, #8a5a2c 100%)`,
          }}
        />
        {/* BOTTOM — ソースに浸かっている */}
        <span class="face bottom" style={{ background: '#7a4a1c' }}/>
        {/* BACK */}
        <span class="face back" style={{ background: skin().side }}/>
      </div>
    </div>
  );
}
