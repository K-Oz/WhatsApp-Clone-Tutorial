import React from 'react';
import { Switch } from 'react-router-dom';

interface AnimatedSwitchProps {
  children: React.ReactNode;
}

// Simple wrapper around Switch for now
// Can be enhanced with animations later
const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({ children }) => {
  return <Switch>{children}</Switch>;
};

export default AnimatedSwitch;
