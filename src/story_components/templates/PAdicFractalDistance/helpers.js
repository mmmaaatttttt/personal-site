function generatePAdicPoints(prime, level) {
  const points = Array.from({ length: prime }, (_, i) => {
    const angle = (Math.PI * 2 * i) / prime + Math.PI / 2;
    return {
      cx: Math.cos(angle),
      cy: Math.sin(angle),
      label: i + 1
    };
  });
  return points;
}

export { generatePAdicPoints };
