import React from 'react';
import {AbsoluteFill} from 'remotion';

const shellStyles = {
  background: 'linear-gradient(135deg, rgba(15, 16, 18, 0.95), rgba(29, 32, 39, 0.9))',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 32,
  boxShadow: '0 50px 140px rgba(0, 0, 0, 0.48)',
  overflow: 'hidden',
};

export const BrowserShell = ({children, sectionLabel, urlLabel}) => {
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at top, rgba(199, 164, 106, 0.18), transparent 34%), linear-gradient(180deg, #08090b 0%, #111318 100%)',
        color: '#f4efe7',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        padding: '34px 44px',
      }}
    >
      <div style={{display: 'flex', flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
        <div style={{...shellStyles, width: '100%', maxWidth: 1832}}>
          <div
            style={{
              alignItems: 'center',
              background: 'rgba(12, 14, 18, 0.96)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: 14,
              padding: '15px 20px',
            }}
          >
            <div style={{display: 'flex', gap: 10}}>
              <span style={{background: '#ff6b5e', borderRadius: '50%', height: 14, width: 14}} />
              <span style={{background: '#f8c551', borderRadius: '50%', height: 14, width: 14}} />
              <span style={{background: '#33d17a', borderRadius: '50%', height: 14, width: 14}} />
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 999,
                color: 'rgba(248, 243, 234, 0.64)',
                flex: 1,
                fontSize: 17,
                letterSpacing: '0.02em',
                overflow: 'hidden',
                padding: '11px 18px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {urlLabel}
            </div>
            <div
              style={{
                background: 'rgba(216, 194, 154, 0.12)',
                border: '1px solid rgba(216, 194, 154, 0.24)',
                borderRadius: 999,
                color: 'rgba(247, 229, 191, 0.86)',
                fontSize: 14,
                letterSpacing: '0.08em',
                padding: '10px 14px',
                textTransform: 'uppercase',
              }}
            >
              {sectionLabel}
            </div>
          </div>

          <div
            style={{
              background: '#07080b',
              display: 'flex',
              minHeight: 920,
              padding: 18,
            }}
          >
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                borderRadius: 22,
                flex: 1,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
