// src/Components/BikeLogoIcon.tsx

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BikeLogoIconProps {
  color?: string; // optional color prop
  width?: number; // optional width prop
  height?: number; // optional height prop
}

const BikeLogoIcon: React.FC<BikeLogoIconProps> = ({
  color = 'black', // default color
  width = 24,     // default width
  height = 24,    // default height
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 7C18.44 7 17.91 7.11 17.41 7.28L14.46 1.5H11V3H13.54L14.42 4.72L12 10.13L10.23 5.95C10.5 5.85 10.74 5.58 10.74 5.25C10.74 4.84 10.41 4.5 10 4.5H8C7.58 4.5 7.24 4.84 7.24 5.25C7.24 5.66 7.58 6 8 6H8.61L10.86 11.25H9.92C9.56 8.85 7.5 7 5 7C2.24 7 0 9.24 0 12C0 14.76 2.24 17 5 17C7.5 17 9.56 15.15 9.92 12.75H12.5L15.29 6.43L16.08 7.96C15.4377 8.42011 14.914 9.02645 14.5524 9.72894C14.1907 10.4314 14.0014 11.2099 14 12C14 14.76 16.24 17 19 17C21.76 17 24 14.76 24 12C24 9.24 21.76 7 19 7ZM5 15.5C3.07 15.5 1.5 13.93 1.5 12C1.5 10.07 3.07 8.5 5 8.5C6.67 8.5 8.07 9.68 8.41 11.25H4V12.75H8.41C8.24017 13.5284 7.80949 14.2254 7.18932 14.7256C6.56915 15.2257 5.79671 15.4989 5 15.5ZM19 15.5C17.07 15.5 15.5 13.93 15.5 12C15.5 10.92 16 9.97 16.77 9.33L18.57 12.85L19.89 12.13L18.1 8.63C18.39 8.56 18.69 8.5 19 8.5C20.93 8.5 22.5 10.07 22.5 12C22.5 13.93 20.93 15.5 19 15.5ZM11 20H7L13 23V21H17L11 18V20Z"
      fill={color} // use color prop here
    />
  </Svg>
);

export default BikeLogoIcon;