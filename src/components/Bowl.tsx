import { For } from 'solid-js';
import { TofuCube } from './TofuCube';

export type Tofu = {
  id: number;
  x: number;
  y: number;
  size: number;
  aspect: number;
  rotation: number;
  rotateX: number;
  rotateY: number;
  hue: 'cream' | 'gold' | 'pink';
  bornAt: number;
};

type Props = {
  tofus: () => Tofu[];
};

// Bowl is an absolute-fill backdrop spanning the entire viewport.
// Tofus can land anywhere on the page (header & footer overlay on top via z-index).
export function Bowl(props: Props) {
  return (
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <For each={props.tofus()}>
        {(t) => (
          <TofuCube
            size={t.size}
            aspect={t.aspect}
            rotation={t.rotation}
            rotateX={t.rotateX}
            rotateY={t.rotateY}
            x={t.x}
            y={t.y}
            hue={t.hue}
            seed={t.id}
          />
        )}
      </For>
    </div>
  );
}
