/**
 * Nero Sama — credits data model.
 *
 * This is the single source of truth for the constellation of people
 * credited on the site. Nothing about layout, motion, or the energy
 * system is hard-coded elsewhere — everything reads from here.
 *
 * NOTE on `displayScale`:
 * The source avatar PNGs are not uniformly cropped — some heads fill
 * ~90% of their canvas, others ~60%. `displayScale` is a pure
 * presentation-layer multiplier (a CSS transform) that visually
 * normalizes apparent head size inside the bubble ring. It never
 * touches, crops, or redraws the original artwork.
 *
 * NOTE on `position`:
 * Expressed as a percentage of the scene's bounding box (0–100),
 * loosely inspired by the spatial arrangement in the reference
 * relationship diagram, but organic rather than a rigid grid.
 * `depth` (0 = closest/largest, 1 = farthest/smallest) drives parallax
 * and z-index so the composition reads with real spatial depth.
 */

export type CharacterId =
  | 'akuroi'
  | 'aqua'
  | 'zah'
  | 'shadow'
  | 'snow'
  | 'shizuka';

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
  /** Percentage-based anchor position on desktop */
  position: CharacterPosition;
  /** Simplified position for narrow / mobile viewports */
  mobilePosition: CharacterPosition;
  /** 0 = foreground / largest, 1 = background / smallest */
  depth: number;
  /** Base bubble diameter in px at depth 0, before depth scaling */
  baseSize: number;
  /** Presentation-only normalization multiplier for the avatar art */
  displayScale: number;
  /** IDs of characters this one has a visible energy relationship with */
  connections: CharacterId[];
  /** Per-character idle-motion seed so floating never synchronizes */
  motionSeed: number;
  /** Accent color used sparingly for this character's glow/energy tint */
  accent: string;
}

export const characters: Character[] = [
  {
    id: 'akuroi',
    name: 'Akuroi',
    role: 'Developer',
    avatar: '/avatars/Akuroi_Head.png',
    position: { x: 50, y: 54 },
    mobilePosition: { x: 50, y: 40 },
    depth: 0,
    baseSize: 168,
    displayScale: 1.0,
    connections: ['aqua', 'zah', 'shadow', 'snow', 'shizuka'],
    motionSeed: 0.12,
    accent: '#c9a6ff',
  },
  {
    id: 'aqua',
    name: 'Aqua',
    role: "Nero's Father",
    avatar: '/avatars/Aqua_Head.png',
    position: { x: 50, y: 30 },
    mobilePosition: { x: 24, y: 21 },
    depth: 0.1,
    baseSize: 150,
    displayScale: 1.0,
    connections: ['akuroi'],
    motionSeed: 0.31,
    accent: '#ffc266',
  },
  {
    id: 'zah',
    name: 'Zah',
    role: 'Partner',
    avatar: '/avatars/Zah_Head.png',
    position: { x: 83, y: 42 },
    mobilePosition: { x: 76, y: 21 },
    depth: 0.25,
    baseSize: 138,
    displayScale: 1.18,
    connections: ['akuroi'],
    motionSeed: 0.57,
    accent: '#8fb8ff',
  },
  {
    id: 'shadow',
    name: 'Shadow',
    role: 'Assistant',
    avatar: '/avatars/Shadow_Head.png',
    position: { x: 17, y: 72 },
    mobilePosition: { x: 22, y: 64 },
    depth: 0.2,
    baseSize: 140,
    displayScale: 1.14,
    connections: ['akuroi'],
    motionSeed: 0.74,
    accent: '#ff8fae',
  },
  {
    id: 'snow',
    name: 'Snow',
    role: 'Assistant',
    avatar: '/avatars/Snow_Head.png',
    position: { x: 83, y: 72 },
    mobilePosition: { x: 78, y: 64 },
    depth: 0.2,
    baseSize: 140,
    displayScale: 1.1,
    connections: ['akuroi'],
    motionSeed: 0.42,
    accent: '#b28fff',
  },
  {
    id: 'shizuka',
    name: 'Shizuka',
    role: 'Assistant',
    avatar: '/avatars/Shizuka_Head.png',
    position: { x: 50, y: 91 },
    mobilePosition: { x: 50, y: 87 },
    depth: 0.35,
    baseSize: 130,
    displayScale: 1.5,
    connections: ['akuroi'],
    motionSeed: 0.89,
    accent: '#dfe6ff',
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
