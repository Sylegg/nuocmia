import Image from "next/image";

export function ArcanaLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/arcana_logo_champagne.png"
      alt=""
      width={1080}
      height={1080}
      loading="eager"
      className={className}
    />
  );
}
