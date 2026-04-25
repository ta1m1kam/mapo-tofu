import { For, onMount, createSignal } from 'solid-js';

type Particle = {
  id: number;
  x: number;
  y: number;
  rot: number;
  delay: number;
};

type Blob = Particle & { w: number; h: number };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand(2, 98),
    y: rand(2, 98),
    rot: rand(-30, 30),
    delay: rand(0, 7),
  }));
}

function makeBlobs(count: number): Blob[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand(0, 100),
    y: rand(0, 100),
    w: rand(120, 260),
    h: rand(80, 200),
    rot: rand(0, 360),
    delay: rand(0, 12),
  }));
}

/**
 * 麻婆豆腐 ambient seasoning particles. Static positions; very subtle.
 *  - 花椒 (huajiao):  small dark specks
 *  - 辣油 (layu):     tiny glowing red oil drops
 *  - 葱   (negi):     small green slashes
 *  - steam:           rising wisps from bottom
 */
export function Seasonings() {
  // 挽肉 (huajiao 流用) を多めに、ソース blob を追加、唐辛子フレークを追加
  const [sauceBlobs] = createSignal(makeBlobs(7));
  const [huajiao]    = createSignal(makeParticles(72));
  const [layu]       = createSignal(makeParticles(14));
  const [chiliFlakes]= createSignal(makeParticles(18));
  const [negi]       = createSignal(makeParticles(0));

  // steam comes from random bottom positions, recycled
  const STEAM_COUNT = 6;
  const [steams, setSteams] = createSignal(
    Array.from({ length: STEAM_COUNT }, (_, i) => ({
      id: i,
      x: rand(15, 85),
      delay: i * 1.0,
    })),
  );

  // re-seed steam positions slowly
  onMount(() => {
    const t = setInterval(() => {
      setSteams((prev) =>
        prev.map((s) => ({ ...s, x: rand(15, 85), id: Date.now() + s.id })),
      );
    }, 6000);
    return () => clearInterval(t);
  });

  return (
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* ソースの大きな水たまり (一番奥) */}
      <For each={sauceBlobs()}>
        {(b) => (
          <span
            class="sauce-blob"
            style={{
              left: `${b.x}%`,
              top:  `${b.y}%`,
              width:  `${b.w}px`,
              height: `${b.h}px`,
              transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
              'animation-delay': `${b.delay}s`,
            }}
          />
        )}
      </For>

      <For each={huajiao()}>
        {(p) => (
          <span
            class="huajiao"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              '--r': `${p.rot}deg`,
              'animation-delay': `${p.delay}s`,
              transform: `rotate(${p.rot}deg)`,
            } as never}
          />
        )}
      </For>

      <For each={chiliFlakes()}>
        {(p) => (
          <span
            class="chili-flake"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              '--r': `${p.rot}deg`,
              'animation-delay': `${p.delay}s`,
              transform: `rotate(${p.rot}deg)`,
            } as never}
          />
        )}
      </For>

      <For each={layu()}>
        {(p) => (
          <span
            class="layu"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              '--r': `${p.rot}deg`,
              'animation-delay': `${p.delay}s`,
            } as never}
          />
        )}
      </For>

      <For each={negi()}>
        {(p) => (
          <span
            class="negi"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              '--r': `${p.rot}deg`,
              'animation-delay': `${p.delay}s`,
            } as never}
          />
        )}
      </For>

      <For each={steams()}>
        {(s) => (
          <span
            class="steam"
            style={{
              left: `${s.x}%`,
              'animation-delay': `${s.delay}s`,
            }}
          />
        )}
      </For>
    </div>
  );
}
