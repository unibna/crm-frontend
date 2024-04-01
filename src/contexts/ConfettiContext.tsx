import React, { createContext, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

const canvasStyles: React.CSSProperties = {
  position: "absolute",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

interface ConfettiContextType {
  onFire: () => void;
  isDisableFire: boolean;
  setIsDisableFire: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ConfettiContext = createContext<ConfettiContextType | null>(null);

export default function ConfettiProvider({ children }: { children: ReactNode }) {
  const refAnimationInstance = useRef(null);
  const [isDisableFire, setIsDisableFire] = useState(false);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    const tempRef: any = refAnimationInstance;
    tempRef &&
      tempRef.current({
        ...opts,
        origin: { y: 0.5 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 30,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 90,
    });

    makeShot(0.35, {
      spread: 140,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 160,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 180,
      startVelocity: 45,
    });
  }, [makeShot]);

  useEffect(() => {
    // const interval = setInterval(() => !isDisableFire && fire(), 10000);
    // return () => clearInterval(interval);
    fire();
  }, [children]);

  return (
    <ConfettiContext.Provider value={{ onFire: fire, isDisableFire, setIsDisableFire }}>
      <div onMouseDown={fire} style={{ position: "relative" }}>
        {children}
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
      </div>
    </ConfettiContext.Provider>
  );
}
