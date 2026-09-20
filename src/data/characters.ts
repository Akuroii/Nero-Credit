/**
 * Nero Sama — credits data model.
 *
 * Single source of truth for the constellation of people credited on
 * the site. Layout, motion, the energy graph, and orb tinting are all
 * data-driven from here — no per-character markup duplication.
 *
 * RELATIONSHIP STRUCTURE (source of truth, do not infer extra edges):
 *   Aqua  → Zah, GetTheMoon, Nozomi, Joe Fadl, Akuroi   (Aqua is the hub)
 *   Akuroi → Shizuka, Shadow, Snow                       (Akuroi is the hub)
 * Each character's `connections` is populated symmetrically (both
 * directions of every edge) so the energy system fires the same way
 * regardless of which end of a link is hovered.
 *
 * `position` values follow the layout reference the user provided
 * (composition/spacing only — no artwork or styling copied from it).
 * `mobilePosition` is a single stacked column (x always 50) spaced by
 * `y`; the gaps are kept close to even (~11–12 apart) so no row sits
 * meaningfully tighter than its neighbors as the orb scale changes.
 *
 * NOTE on `displayScale`: presentation-layer normalization only — a
 * CSS transform that equalizes apparent head size across avatars whose
 * source crops fill different proportions of their canvas. Never
 * touches/crops/redraws the art.
 *
 * SIZE_SCALE: a single global multiplier applied on top of every
 * `baseSize` (and Nero's own core size) at render time, so the whole
 * cast can be nudged larger/smaller in one place without touching each
 * character's individual numbers.
 */
export const SIZE_SCALE = 1.1;

export type CharacterId =
  | 'akuroi'
  | 'aqua'
  | 'zah'
  | 'moon'
  | 'nozomi'
  | 'joefadl'
  | 'shadow'
  | 'snow'
  | 'shizuka';

export interface CharacterPosition {
  x: number;
  y: number;
}

export interface SocialLink {
  id: 'youtube' | 'twitch' | 'discord' | 'tiktok' | 'instagram';
  label: string;
  url: string;
}

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  avatar: string;
  position: CharacterPosition;
  mobilePosition: CharacterPosition;
  depth: number;
  baseSize: number;
  displayScale: number;
  connections: CharacterId[];
  motionSeed: number;
  accent: string;
  orbHue: number;
  /** Optional per-character multiplier on the curved-name text size.
   *  Defaults to 1 when omitted — used sparingly for names that read
   *  a little small at their orb's given size. */
  nameFontScale?: number;
  /** Only Aqua has this. */
  socials?: SocialLink[];
}

export const characters: Character[] = [
  {
    id: 'aqua',
    name: 'Aqua',
    role: "Nero's Father",
    avatar: '/avatars/Aqua_Head.png',
    position: { x: 35, y: 11 },
    mobilePosition: { x: 50, y: 7 },
    depth: 0,
    baseSize: 140,
    displayScale: 1.0,
    connections: ['zah', 'moon', 'nozomi', 'joefadl', 'akuroi'],
    motionSeed: 0.31,
    accent: '#ffc266',
    orbHue: 30,
    socials: [
      { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@aquahoshin' },
      { id: 'twitch', label: 'Twitch', url: 'https://www.twitch.tv/aquahoshiin' },
      { id: 'discord', label: 'Discord', url: 'https://discord.gg/UTEmgnDHHq' },
      { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@aquahoshini' },
      { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/aquahoshin' },
    ],
  },
  {
    id: 'akuroi',
    name: 'Akuroi',
    role: 'Developer',
    avatar: '/avatars/Akuroi_Head.png',
    position: { x: 65, y: 9 },
    mobilePosition: { x: 50, y: 63 },
    depth: 0.02,
    baseSize: 140,
    displayScale: 1.0,
    connections: ['aqua', 'shizuka', 'shadow', 'snow'],
    motionSeed: 0.12,
    accent: '#c9a6ff',
    orbHue: 255,
  },
  {
    id: 'snow',
    name: 'Snow',
    role: 'Assistant',
    avatar: '/avatars/Snow_Head.png',
    position: { x: 15, y: 41 },
    mobilePosition: { x: 50, y: 74 },
    depth: 0.18,
    baseSize: 124,
    displayScale: 1.1,
    connections: ['akuroi'],
    motionSeed: 0.42,
    accent: '#b28fff',
    orbHue: 270,
    nameFontScale: 1.15,
  },
  {
    id: 'shadow',
    name: 'Shadow',
    role: 'Assistant',
    avatar: '/avatars/Shadow_Head.png',
    position: { x: 50, y: 39 },
    mobilePosition: { x: 50, y: 86 },
    depth: 0.15,
    baseSize: 126,
    displayScale: 1.14,
    connections: ['akuroi'],
    motionSeed: 0.74,
    accent: '#ff8fae',
    orbHue: 330,
    nameFontScale: 1.15,
  },
  {
    id: 'shizuka',
    name: 'Shizuka',
    role: 'Assistant',
    avatar: '/avatars/Shizuka_Head.png',
    position: { x: 79, y: 41 },
    mobilePosition: { x: 50, y: 98 },
    depth: 0.18,
    baseSize: 116,
    displayScale: 1.5,
    connections: ['akuroi'],
    motionSeed: 0.89,
    accent: '#dfe6ff',
    orbHue: 200,
    nameFontScale: 1.15,
  },
  {
    id: 'joefadl',
    name: 'Joe Fadl',
    role: 'Partner',
    avatar: '/avatars/Partner_Unnamed_Head.png',
    position: { x: 17, y: 90 },
    mobilePosition: { x: 50, y: 39 },
    depth: 0.3,
    baseSize: 118,
    displayScale: 1.2,
    connections: ['aqua'],
    motionSeed: 0.83,
    accent: '#89cff0',
    orbHue: 200,
    nameFontScale: 1.15,
  },
  {
    id: 'nozomi',
    name: 'Nozomi',
    role: 'Partner',
    avatar: '/avatars/Nozomi_Head.png',
    position: { x: 63, y: 66 },
    mobilePosition: { x: 50, y: 28 },
    depth: 0.24,
    baseSize: 118,
    displayScale: 1.12,
    connections: ['aqua'],
    motionSeed: 0.66,
    accent: '#00DFBF',
    orbHue: 235,
    nameFontScale: 1.15,
  },
  {
    id: 'moon',
    name: 'GetTheMoon',
    role: 'Partner',
    avatar: '/avatars/Moon_Head.png',
    position: { x: 33, y: 66 },
    mobilePosition: { x: 50, y: 16 },
    depth: 0.24,
    baseSize: 118,
    displayScale: 1.05,
    connections: ['aqua'],
    motionSeed: 0.19,
    accent: '#a78bfa',
    orbHue: 269,
    nameFontScale: 1.15,
  },
  {
    id: 'zah',
    name: 'Zah',
    role: 'Partner',
    avatar: '/avatars/Zah_Head.png',
    position: { x: 84, y: 90 },
    mobilePosition: { x: 50, y: 51 },
    depth: 0.3,
    baseSize: 116,
    displayScale: 1.18,
    connections: ['aqua'],
    motionSeed: 0.57,
    accent: '#8fb8ff',
    orbHue: 195,
    nameFontScale: 1.15,
  },
];

export const getCharacter = (id: CharacterId) =>
  characters.find((c) => c.id === id)!;

/** Resolve full connection pairs (deduped) for the energy system */
export const connectionPairs: [CharacterId, CharacterId][] = (() => {
  const seen = new Set<string>();
  const pairs: [CharacterId, CharacterId][] = [];
  for (const c of characters) {
    for (const target of c.connections) {
      const key = [c.id, target].sort().join('|');
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push([c.id, target]);
      }
    }
  }
  return pairs;
})();
