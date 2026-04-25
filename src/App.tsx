import { createSignal, onCleanup, onMount } from 'solid-js';
import { Bowl, type Tofu } from './components/Bowl';
import { Seasonings } from './components/Seasonings';

const HUES: Tofu['hue'][] = ['cream', 'gold', 'pink'];
const SPAWN_INTERVAL_MS = 600;
const MAX_VISIBLE_TOFU = 280;

function randomTofu(id: number): Tofu {
  const size = 50 + Math.random() * 50;
  return {
    id,
    // 全画面に出現する: 左右は完全に画面端まで、上下も同様
    x: Math.random() * 100,
    y: Math.random() * 100,
    size,
    rotation: (Math.random() - 0.5) * 14,
    rotateX: -(18 + Math.random() * 22),
    rotateY:   20 + Math.random() * 50,
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
    <div class="relative h-full w-full" onClick={tap}>
      {/* 麻婆豆腐の薬味: 花椒・辣油・葱・湯気 (静かなアンビエント) */}
      <Seasonings />

      {/* tofus span the full viewport, z-0 backdrop */}
      <Bowl tofus={tofus} />

      {/* foreground chrome */}
      <div class="relative z-10 h-full w-full flex flex-col pointer-events-none">
        <header class="text-center px-6 pt-[max(env(safe-area-inset-top),48px)] pb-2">
          <h1 class="title text-veil">麻婆豆腐</h1>
          <div class="pinyin mt-3 text-veil">mápó dòufu</div>
          <span class="rule mt-8" />
          <p class="epigraph mt-8 max-w-[28ch] mx-auto text-veil">
            豆腐は無形より生まれ、
            <br />
            火と辣に出会いて姿を得る。
          </p>
          <div class="caps mt-6 text-veil">陳麻婆 · 1862 · 成都</div>
        </header>

        <div class="flex-1" />

        <footer
          class="text-center px-6 pb-[max(env(safe-area-inset-bottom),32px)] pt-6 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="caps mb-3 text-veil">tofu</div>
          <div class="counter-num text-veil">{String(count()).padStart(3, '0')}</div>

          <span class="rule mt-8 mb-4" />

          <div class="flex justify-center gap-4">
            <button class="link" onClick={toggle}>
              {running() ? 'pause' : 'continue'}
            </button>
            <span class="opacity-30">·</span>
            <button class="link" onClick={reset}>
              reset
            </button>
          </div>

          <div class="caps mt-8 opacity-60 text-veil">tap to add one</div>
        </footer>
      </div>
    </div>
  );
}
