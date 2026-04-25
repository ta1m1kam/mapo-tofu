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
  cream: { top: '#ffffff', side: '#fbf6e6' },
  gold:  { top: '#fffef0', side: '#fff5d6' },
  pink:  { top: '#fffaf6', side: '#fff0e8' },
};

// 簡易 seeded PRNG
function rng(seed: number) {
  let s = (seed | 0) * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type Topping = {
  kind: 'oil' | 'meat' | 'sansho';
  x: number;       // %
  y: number;       // %
  w: number;       // %
  h: number;       // %
  rot: number;
  shape: string;   // border-radius
};

function makeToppings(seed: number): Topping[] {
  const r = rng(seed);
  const out: Topping[] = [];

  // 辣油 (chili oil drops) — 2-4 個、不規則な楕円
  const oilCount = 2 + Math.floor(r() * 3);
  for (let i = 0; i < oilCount; i++) {
    out.push({
      kind: 'oil',
      x: 12 + r() * 76,
      y: 12 + r() * 76,
      w: 14 + r() * 18,
      h: 10 + r() * 14,
      rot: r() * 360,
      shape: `${40 + r()*30}% ${40 + r()*30}% ${40 + r()*30}% ${40 + r()*30}% / ${40 + r()*30}% ${40 + r()*30}% ${40 + r()*30}% ${40 + r()*30}%`,
    });
  }

  // 挽肉 (minced meat specks) — 2-4 個、ザラっとした塊
  const meatCount = 2 + Math.floor(r() * 3);
  for (let i = 0; i < meatCount; i++) {
    out.push({
      kind: 'meat',
      x: 14 + r() * 72,
      y: 14 + r() * 72,
      w: 8 + r() * 10,
      h: 6 + r() * 8,
      rot: r() * 360,
      shape: `${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}% ${30 + r()*40}%`,
    });
  }

  // 花椒 (sansho specks) — 0-3 個、ごく小さい点
  const sanshoCount = Math.floor(r() * 4);
  for (let i = 0; i < sanshoCount; i++) {
    out.push({
      kind: 'sansho',
      x: 15 + r() * 70,
      y: 15 + r() * 70,
      w: 3 + r() * 3,
      h: 3 + r() * 3,
      rot: 0,
      shape: '50%',
    });
  }

  return out;
}

function ToppingLayer(props: { seed: number; opacity?: number }) {
  const items = createMemo(() => makeToppings(props.seed));
  return (
    <For each={items()}>
      {(t) => (
        <span
          class={`topping topping-${t.kind}`}
          style={{
            left:   `${t.x}%`,
            top:    `${t.y}%`,
            width:  `${t.w}%`,
            height: `${t.h}%`,
            'border-radius': t.shape,
            transform: `translate(-50%, -50%) rotate(${t.rot}deg)`,
            opacity: props.opacity ?? 1,
          }}
        />
      )}
    </For>
  );
}

export function TofuCube(props: Props): JSX.Element {
  const skin = () => SKIN[props.hue ?? 'cream'];
  const seed = () => props.seed ?? 0;

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
        {/* TOP — メインに薬味を載せる（俯瞰で見える） */}
        <span class="face top" style={{ background: skin().top }}>
          <ToppingLayer seed={seed() * 7 + 1} />
        </span>

        {/* FRONT — 少しだけ垂れた感じ */}
        <span class="face front" style={{ background: skin().top }}>
          <ToppingLayer seed={seed() * 13 + 7} opacity={0.85} />
        </span>

        {/* RIGHT */}
        <span class="face right" style={{ background: skin().side }}>
          <ToppingLayer seed={seed() * 23 + 11} opacity={0.7} />
        </span>

        {/* 残り3面: 装飾なし */}
        <span class="face bottom" style={{ background: skin().side }} />
        <span class="face back"   style={{ background: skin().side }} />
        <span class="face left"   style={{ background: skin().side }} />
      </div>
    </div>
  );
}
