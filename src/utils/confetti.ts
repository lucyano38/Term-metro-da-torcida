import confetti from 'canvas-confetti';

export function triggerVoteConfetti(primaryColor?: string) {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: primaryColor ? [primaryColor, '#10b981', '#fbbf24', '#ffffff'] : ['#10b981', '#34d399', '#f59e0b', '#ffffff'],
    });
  } catch (e) {
    // Canvas confetti safe ignore
  }
}
