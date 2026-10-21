import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg';

// Brand-family tones only: status colours keep their single meaning.
const TONES = [
  'bg-brand-soft text-brand-hover',
  'bg-brand text-white',
  'bg-brand-deep text-on-deep',
  'bg-hover text-ink-soft'
];

const SIZES: Record<AvatarSize, string> = {
  sm: 'size-9 text-[13px]',
  md: 'size-10 text-[13px]',
  lg: 'size-11 text-sm'
};

/** Initials avatar whose colour is derived from the name, so it is stable across renders. */
@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="avatar" [class]="classes()" aria-hidden="true">{{ initials() }}</span>`
})
export class Avatar {
  firstName = input.required<string>();
  lastName = input.required<string>();
  size = input<AvatarSize>('md');
  // Forces the brand tone, e.g. for the signed-in user.
  tone = input<'auto' | 'brand'>('auto');

  protected readonly initials = computed(() =>
    `${this.firstName().charAt(0)}${this.lastName().charAt(0)}`.toUpperCase());

  protected readonly classes = computed(() => {
    const tone = this.tone() === 'brand' ? TONES[1] : TONES[hash(`${this.firstName()} ${this.lastName()}`) % TONES.length];
    return `${SIZES[this.size()]} ${tone}`;
  });
}

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i++) {
    result = (result * 31 + value.charCodeAt(i)) >>> 0;
  }
  return result;
}
