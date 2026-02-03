import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

interface LoaderProps {
  size?: string;
  color?: string;
  strokeWidth?: string;
  className?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = "40", 
  color = "#0EA4A9", 
  strokeWidth = "5", 
  className = "",
  fullScreen = false
}) => {
  const content = (
    <div className={`flex items-center justify-center ${className} ${fullScreen ? "h-screen w-screen bg-black/50 backdrop-blur-sm fixed inset-0 z-[9999]" : ""}`}>
      <RotatingLines
        strokeColor={color}
        strokeWidth={strokeWidth}
        animationDuration="0.75"
        width={size}
        visible={true}
      />
    </div>
  );

  return content;
};

export default Loader;
