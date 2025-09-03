
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C10.866 6.33 12.83 5.25 15 5.25c2.17 0 4.134 1.08 5.685 2.334 1.551-1.254 3.515-2.334 5.685-2.334 1.34 0 2.5.525 3.375 1.375a.75.75 0 01-1.06 1.06c-.46-.46-.995-.71-1.565-.71-1.336 0-2.672.69-4.008 1.737a.75.75 0 01-1.12.02L15 8.053l-1.768 1.768a.75.75 0 01-1.12 0l-1.768-1.768-1.768 1.768a.75.75 0 01-1.06-1.061c.46-.46.995-.71 1.565-.71 1.336 0 2.672.69 4.008 1.737a.75.75 0 011.12 0l1.768 1.768-1.768 1.768a.75.75 0 11-1.06 1.06l1.768-1.767-1.768-1.768a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

export default SparklesIcon;
