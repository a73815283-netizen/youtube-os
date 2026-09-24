interface BouncyLettersProps {
  text: string;
  className?: string;
  interval?: number;
}

export function BouncyLetters({ text, className, interval = 0.035 }: BouncyLettersProps) {
  const letters = [...text];
  return (
    <span className={`yo-letters${className ? ` ${className}` : ''}`} aria-label={text}>
      {letters.map((ch, i) => (
        <span key={i} className="yo-letter" style={{ animationDelay: `${i * interval}s` }}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
}