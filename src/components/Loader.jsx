import React from "react";

const Loader = ({ size = 48, text = "Loading..." }) => {
  const svgSize = size;

  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Inline SVG spinner with animateTransform so it works even if utility classes are purged */}
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 50 50"
        className="text-orange-500"
        aria-hidden="true"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="rgba(226,232,240,0.6)"
          strokeWidth="6"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          d="M25 5 a20 20 0 0 1 0 40"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      {text && <p className="mt-3 text-gray-600">{text}</p>}
    </div>
  );
};

export default Loader;
