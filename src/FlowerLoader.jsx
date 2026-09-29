import React from "react";
import styled from "styled-components";

const petals = [
  { className: "petal1", angle: 0, delay: 0.1 },
  { className: "petal2", angle: 45, delay: 0.2 },
  { className: "petal3", angle: 90, delay: 0.3 },
  { className: "petal4", angle: 135, delay: 0.4 },
  { className: "petal5", angle: 180, delay: 0.5 },
  { className: "petal6", angle: 225, delay: 0.6 },
  { className: "petal7", angle: 270, delay: 0.7 },
  { className: "petal8", angle: 315, delay: 0.8 },
];

export default function FlowerLoader() {
  return (
    <StyledWrapper className="sakura-loader" role="status" aria-label="Loading">
      <span className="sr-only">Loading</span>
      <div className="flower" aria-hidden="true">
        {petals.map((petal) => (
          <div
            className={`petal ${petal.className}`}
            key={petal.className}
            style={{
              transform: `rotate(${petal.angle}deg) translateY(-50%)`,
              animationDelay: `${petal.delay}s`,
            }}
          />
        ))}
        <div className="center" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: grid;
  place-items: center;
  width: 112px;
  height: 112px;
  pointer-events: none;

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .flower {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: rotateFlower 8s ease-in-out infinite;
  }

  .petal {
    position: absolute;
    width: 24px;
    height: 42px;
    background: linear-gradient(180deg, #fcdbdf, #fd688d);
    border-radius: 50%;
    animation: changeColor 8s reverse infinite;
  }

  .center {
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: #f1d2d2;
    border-radius: 50%;
  }

  @keyframes changeColor {
    0% { background: linear-gradient(180deg, #fcdbdf, #fd688d); }
    25% { background: linear-gradient(180deg, #fcd2e3, #fa6094); }
    50% { background: linear-gradient(180deg, #fabefc, #c34ec7); }
    75% { background: linear-gradient(180deg, #f7d6d6, #fd6a6a); }
    100% { background: linear-gradient(180deg, #fcd3fc, #e844f7); }
  }

  @keyframes rotateFlower {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.12) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .flower,
    .petal {
      animation: none;
    }
  }
`;