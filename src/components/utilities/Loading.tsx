import React from "react";

interface SpinnerProps {
  size?: keyof SizeProps;
  color?: keyof ColorProps | string; // Allow string for custom colors
  cover?: "fullScreen" | "parent" | "none";
  backgroundColor?: string; // Allow custom background color
  backgroundOpacity?: number; // Allow custom background opacity
  showText?: boolean; // Option to show/hide "Loading..." text
}

interface SizeProps {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface ColorProps {
  slate: string;
  blue: string;
  red: string;
  green: string;
  white: string;
}

const sizesClasses: SizeProps = {
  xs: "w-4 h-4 border-2",
  sm: "w-5 h-5 border-2",
  md: "w-6 h-6 border-[3px]",
  lg: "w-8 h-8 border-[3px]",
  xl: "w-10 h-10 border-4",
};

const colorClasses: ColorProps = {
  slate: "border-slate-500 border-t-transparent",
  blue: "border-blue-500 border-t-transparent",
  red: "border-red-500 border-t-transparent",
  green: "border-emerald-500 border-t-transparent",
  white: "border-white border-t-transparent",
};

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "slate",
  cover = "none",
  backgroundColor = "white",
  backgroundOpacity = 1,
  showText = true,
}) => {
  const sizeClass = sizesClasses[size];
  const colorClass =
    typeof color === "string" && colorClasses[color as keyof ColorProps]
      ? colorClasses[color as keyof ColorProps]
      : ""; // Use template color if available

  // If the color is a custom color (not a predefined one), use inline style
  const customColorStyle =
    typeof color === "string" && !colorClass
      ? { borderColor: color, borderTopColor: "transparent" }
      : {};

  const textColorClass =
    typeof color === "string" && colorClasses[color as keyof ColorProps]
      ? color.replace("border-", "text-") // Convert border color to text color
      : "";

  const coverClass = () => {
    switch (cover) {
      case "fullScreen":
        return "fixed inset-0 flex items-center justify-center z-50 pointer-events-auto";
      case "parent":
        return "absolute inset-0 flex items-center justify-center pointer-events-none";
      case "none":
      default:
        return "flex items-center justify-center";
    }
  };

  const coverStyle = {
    backgroundColor: backgroundColor,
    opacity: backgroundOpacity,
  };

  return (
    <div className={coverClass()} style={cover !== "none" ? coverStyle : {}}>
      <div className="flex items-center space-x-2">
        <div
          className={`${sizeClass} ${colorClass} rounded-full animate-spin`}
          style={customColorStyle}
        />
        {showText && (
          <span
            className={`${textColorClass} text-lg`}
            style={
              typeof color === "string" && !colorClass ? { color } : {}
            }
          >
            Loading...
          </span>
        )}
      </div>
    </div>
  );
};

export default Spinner;