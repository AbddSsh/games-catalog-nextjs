interface IHeaderLogoProps {
  text?: string;
  imageUrl?: string;
}

export function HeaderLogo({ text = "GameSite" }: IHeaderLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-text-primary">{text}</span>
      <span className="rounded bg-accent-primary px-2 py-0.5 text-xs font-semibold text-white">
        GAMES
      </span>
    </div>
  );
}
