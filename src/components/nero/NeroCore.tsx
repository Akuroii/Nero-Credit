import { useNeroSound } from '../../hooks/useNeroSound';

interface NeroCoreProps {
  size: number;
}

/**
 * Nero Sama is the bot's own mascot/icon — not one of the credited
 * people, so it deliberately doesn't use CharacterBubble/the credit
 * data model. It gets its own larger, more luminous framing befitting
 * the anchor of the whole world.
 *
 * Purely a visual presence: hovering or clicking/tapping plays a short
 * sound (see useNeroSound), nothing more — no menu, no navigation.
 */
export function NeroCore({ size }: NeroCoreProps) {
  const playNeroSound = useNeroSound();

  return (
    <button
      type="button"
      onMouseEnter={playNeroSound}
      onClick={playNeroSound}
      aria-label="Nero Sama"
      className="group absolute left-1/2 top-1/2 cursor-pointer rounded-full outline-none"
      style={{ transform: 'translate(-50%, -50%)', width: size, height: size }}
    >
      {/* deep luminous halo */}
      <span
        className="absolute inset-[-30%] rounded-full blur-3xl transition-opacity duration-700 group-hover:opacity-90"
        style={{
          background:
            'radial-gradient(circle, rgba(143,214,255,0.55) 0%, rgba(183,155,255,0.35) 45%, transparent 75%)',
          opacity: 0.65,
        }}
      />

      {/* portrait, circular-masked, ring-framed */}
      <span className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-white/15 shadow-[0_0_60px_rgba(150,180,255,0.35)]">
        <img
          src="/avatars/nero-sama-portrait.png"
          alt="Nero Sama"
          draggable={false}
          className="h-full w-full scale-[1.12] object-cover transition-transform duration-700 group-hover:scale-[1.18]"
        />
      </span>

      {/* soft rim highlight */}
      <span className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,255,255,0.18)]" />
    </button>
  );
}
