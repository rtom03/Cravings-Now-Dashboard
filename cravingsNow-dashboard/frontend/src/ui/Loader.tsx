// Loader.tsx
import React from "react";

interface LoaderProps {
  size?: number;
  color?: string;
  secondaryColor?: string;
  speed?: number;
  label?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 80,
  color = "#6366f1",
  secondaryColor = "#a855f7",
  speed = 1.5,
  label = "Loading...",
}) => {
  const style: React.CSSProperties = {
    width: size,
    height: size,
  };

  return (
    <div className="loader-container">
      <div className="loader" style={style}>
        <div className="loader-core" style={{ backgroundColor: color }} />
        <div
          className="loader-orbit"
          style={{
            borderColor: `${color}40`,
            animationDuration: `${speed}s`,
          }}
        />
        <div
          className="loader-orbit loader-orbit-delayed"
          style={{
            borderColor: `${secondaryColor}40`,
            animationDuration: `${speed * 1.2}s`,
          }}
        />
        <div
          className="loader-particle"
          style={{
            backgroundColor: color,
            animationDuration: `${speed}s`,
          }}
        />
        <div
          className="loader-particle loader-particle-delayed"
          style={{
            backgroundColor: secondaryColor,
            animationDuration: `${speed * 0.8}s`,
          }}
        />
      </div>
      {label && <p className="loader-label">{label}</p>}
    </div>
  );
};

export default Loader;
