import React from 'react';
import Svg, { Path } from 'react-native-svg';

type MarkItemIconProps = {
  size?: number;  // Optional size prop
  color?: string; // Optional color prop
};

const MarkItemIcon = ({ size = 24, color = '#000000' }: MarkItemIconProps) => {
  return (
    <Svg
      fill={color}  // Dynamically apply color
      viewBox="0 0 52 52"
      width={size}  // Dynamically apply size
      height={size} // Dynamically apply size
    >
      <Path d="M24,7l-1.7-1.7c-0.5-0.5-1.2-0.5-1.7,0L10,15.8l-4.3-4.2c-0.5-0.5-1.2-0.5-1.7,0l-1.7,1.7 c-0.5,0.5-0.5,1.2,0,1.7l5.9,5.9c0.5,0.5,1.1,0.7,1.7,0.7c0.6,0,1.2-0.2,1.7-0.7L24,8.7C24.4,8.3,24.4,7.5,24,7z" />
      <Path d="M48.4,18.4H27.5c-0.9,0-1.6-0.7-1.6-1.6v-3.2c0-0.9,0.7-1.6,1.6-1.6h20.9c0.9,0,1.6,0.7,1.6,1.6v3.2 C50,17.7,49.3,18.4,48.4,18.4z" />
      <Path d="M48.4,32.7H9.8c-0.9,0-1.6-0.7-1.6-1.6v-3.2c0-0.9,0.7-1.6,1.6-1.6h38.6c0.9,0,1.6,0.7,1.6,1.6v3.2 C50,32,49.3,32.7,48.4,32.7z" />
      <Path d="M48.4,47H9.8c-0.9,0-1.6-0.7-1.6-1.6v-3.2c0-0.9,0.7-1.6,1.6-1.6h38.6c0.9,0,1.6,0.7,1.6,1.6v3.2 C50,46.3,49.3,47,48.4,47z" />
    </Svg>
  );
};

export default MarkItemIcon;