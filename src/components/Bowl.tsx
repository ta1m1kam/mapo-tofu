import { For, createSignal, createEffect, onCleanup, onMount, Show } from 'solid-js';
import { TofuCube } from './TofuCube';

export type Tofu = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  hue: 'cream' | 'gold' | 'pink';
  spinSpeed: number;
  bornAt: number;
};

type Sparkle  = { id: number; x: number; y: number; emoji: string };
type FloatT   = { id: number; x: number; y: number; text: string; color: string };
type Confetti = { id: number; x: number; dx: number; emoji: string; delay: number };
type Drifter  = { id: number; y: number; emoji: string; delay: number; dur: number };
type Twinkle  = { id: number; x: number; y: number; emoji: string; delay: number };

type Props = {
  tofus: () => Tofu[];
  onCelebration?: (text: string) => void;
};

const SPARKLE_EMOJIS = ['✨', '🌟', '💫', '🍀', '🌶️', '🪄', '⭐', '💖'];
const FLOAT_COLORS   = ['#fff', '#fbe04e', '#ffe0e0', '#aef0a8', '#ffd166'];
const CONFETTI_EMOJIS = ['🌶️', '✨', '💖', '🌟', '🎉', '🎊', '⭐', '🍀', '🥢', '🥬'];
const DRIFTER_EMOJIS  = ['🌶️', '🥬', '🥢', '🧄', '🧅'];
const TWINKLE_EMOJIS  = ['✦', '✧', '⋆', '⁂', '✸'];

const POP_MESSAGES = ['ぽよん', 'ぷるるん', 'もちもち', '増えた！', 'まだまだ！', 'うまそう', 'プニッ', 'ピリッ', 'ふるふる'];
const MILESTONES: Record<number, string> = {
  10:   '10こ目！',
  25:   '25こ突破！',
  50:   '50こ！半端ない！',
  100:  '💥 100こ達成！',
  150:  '麻ってきた…',
  200:  '止まらない！',
  300:  '🌶 痺れの境地…',
  500:  '🥢 食べきれない！',
  1000: '👑 千豆腐！',
};

export function Bowl(props: Props) {
  const [sparkles,  setSparkles]  = createSignal<Sparkle[]>([]);
  const [floats,    setFloats]    = createSignal<FloatT[]>([]);
  const [confetti,  setConfetti]  = createSignal<Confetti[]>([]);
  const [drifters,  setDrifters]  = createSignal<Drifter[]>([]);
  const [twinkles,  setTwinkles]  = createSignal<Twinkle[]>([]);

  let lastSeenCount = 0;
  let nextSparkle  = 0;
  let nextFloat    = 0;
  let nextConfetti = 0;
  let nextDrift    = 0;
  let nextTwinkle  = 0;

  function fireConfetti(burstSize = 28) {
    const items: Confetti[] = [];
    for (let i = 0; i < burstSize; i++) {
      items.push({
        id: ++nextConfetti,
        x: 50,
        dx: (Math.random() - 0.5) * 600,
        emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
        delay: Math.random() * 0.4,
      });
    }
    setConfetti((p) => [...p, ...items]);
    setTimeout(() => {
      const ids = new Set(items.map((it) => it.id));
      setConfetti((p) => p.filter((c) => !ids.has(c.id)));
    }, 3000);
  }

  createEffect(() => {
    const list = props.tofus();
    if (list.length > lastSeenCount) {
      const newest = list[list.length - 1];

      // sparkle near new tofu
      const sId = ++nextSparkle;
      setSparkles((p) => [...p, {
        id: sId,
        x: newest.x,
        y: newest.y,
        emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
      }]);
      setTimeout(() => setSparkles((p) => p.filter((s) => s.id !== sId)), 900);

      const milestone = MILESTONES[list.length];
      if (milestone) {
        const fid = ++nextFloat;
        setFloats((p) => [...p, {
          id: fid, x: 50, y: 50, text: milestone,
          color: FLOAT_COLORS[Math.floor(Math.random() * FLOAT_COLORS.length)],
        }]);
        setTimeout(() => setFloats((p) => p.filter((f) => f.id !== fid)), 1700);
        fireConfetti(list.length >= 100 ? 60 : 32);
        props.onCelebration?.(milestone);
      } else if (Math.random() < 0.22) {
        const fid = ++nextFloat;
        setFloats((p) => [...p, {
          id: fid,
          x: newest.x,
          y: newest.y,
          text: POP_MESSAGES[Math.floor(Math.random() * POP_MESSAGES.length)],
          color: FLOAT_COLORS[Math.floor(Math.random() * FLOAT_COLORS.length)],
        }]);
        setTimeout(() => setFloats((p) => p.filter((f) => f.id !== fid)), 1700);
      }
    }
    lastSeenCount = list.length;
  });

  // ambient drifters (chili / negi) crossing from left to right
  onMount(() => {
    const t = setInterval(() => {
      const id = ++nextDrift;
      setDrifters((p) => [
        ...p.slice(-12),
        {
          id,
          y: 5 + Math.random() * 90,
          emoji: DRIFTER_EMOJIS[Math.floor(Math.random() * DRIFTER_EMOJIS.length)],
          delay: 0,
          dur: 9 + Math.random() * 8,
        },
      ]);
    }, 700);
    onCleanup(() => clearInterval(t));
  });

  // ambient twinkles
  onMount(() => {
    for (let i = 0; i < 14; i++) {
      setTwinkles((p) => [...p, {
        id: ++nextTwinkle,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: TWINKLE_EMOJIS[Math.floor(Math.random() * TWINKLE_EMOJIS.length)],
        delay: Math.random() * 2,
      }]);
    }
  });

  return (
    <div class="relative flex-1 w-full overflow-hidden">
      {/* twinkles */}
      <For each={twinkles()}>
        {(t) => (
          <span
            class="twinkle"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              'animation-delay': `${t.delay}s`,
            }}
          >{t.emoji}</span>
        )}
      </For>

      {/* drifters */}
      <For each={drifters()}>
        {(d) => (
          <span
            class="drift"
            style={{
              top: `${d.y}%`,
              'animation-duration': `${d.dur}s`,
            }}
          >{d.emoji}</span>
        )}
      </For>

      {/* tofu cubes */}
      <For each={props.tofus()}>
        {(t) => (
          <TofuCube
            size={t.size}
            rotation={t.rotation}
            x={t.x}
            y={t.y}
            hue={t.hue}
            spinSpeed={t.spinSpeed}
          />
        )}
      </For>

      {/* sparkles */}
      <For each={sparkles()}>
        {(s) => (
          <span
            class="sparkle"
            style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}
          >{s.emoji}</span>
        )}
      </For>

      {/* float texts */}
      <For each={floats()}>
        {(f) => (
          <span
            class="float-text"
            style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.color }}
          >{f.text}</span>
        )}
      </For>

      {/* confetti */}
      <For each={confetti()}>
        {(c) => (
          <span
            class="confetti"
            style={{
              left: `${c.x}%`,
              '--dx': `${c.dx}px`,
              'animation-delay': `${c.delay}s`,
            } as never}
          >{c.emoji}</span>
        )}
      </For>

      <Show when={props.tofus().length === 0}>
        <div class="absolute inset-0 grid place-items-center text-center px-6">
          <div class="opacity-90 text-lg">タップで増殖開始 🌶️</div>
        </div>
      </Show>
    </div>
  );
}
