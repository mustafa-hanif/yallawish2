declare module 'react-native-confetti-cannon' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export interface ConfettiCannonProps extends ViewProps {
    count?: number;
    origin?: { x: number; y: number };
    autoStart?: boolean;
    fadeOut?: boolean;
    fallSpeed?: number;
    explosionSpeed?: number;
    colors?: string[];
  }

  export default class ConfettiCannon extends React.Component<ConfettiCannonProps> { }
}
