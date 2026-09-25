import React from 'react';

const LoginIllustration: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    viewBox="0 0 500 400"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    role="img"
    aria-label="Employee management illustration"
  >
    {/* Background blob */}
    <ellipse cx="250" cy="210" rx="200" ry="150" fill="#ffffff" opacity="0.08" />

    {/* Dashboard card */}
    <rect x="80" y="100" width="340" height="220" rx="16" fill="#ffffff" opacity="0.95" />
    <rect x="80" y="100" width="340" height="44" rx="16" fill="#52c41a" opacity="0.9" />

    {/* Window dots */}
    <circle cx="100" cy="122" r="6" fill="#ffffff" opacity="0.7" />
    <circle cx="120" cy="122" r="6" fill="#ffffff" opacity="0.5" />
    <circle cx="140" cy="122" r="6" fill="#ffffff" opacity="0.5" />

    {/* Sidebar */}
    <rect x="96" y="160" width="70" height="140" rx="8" fill="#f0fff4" />
    <rect x="108" y="176" width="46" height="8" rx="4" fill="#52c41a" />
    <rect x="108" y="194" width="46" height="8" rx="4" fill="#d9f7be" />
    <rect x="108" y="212" width="46" height="8" rx="4" fill="#d9f7be" />
    <rect x="108" y="230" width="46" height="8" rx="4" fill="#d9f7be" />

    {/* Table rows */}
    <rect x="182" y="176" width="220" height="14" rx="4" fill="#389e0d" opacity="0.8" />
    <rect x="182" y="200" width="220" height="10" rx="4" fill="#f0f0f0" />
    <rect x="182" y="220" width="220" height="10" rx="4" fill="#f0f0f0" />
    <rect x="182" y="240" width="220" height="10" rx="4" fill="#f0f0f0" />
    <rect x="182" y="260" width="180" height="10" rx="4" fill="#f0f0f0" />

    {/* Floating avatar card */}
    <g transform="translate(340, 260)">
      <circle cx="40" cy="40" r="46" fill="#ffffff" opacity="0.95" />
      <circle cx="40" cy="30" r="14" fill="#52c41a" />
      <path d="M16 66 Q40 46 64 66 Z" fill="#52c41a" opacity="0.7" />
    </g>

    {/* Small accent dots */}
    <circle cx="60" cy="90" r="6" fill="#ffffff" opacity="0.35" />
    <circle cx="440" cy="120" r="8" fill="#ffffff" opacity="0.25" />
    <circle cx="420" cy="340" r="5" fill="#ffffff" opacity="0.4" />
  </svg>
);

export default LoginIllustration;