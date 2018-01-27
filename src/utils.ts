export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function seq(size: number) {
  const arr = [];
  for (let i = 0; i < size; ++i) arr.push(i + 1);
  return arr;
}
