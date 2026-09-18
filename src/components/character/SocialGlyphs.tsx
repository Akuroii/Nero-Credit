import type { SocialLink } from '../../data/characters';
import type { ReactElement } from 'react';

type IconProps = { className?: string };

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function YouTubeGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitchGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M5 4h15v10.5l-4 4h-4l-2.5 2.5V18.5H5V4Z" />
      <path d="M13.5 8v4M17.5 8v4" />
    </svg>
  );
}

function DiscordGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M6 8.5C8 6.8 10 6 12 6s4 .8 6 2.5c1.2 2.6 1.6 5.6 1.4 9-2 1-3.6 1.3-3.6 1.3l-.8-1.4M6 8.5C4.8 11.1 4.4 14.1 4.6 17.5c2 1 3.6 1.3 3.6 1.3l.8-1.4" />
      <circle cx="9.3" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="13" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M13 4v10.2a2.8 2.8 0 1 1-2.4-2.77" />
      <path d="M13 4c.3 2 1.8 3.5 3.8 3.8" />
    </svg>
  );
}

function InstagramGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.7" cy="7.3" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

const glyphs: Record<SocialLink['id'], (props: IconProps) => ReactElement> = {
  youtube: YouTubeGlyph,
  twitch: TwitchGlyph,
  discord: DiscordGlyph,
  tiktok: TikTokGlyph,
  instagram: InstagramGlyph,
};

export function SocialGlyph({ id, className }: { id: SocialLink['id']; className?: string }) {
  const Glyph = glyphs[id];
  return <Glyph className={className} />;
}
