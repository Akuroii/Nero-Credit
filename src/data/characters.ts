/**
 * Nero Sama — credits data model.
 *
 * Single source of truth for the constellation of people credited on
 * the site. Layout, motion, the energy graph, and orb tinting are all
 * data-driven from here — no per-character markup duplication.
 *
 * NOTE on `displayScale`:
 * Source avatar PNGs aren't uniformly cropped (some heads fill ~90% of
 * their canvas, others ~60%). `displayScale` is a presentation-layer
 * multiplier (a CSS transform) that visually normalizes apparent head
 * size inside the ring. It never touches, crops, or redraws the art.
 *
 * NOTE on `position` / `depth`:
 * Percentage-based scene coordinates, loosely inspired by the
 * reference composition but organic rather than a rigid grid.
 * `depth` (0 = closest/largest, 1 = farthest/smallest) drives parallax
 * and z-index.
 *
 * NOTE on missing roster slot:
 * A ninth character (partner) was referenced but not yet named — see
 * conversation. `RESERVED_PARTNER_SLOT` documents where they'll land
 * once identified, so adding them later doesn't require re-balancing
 * the whole composition.
 */

export type CharacterId =
  | 'akuroi'
  | 'aqua'
  | 'zah'
  | 'shadow'
  | 'snow'
  | 'shizuka'
  | 'nozomi'
  | 'moon';

export interface CharacterPosition {
  /** 0–100, percentage of scene width */
  x: number;
  /** 0–100, percentage of scene height */
  y: number;
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
  /** Hue rotation (deg) applied to the GradientOrb behind this character */
  orbHue: number;
}

export const characters: Character[] = [
  {
    id: 'akuroi',
    name: 'Akuroi',
    role: 'Developer',
    avatar: '/avatars/Akuroi_Head.png',
    position: { x: 50, y: 54 },
    mobilePosition: { x: 50, y: 38 },
    depth: 0,
    baseSize: 172,
    displayScale: 1.0,
    connections: ['aqua', 'zah', 'shadow', 'snow', 'shizuka', 'nozomi', 'moon'],
    motionSeed: 0.12,
    accent: '#c9a6ff',
    orbHue: 255,
  },
  {
    id: 'aqua',
    name: 'Aqua',
    role: "Nero's Father",
    avatar: '/avatars/Aqua_Head.png',
    position: { x: 50, y: 24 },
    mobilePosition: { x: 24, y: 13 },
    depth: 0.1,
    baseSize: 150,
    displayScale: 1.0,
    connections: ['akuroi'],
    motionSeed: 0.31,
    accent: '#ffc266',
    orbHue: 30,
  },
  {
    id: 'zah',
    name: 'Zah',
    role: 'Partner',
    avatar: '/avatars/Zah_Head.png',
    position: { x: 80, y: 34 },
    mobilePosition: { x: 76, y: 13 },
    depth: 0.25,
    baseSize: 136,
    displayScale: 1.18,
    connections: ['akuroi'],
    motionSeed: 0.57,
    accent: '#8fb8ff',
    orbHue: 195,
  },
  {
    id: 'nozomi',
    name: 'Nozomi',
    role: 'Partner',
    avatar: '/avatars/Nozomi_Head.png',
    position: { x: 90, y: 58 },
    mobilePosition: { x: 78, y: 32 },
    depth: 0.3,
    baseSize: 132,
    displayScale: 1.12,
    connections: ['akuroi'],
    motionSeed: 0.66,
    accent: '#a78bfa',
    orbHue: 235,
  },
  {
    id: 'shadow',
    name: 'Shadow',
    role: 'Assistant',
    avatar: '/avatars/Shadow_Head.png',
    position: { x: 15, y: 74 },
    mobilePosition: { x: 22, y: 55 },
    depth: 0.2,
    baseSize: 138,
    displayScale: 1.14,
    connections: ['akuroi'],
    motionSeed: 0.74,
    accent: '#ff8fae',
    orbHue: 330,
  },
  {
    id: 'moon',
    name: 'Moon',
    role: 'Partner',
    avatar: '/avatars/Moon_Head.png',
    position: { x: 10, y: 42 },
    mobilePosition: { x: 24, y: 55 },
    depth: 0.3,
    baseSize: 132,
    displayScale: 1.05,
    connections: ['akuroi'],
    motionSeed: 0.19,
    accent: '#cfe7ff',
    orbHue: 190,
  },
  {
    id: 'snow',
    name: 'Snow',
    role: 'Assistant',
    avatar: '/avatars/Snow_Head.png',
    position: { x: 78, y: 80 },
    mobilePosition: { x: 78, y: 76 },
    depth: 0.2,
    baseSize: 138,
    displayScale: 1.1,
    connections: ['akuroi'],
    motionSeed: 0.42,
    accent: '#b28fff',
    orbHue: 270,
  },
  {
    id: 'shizuka',
    name: 'Shizuka',
    role: 'Assistant',
    avatar: '/avatars/Shizuka_Head.png',
    position: { x: 50, y: 92 },
    mobilePosition: { x: 50, y: 90 },
    depth: 0.4,
    baseSize: 126,
    displayScale: 1.5,
    connections: ['akuroi'],
    motionSeed: 0.89,
    accent: '#dfe6ff',
    orbHue: 200,
  },
];

/**
 * Reserved for the still-unnamed ninth partner (mirrors Zah's slot on
 * the opposite side of Aqua). Populate and push into `characters` once
 * their name/role is confirmed — nothing else needs to change.
 */
export const RESERVED_PARTNER_SLOT: CharacterPosition = { x: 20, y: 34 };

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
