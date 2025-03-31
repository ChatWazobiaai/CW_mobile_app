import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowCircleLeftIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const ArrowCircleLeftIcon: React.FC<ArrowCircleLeftIconProps> = ({
  width = 24,
  height = 24,
  color = '#000',
}) => {
  return (
    <Svg viewBox="0 0 24 24" width={width} height={height} fill="none">
      <Path
        d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ArrowCircleLeftIcon;