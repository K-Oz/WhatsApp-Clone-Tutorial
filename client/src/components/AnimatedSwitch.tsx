import React from 'react';
import { Switch } from 'react-router-dom';

// Simple wrapper around Switch for now
// Can be enhanced with animations later
const AnimatedSwitch: React.FC<any> = ({ children }) => {
  return <Switch>{children}</Switch>;
};

export default AnimatedSwitch;
