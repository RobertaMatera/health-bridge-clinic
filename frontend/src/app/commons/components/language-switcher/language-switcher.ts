import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {I18nService} from '@app/commons/i18n/i18n-service';
import {Language, LANGUAGES, TranslationKey} from '@app/commons/i18n/i18n-types';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="group"
      class="flex gap-1"
      [attr.aria-label]="'language.label' | t">
      @for (language of languages; track language) {
        <button
          type="button"
          class="min-h-11 min-w-11 cursor-pointer rounded-lg border text-sm font-semibold uppercase"
          [class]="i18n.language() === language
            ? 'border-brand bg-brand-soft text-brand-hover'
            : 'border-transparent text-muted hover:bg-hover hover:text-ink'"
          [attr.aria-pressed]="i18n.language() === language"
          [attr.lang]="language"
          (click)="i18n.setLanguage(language)">
          {{ language }}<span class="sr-only"> {{ nameKey(language) | t }}</span>
        </button>
      }
    </div>
  `
})
export class LanguageSwitcher {
  protected readonly i18n = inject(I18nService);
  protected readonly languages = LANGUAGES;

  protected nameKey(language: Language): TranslationKey {
    return `language.${language}`;
  }
}
