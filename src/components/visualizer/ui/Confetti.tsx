import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

type ConfettiProps = {
  fire: boolean;
};

export function Confetti({ fire }: ConfettiProps) {
  // Use a ref to track if we've already triggered for this "true" state
  // This prevents double-triggering in Strict Mode
  const hasFired = useRef(false);

  useEffect(() => {
    if (fire && !hasFired.current) {
      hasFired.current = true;

      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = window.setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return window.clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Cannon 1 (Left)
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });

        // Cannon 2 (Right)
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });
      }, 250);

      return () => window.clearInterval(interval);
    } else if (!fire) {
      // Reset so we can fire again if the prop goes false -> true
      hasFired.current = false;
    }
  }, [fire]);

  return null;
}
