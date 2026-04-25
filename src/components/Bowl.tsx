import { For } from 'solid-js';
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

type Props = {
  tofus: () => Tofu[];
};

export function Bowl(props: Props) {
  return (
    <div class="relative flex-1 w-full overflow-hidden">
      <For each={props.tofus()}>
        {(t) => (
          <TofuCube
            size={t.size}
            rotation={t.rotation}
            x={t.x}
            y={t.y}
            hue={t.hue}
            spinSpeed={t.spinSpeed}
            seed={t.id}
          />
        )}
      </For>
    </div>
  );
}
