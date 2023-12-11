export interface SupportLang {
  label: string;
  value: string;
  img: string;
}

export interface Lang {
  locale: string;
  supportlangs: SupportLang[];
}
