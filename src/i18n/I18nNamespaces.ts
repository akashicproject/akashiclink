import type common from './translation/en_US.json';

export interface I18nNamespaces {
  common: typeof common;
}

export type I18nKeys = keyof I18nNamespaces['common'];
