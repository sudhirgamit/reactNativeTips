export const wait = (duration: number = 50) =>
  new Promise(resolve => setTimeout(resolve, duration));
