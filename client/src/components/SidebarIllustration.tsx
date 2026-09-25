import React from 'react';

const SidebarIllustration: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    viewBox="0 0 200 140"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    aria-hidden="true"
  >
    <circle cx="100" cy="22" r="9" fill="#52c41a" opacity="0.55" />
    <rect x="10"  y="80" width="20" height="50" rx="4" fill="#389e0d" opacity="0.45" />
    <rect x="40"  y="60" width="20" height="70" rx="4" fill="#52c41a" opacity="0.55" />
    <rect x="70"  y="90" width="20" height="40" rx="4" fill="#389e0d" opacity="0.40" />
    <rect x="100" y="40" width="20" height="90" rx="4" fill="#52c41a" opacity="0.70" />
    <rect x="130" y="70" width="20" height="60" rx="4" fill="#389e0d" opacity="0.50" />
    <rect x="160" y="50" width="20" height="80" rx="4" fill="#52c41a" opacity="0.65" />
    <line x1="8" y1="130" x2="192" y2="130" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" />
  </svg>
);

export default SidebarIllustration;