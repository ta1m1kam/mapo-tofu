import { For, onMount, createSignal } from 'solid-js';

type Particle = {
  id: number;
  x: number;
  y: number;
  rot: number;
  delay: number;
};

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

/**
 * 麻婆豆腐 ambient seasoning particles. Static positions; very subtle.
 *  - 花椒 (huajiao):  small dark specks
 *  - 辣油 (layu):     tiny glowing red oil drops
 *  - 葱   (negi):     small green slashes
 *  - steam:           rising wisps from bottom
 */
export function Seasonings() {
  // huajiao は挽肉粒に転用、negi はほぼ排除
  const [huajiao] = createSignal(makeParticles(48));
  const [layu]    = createSignal(makeParticles(8));
  const [negi]    = createSignal(makeParticles(0));

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
      <For each={huajiao()}>
        {(p) => (
          <span
            class="huajiao"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              '--r': `${p.rot}deg`,
              'animation-delay': `${p.delay}s`,
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
