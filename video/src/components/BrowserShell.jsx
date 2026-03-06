import React from 'react';
import {AbsoluteFill} from 'remotion';

export const BrowserShell = ({children}) => {
  return (
    <AbsoluteFill
      style={{
        background: '#07080b',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
