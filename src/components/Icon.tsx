import Svg, { Circle, Path } from "react-native-svg";

import { colors, iconStroke } from "@/theme/tokens";

export type IconName = "back" | "eye" | "eye-off" | "alert" | "close" | "moon";

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({
  name,
  size = 24,
  color = colors.chalk,
  strokeWidth = iconStroke,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {renderShapes(name, color, strokeWidth)}
    </Svg>
  );
}

function renderShapes(name: IconName, color: string, strokeWidth: number) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "back":
      return <Path d="M15 5l-7 7 7 7" {...common} />;
    case "eye":
      return (
        <>
          <Path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
            {...common}
          />
          <Circle cx={12} cy={12} r={3} {...common} />
        </>
      );
    case "eye-off":
      return (
        <Path
          d="M3 3l18 18M10.6 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"
          {...common}
        />
      );
    case "alert":
      return (
        <>
          <Circle cx={12} cy={12} r={10} {...common} />
          <Path d="M12 7v6M12 17h.01" {...common} />
        </>
      );
    case "close":
      return <Path d="M6 6l12 12M18 6L6 18" {...common} />;
    case "moon":
      return (
        <Path
          d="M14.5 3.5a7 7 0 1 0 5.8 11.2A6 6 0 0 1 14.5 3.5z"
          {...common}
        />
      );
  }
}
