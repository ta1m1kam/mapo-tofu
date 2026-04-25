import { createSignal, onCleanup, onMount } from 'solid-js';
import { Bowl, type Tofu } from './components/Bowl';

const HUES: Tofu['hue'][] = ['cream', 'gold', 'pink'];
const SPAWN_INTERVAL_MS = 600;
const MAX_VISIBLE_TOFU = 140;
const SHAKE_THRESHOLD = 26;     // m/s² — needs a real shake, not just a tilt
const SHAKE_COOLDOWN = 900;

function randomTofu(id: number): Tofu {
  const size = 42 + Math.random() * 64;
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size,
    aspect: 1,                                  // 立方体に戻す
    rotation: (Math.random() - 0.5) * 18,
    rotateX: -(16 + Math.random() * 26),
    rotateY:   16 + Math.random() * 60,
    hue: HUES[Math.floor(Math.random() * HUES.length)],
    bornAt: performance.now(),
  };
}

type DeviceMotionEventCtor = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function App() {
  const [tofus, setTofus] = createSignal<Tofu[]>([]);
  let nextId = 1;
  let shakeBlocked = false;

  function spawnOne() {
    setTofus((prev) => {
      const next = [...prev, randomTofu(nextId++)];
      if (next.length > MAX_VISIBLE_TOFU) next.shift();
      return next;
    });
  }

  function clearAll() {
    setTofus([]);
    nextId = 1;
  }

  function handleMotion(e: DeviceMotionEvent) {
    const a = e.accelerationIncludingGravity;
    if (!a) return;
    const x = a.x ?? 0, y = a.y ?? 0, z = a.z ?? 0;
    const total = Math.sqrt(x * x + y * y + z * z);
    // gravity baseline ≈ 9.8, so 26+ requires a real shake
    if (total > SHAKE_THRESHOLD && !shakeBlocked) {
      shakeBlocked = true;
      clearAll();
      setTimeout(() => { shakeBlocked = false; }, SHAKE_COOLDOWN);
    }
  }

  async function ensureMotionPermission() {
    const Ctor = (typeof DeviceMotionEvent !== 'undefined'
      ? (DeviceMotionEvent as DeviceMotionEventCtor)
      : undefined);
    if (Ctor?.requestPermission) {
      try {
        const granted = await Ctor.requestPermission();
        if (granted === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        }
      } catch {
        // silently ignore — non-secure contexts, denied, etc.
      }
    } else if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    }
  }

  onMount(() => {
    const spawnTimer = setInterval(spawnOne, SPAWN_INTERVAL_MS);

    // iOS 13+ requires a user gesture to grant motion permission
    const grantOnce = () => {
      void ensureMotionPermission();
      window.removeEventListener('pointerdown', grantOnce);
    };
    window.addEventListener('pointerdown', grantOnce);

    onCleanup(() => {
      clearInterval(spawnTimer);
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('pointerdown', grantOnce);
    });
  });

  function tap() { spawnOne(); }

  return (
    <div class="relative h-full w-full" onClick={tap}>
      <Bowl tofus={tofus} />
    </div>
  );
}
