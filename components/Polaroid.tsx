import type { CSSProperties } from 'react';

type Props = {
  src: string;
  alt: string;
  /** handwritten caption in the bottom border */
  caption: string;
  /** tilt in degrees (negative = counter-clockwise) */
  rotate?: number;
  /** tape placement */
  tape?: 'top' | 'top-left' | 'top-right' | 'both';
  /** width in px (photo scales to fit) */
  width?: number;
  /** photo window aspect ratio, e.g. "4 / 5" (portrait) or "3 / 2" (landscape) */
  aspect?: string;
  className?: string;
};

export default function Polaroid({
  src,
  alt,
  caption,
  rotate = -3,
  tape = 'top',
  width = 260,
  aspect = '4 / 5',
  className = '',
}: Props) {
  const style = { '--rot': `${rotate}deg`, width } as CSSProperties;
  const photoStyle = { aspectRatio: aspect } as CSSProperties;
  const tapes =
    tape === 'both' ? ['top-left', 'top-right'] : [tape];

  return (
    <figure className={`polaroid ${className}`} style={style}>
      {tapes.map((t) => (
        <span key={t} className={`polaroid-tape polaroid-tape-${t}`} aria-hidden="true" />
      ))}
      <div className="polaroid-photo" style={photoStyle}>
        <img src={src} alt={alt} loading="lazy" />
      </div>
      <figcaption className="polaroid-caption">{caption}</figcaption>
    </figure>
  );
}
