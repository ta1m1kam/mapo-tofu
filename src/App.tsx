import { For, createSignal, onCleanup, onMount } from 'solid-js';
import { Bowl, type Tofu } from './components/Bowl';

const HUES: Tofu['hue'][] = ['cream', 'gold', 'pink'];
const SPAWN_INTERVAL_MS = 380;
const MAX_VISIBLE_TOFU = 240;

const TITLE = '麻婆豆腐';

function randomTofu(id: number): Tofu {
  const size = 50 + Math.random() * 50; // 50~100, slightly bigger for face readability
  return {
    id,
    x: 8 + Math.random() * 84,
    y: 10 + Math.random() * 80,
    size,
    // keep faces upright-ish
    rotation: (Math.random() - 0.5) * 18,
    hue: HUES[Math.floor(Math.random() * HUES.length)],
    // no continuous spin — would hide the face
    spinSpeed: 0,
    bornAt: performance.now(),
  };
}

export function App() {
  const [tofus, setTofus] = createSignal<Tofu[]>([]);
  const [running, setRunning] = createSignal(true);
  const [highlight, setHighlight] = createSignal(false);

  let nextId = 1;
  let intervalId: ReturnType<typeof setInterval> | undefined;

  function spawnOne() {
    setTofus((prev) => {
      const next = [...prev, randomTofu(nextId++)];
      if (next.length > MAX_VISIBLE_TOFU) next.shift();
      return next;
    });
    setHighlight(true);
    setTimeout(() => setHighlight(false), 380);
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
  const total = () => nextId - 1;

  return (
    <div class="h-full w-full flex flex-col" onClick={tap}>
      {/* corner stamps 福/喜 */}
      <div class="stamp stamp-tl" aria-hidden>福</div>
      <div class="stamp stamp-br" aria-hidden>喜</div>

      {/* swinging lanterns */}
      <span class="lantern lantern-l" aria-hidden>🏮</span>
      <span class="lantern lantern-r" aria-hidden>🏮</span>

      {/* dragon flyover */}
      <span class="dragon" aria-hidden>🐲</span>

      <header class="relative z-10 px-6 pt-[max(env(safe-area-inset-top),28px)] pb-2 text-center">
        <h1 class="title text-[clamp(2.6rem,12vw,4.6rem)] leading-none">
          <For each={[...TITLE]}>
            {(ch, i) => (
              <span
                class={`title-char title-char-${i() + 1}`}
                style={{ 'animation-delay': `${i() * 0.13}s` }}
              >
                {ch}
              </span>
            )}
          </For>
        </h1>
        <div class="pinyin mt-2">mápó dòufu</div>
        <p class="mt-1 text-sm sm:text-base opacity-90 font-rounded">
          豆腐がどんどん増えるよ 🌶️
        </p>
      </header>

      <Bowl tofus={tofus} />

      <footer
        class="relative z-10 px-6 pb-[max(env(safe-area-inset-bottom),28px)] pt-3 flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div class="text-center">
          <div class="text-xs opacity-90 tracking-[0.42em] font-rounded">
            <span style={{ color: '#ffe066' }}>·</span> TOFU COUNT <span style={{ color: '#ffe066' }}>·</span>
          </div>
          <div class="flex items-baseline gap-2 justify-center mt-1">
            <span class={`counter-num text-[clamp(2.6rem,13vw,4.4rem)] leading-none ${highlight() ? 'pop' : ''}`}>
              {count()}
            </span>
            <span class="text-base opacity-90">こ</span>
            {total() > count() && (
              <span class="text-sm opacity-70">/ 総 {total()}</span>
            )}
          </div>
        </div>

        <div class="flex gap-3">
          <button class="btn-pop" onClick={toggle}>
            {running() ? '⏸ 止める' : '▶ もっと'}
          </button>
          <button class="btn-pop alt" onClick={reset}>
            🌶 最初から
          </button>
        </div>

        <div class="opacity-70 text-[11px] mt-1 tracking-[0.3em]">
          画面タップで +1
        </div>
      </footer>
    </div>
  );
}
