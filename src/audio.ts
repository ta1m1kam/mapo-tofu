// 麻婆豆腐 procedural audio
//   - playDrop(size): tofu が着地する瞬間の「ぽちゃっ」音
//   - startSizzle():  灼熱の油の sizzle (フィルター済み白ノイズの低音 ambient)
//   ユーザー操作以前は AudioContext が suspended なので silent。

let ctx: AudioContext | undefined;
let masterGain: GainNode | undefined;
let muted = false;

function getCtor(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

export async function ensureAudio() {
  if (typeof window === 'undefined') return;
  const Ctor = getCtor();
  if (!Ctor) return;
  if (!ctx) {
    ctx = new Ctor();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch { /* ignore */ }
  }
}

export function setMuted(v: boolean) {
  muted = v;
  if (masterGain) masterGain.gain.value = muted ? 0 : 0.5;
}

export function isMuted() { return muted; }

/**
 * 着地音: 短い低音の "ぽちゃっ" + 軽いクリック。サイズで pitch が変わる。
 */
export function playDrop(size: number) {
  if (!ctx || !masterGain || muted) return;
  const t = ctx.currentTime;

  // base pitch: 大きい豆腐 = 低音、小さい = 高音
  const norm = Math.max(0, Math.min(1, (size - 60) / 160));
  const startFreq = 280 - norm * 110;     // 280Hz → 170Hz
  const endFreq   = 70  + norm * 30;      // 70Hz → 100Hz

  // 本体の低音 sine sweep
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, t);
  osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.22);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.32, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

  osc.connect(gain).connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.45);

  // 高音の "ぽち" クリック (ソース表面のしぶき感)
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'sine';
  clickOsc.frequency.setValueAtTime(1200 + Math.random() * 400, t);
  clickOsc.frequency.exponentialRampToValueAtTime(600, t + 0.04);
  clickGain.gain.setValueAtTime(0.0001, t);
  clickGain.gain.exponentialRampToValueAtTime(0.06, t + 0.004);
  clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  clickOsc.connect(clickGain).connect(masterGain);
  clickOsc.start(t);
  clickOsc.stop(t + 0.1);
}

export function suspendAudio() {
  if (ctx && ctx.state === 'running') {
    void ctx.suspend();
  }
}

export async function resumeAudio() {
  if (ctx && ctx.state === 'suspended') {
    try { await ctx.resume(); } catch { /* ignore */ }
  }
}
