export const useWait = (millis) => {
  const e = performance.now() + millis;
  while (performance.now() < e) {
    // Arficially long execution time.
  }
};
