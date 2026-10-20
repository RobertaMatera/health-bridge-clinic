import {ChangeDetectionStrategy, Component, input} from '@angular/core';

export type LogoVariant = 'default' | 'inverse';
export type LogoSize = 'sm' | 'md' | 'lg';

/**
 * Bridge arch with the medical cross as keystone, plus the "HealthBridge CLINIC" wordmark.
 * The "inverse" variant is meant for the deep teal brand panel.
 */
@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'inline-flex items-center gap-2.5'}
})
export class Logo {
  variant = input<LogoVariant>('default');
  size = input<LogoSize>('md');
  wordmark = input(true);
  // Show "CLINIC" under the wordmark; compact headers hide it.
  tagline = input(true);

  protected readonly markSize: Record<LogoSize, string> = {sm: 'size-8', md: 'size-10', lg: 'size-12'};
  protected readonly nameSize: Record<LogoSize, string> = {sm: 'text-base', md: 'text-[17px]', lg: 'text-[22px]'};
}
