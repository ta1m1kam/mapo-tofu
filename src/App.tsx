import { createSignal, onCleanup, onMount } from 'solid-js';
import { Bowl, type Tofu } from './components/Bowl';

const HUES: Tofu['hue'][] = ['cream', 'gold', 'pink'];
const SPAWN_INTERVAL_MS = 600;
const MAX_VISIBLE_TOFU = 240;

function randomTofu(id: number): Tofu {
  const size = 50 + Math.random() * 50;
  return {
    id,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size,
    rotation: (Math.random() - 0.5) * 14,
    // 3D angle variance: each tofu shows top + 2 sides at slightly different orientation
    rotateX: -(18 + Math.random() * 22),     // -18° ~ -40° (tilt forward)
    rotateY:   20 + Math.random() * 50,      //  20° ~ 70°  (rotate around vertical)
    hue: HUES[Math.floor(Math.random() * HUES.length)],
    bornAt: performance.now(),
  };
}

export function App() {
  const [tofus, setTofus]     = createSignal<Tofu[]>([]);
  const [running, setRunning] = createSignal(true);

  let nextId = 1;
  let intervalId: ReturnType<typeof setInterval> | undefined;

  function spawnOne() {
    setTofus((prev) => {
      const next = [...prev, randomTofu(nextId++)];
      if (next.length > MAX_VISIBLE_TOFU) next.shift();
      return next;
    });
  }

  function start() {
    if (intervalId) return;
    intervalId = setInterval(spawnOne, SPAWN_INTERVAL_MS);
    setRunning(true);
  }

  function stop() {
    if (intervalId) clearInterval(intervalId);
    intervalId = undefined;
    setRunning(false);
  }

  function reset() {
    stop();
    setTofus([]);
    nextId = 1;
    start();
  }

  function toggle() { running() ? stop() : start(); }
  function tap() { spawnOne(); }

  onMount(() => {
    start();
    onCleanup(() => stop());
  });

  const count = () => tofus().length;

  return (
    <div class="h-full w-full flex flex-col" onClick={tap}>
      <header class="relative z-10 px-6 pt-[max(env(safe-area-inset-top),48px)] pb-2 text-center">
        <h1 class="title">麻婆豆腐</h1>
        <div class="pinyin mt-3">mápó dòufu</div>
        <span class="rule mt-8" />
        <p class="epigraph mt-8 max-w-[28ch] mx-auto">
          豆腐は無形より生まれ、
          <br />
          火と辣に出会いて姿を得る。
        </p>
        <div class="caps mt-6">陳麻婆 · 1862 · 成都</div>
      </header>

      <Bowl tofus={tofus} />

      <footer
        class="relative z-10 px-6 pb-[max(env(safe-area-inset-bottom),32px)] pt-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div class="caps mb-3">tofu</div>
        <div class="counter-num">{String(count()).padStart(3, '0')}</div>

        <span class="rule mt-8 mb-4" />

        <div class="flex justify-center gap-4">
          <button class="link" onClick={toggle}>
            {running() ? 'pause' : 'continue'}
          </button>
          <span class="text-ink-dim opacity-30">·</span>
          <button class="link" onClick={reset}>
            reset
          </button>
        </div>

        <div class="caps mt-8 opacity-60">tap to add one</div>
      </footer>
    </div>
  );
}
