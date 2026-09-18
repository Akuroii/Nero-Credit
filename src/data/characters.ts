/**
 * Nero Sama — credits data model.
 *
 * Single source of truth for the constellation of people credited on
 * the site. Layout, motion, the energy graph, and orb tinting are all
 * data-driven from here — no per-character markup duplication.
 *
 * RELATIONSHIP STRUCTURE (source of truth, do not infer extra edges):
 *   Aqua → Zah → GetTheMoon → Nozomi → Joe Fadl → Akuroi
 *   Akuroi → Shizuka → Shadow → Snow
 * Represented as two chains sharing Akuroi as the joint node. Each
 * character's `connections` list is populated symmetrically (both
 * directions of each arrow) so the energy system fires the same way
 * regardless of which end of a link the user hovers.
 *
 * NOTE on `displayScale`: presentation-layer normalization only — a
 * CSS transform that equalizes apparent head size across avatars whose
 * source crops fill different proportions of their canvas. Never
 * touches/crops/redraws the art.
 */

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
  /** Empty until provided — components must treat '' as "not live yet" */
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
  /** Only Aqua has this. See TODO below for where real URLs go. */
  socials?: SocialLink[];
}

export const characters: Character[] = [
  {
    id: 'akuroi',
    name: 'Akuroi',
    role: 'Developer',
    avatar: '/avatars/Akuroi_Head.png',
    position: { x: 50, y: 42 },
    mobilePosition: { x: 50, y: 58 },
    depth: 0,
    baseSize: 172,
    displayScale: 1.0,
    connections: ['joefadl', 'shizuka'],
    motionSeed: 0.12,
    accent: '#c9a6ff',
    orbHue: 255,
  },
  {
    id: 'aqua',
    name: 'Aqua',
    role: "Nero's Father",
    avatar: '/avatars/Aqua_Head.png',
    position: { x: 12, y: 20 },
    mobilePosition: { x: 50, y: 6 },
    depth: 0.2,
    baseSize: 148,
    displayScale: 1.0,
    connections: ['zah'],
    motionSeed: 0.31,
    accent: '#ffc266',
    orbHue: 30,
    socials: [
      // TODO(user): populate `url` for each platform once links are ready.
      // Leave url: '' until then — the UI renders these as "coming soon"
      // and won't emit a live/dead link.
      { id: 'youtube', label: 'YouTube', url: '' },
      { id: 'twitch', label: 'Twitch', url: '' },
      { id: 'discord', label: 'Discord', url: '' },
      { id: 'tiktok', label: 'TikTok', url: '' },
      { id: 'instagram', label: 'Instagram', url: '' },
    ],
  },
  {
    id: 'zah',
    name: 'Zah',
    role: 'Partner',
    avatar: '/avatars/Zah_Head.png',
    position: { x: 29, y: 11 },
    mobilePosition: { x: 50, y: 18 },
    depth: 0.14,
    baseSize: 138,
    displayScale: 1.18,
    connections: ['aqua', 'moon'],
    motionSeed: 0.57,
    accent: '#8fb8ff',
    orbHue: 195,
  },
  {
    id: 'moon',
    name: 'GetTheMoon',
    role: 'Partner',
    avatar: '/avatars/Moon_Head.png',
    position: { x: 50, y: 5 },
    mobilePosition: { x: 50, y: 30 },
    depth: 0.1,
    baseSize: 140,
    displayScale: 1.05,
    connections: ['zah', 'nozomi'],
    motionSeed: 0.19,
    accent: '#cfe7ff',
    orbHue: 190,
  },
  {
    id: 'nozomi',
    name: 'Nozomi',
    role: 'Partner',
    avatar: '/avatars/Nozomi_Head.png',
    position: { x: 71, y: 11 },
    mobilePosition: { x: 50, y: 42 },
    depth: 0.14,
    baseSize: 136,
    displayScale: 1.12,
    connections: ['moon', 'joefadl'],
    motionSeed: 0.66,
    accent: '#a78bfa',
    orbHue: 235,
  },
  {
    id: 'joefadl',
    name: 'Joe Fadl',
    role: 'Partner',
    avatar: '/avatars/Partner_Unnamed_Head.png',
    position: { x: 88, y: 20 },
    mobilePosition: { x: 50, y: 46 },
    depth: 0.2,
    baseSize: 138,
    displayScale: 1.2,
    connections: ['nozomi', 'akuroi'],
    motionSeed: 0.83,
    accent: '#ffb38a',
    orbHue: 20,
  },
  {
    id: 'shizuka',
    name: 'Shizuka',
    role: 'Assistant',
    avatar: '/avatars/Shizuka_Head.png',
    position: { x: 50, y: 62 },
    mobilePosition: { x: 50, y: 66 },
    depth: 0.1,
    baseSize: 128,
    displayScale: 1.5,
    connections: ['akuroi', 'shadow'],
    motionSeed: 0.89,
    accent: '#dfe6ff',
    orbHue: 200,
  },
  {
    id: 'shadow',
    name: 'Shadow',
    role: 'Assistant',
    avatar: '/avatars/Shadow_Head.png',
    position: { x: 31, y: 80 },
    mobilePosition: { x: 50, y: 78 },
    depth: 0.24,
    baseSize: 136,
    displayScale: 1.14,
    connections: ['shizuka', 'snow'],
    motionSeed: 0.74,
    accent: '#ff8fae',
    orbHue: 330,
  },
  {
    id: 'snow',
    name: 'Snow',
    role: 'Assistant',
    avatar: '/avatars/Snow_Head.png',
    position: { x: 69, y: 80 },
    mobilePosition: { x: 50, y: 90 },
    depth: 0.24,
    baseSize: 136,
    displayScale: 1.1,
    connections: ['shadow'],
    motionSeed: 0.42,
    accent: '#b28fff',
    orbHue: 270,
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
