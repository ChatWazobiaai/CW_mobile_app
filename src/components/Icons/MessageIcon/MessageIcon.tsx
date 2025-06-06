import React from 'react';
import Svg, {Path} from 'react-native-svg';

const MessageIcon = ({width = 24, height = 24, color = '#000'}) => {
  return (
    <Svg
      viewBox="0 0 233.058 233.058"
      width={width}
      height={height}
      fill={color}
      xmlns="http://www.w3.org/2000/svg">
      <Path d="M116.538,4.05C52.284,4.05,0,45.321,0,96.043c0,28.631,16.729,55.208,45.889,72.911c4.525,2.737,7.635,7.283,8.572,12.478 c2.876,16.045-0.991,32.948-6.758,47.576c19.239-9.134,39.064-23.161,54.8-36.63c3.879-3.314,9.055-4.701,14.087-4.354h0.023 c64.191,0,116.445-41.259,116.445-91.987C233.058,45.321,180.792,4.05,116.538,4.05z" />
    </Svg>
  );
};

export default MessageIcon;
