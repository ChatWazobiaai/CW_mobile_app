import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface ArrowLeftIconProps {
  width?: number; // Optional width
  height?: number; // Optional height
  color?: string; // Optional color
}

const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({
  width = 24, // Default width
  height = 24, // Default height
  color = 'currentColor', // Default color
}) => {
  return (
    <Svg viewBox="0 0 24 24" width={width} height={height} fill={color}>
      <Path d="M13.54 18a2.06 2.06 0 0 1-1.3-.46l-5.1-4.21a1.7 1.7 0 0 1 0-2.66l5.1-4.21a2.1 2.1 0 0 1 2.21-.26 1.76 1.76 0 0 1 1.05 1.59v8.42a1.76 1.76 0 0 1-1.05 1.59 2.23 2.23 0 0 1-.91.2z" />
    </Svg>
  );
};

export default ArrowLeftIcon;
