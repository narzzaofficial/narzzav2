import { AppWindow } from "lucide-react";

type AgreeAppIconProps = {
  imageUrl?: string | null;
  appName?: string;
  className?: string;
};

export function AgreeAppIcon({ imageUrl, appName = "App", className = "h-4 w-4" }: AgreeAppIconProps) {
  const src = imageUrl?.trim();
  if (!src) {
    return <AppWindow className={`${className} text-slate-600 dark:text-slate-300`} />;
  }

  return (
    <img
      src={src}
      alt={`${appName} icon`}
      className={`${className} object-contain`}
      loading="lazy"
      decoding="async"
    />
  );
}

