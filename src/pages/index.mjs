// Every page on the site. The build renders this list; the menu/footer link into it; sitemap.xml is made from it.
// Pages that existed on WordPress automatically get their ORIGINAL title + meta description from
// src/data/legacy-seo.json unless they set their own (and then they must explain why in `seoChange`).
import { readFileSync } from 'node:fs';
import { page as home } from './home.mjs';
import { productPages } from './products.mjs';
import { infoPages } from './info.mjs';
import { industryPages } from './industries.mjs';
import { termPages } from './terminology.mjs';
import { statePages } from './states.mjs';
import { campaignPages } from './campaigns.mjs';

const LEGACY = JSON.parse(readFileSync(new URL('../data/legacy-seo.json', import.meta.url), 'utf8'));

const withLegacySeo = (p) => {
  const old = LEGACY[p.path];
  if (!old) return p;
  return { ...p, title: p.title || old.title, description: p.description || old.description, legacy: true };
};

export const ALL_PAGES = [home, ...productPages, ...infoPages, ...industryPages, ...termPages, ...statePages, ...campaignPages].map(withLegacySeo);
