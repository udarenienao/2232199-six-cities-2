function generateRandomNumber(min: number, max: number, numAfterDigit = 0): number {
  return +(Math.random() * (max - min) + min).toFixed(numAfterDigit);
}

function getRandomItems<T>(items: T[]): T[] {
  const randomStartIndex = generateRandomNumber(0, items.length - 1);
  const randomEndIndex = randomStartIndex + generateRandomNumber(0, items.length - randomStartIndex);
  return items.slice(randomStartIndex, randomEndIndex + 1);
}

function getRandomItem<T>(items: T[]): T {
  const randomIndex = generateRandomNumber(0, items.length - 1);
  return items[randomIndex];
}

export { generateRandomNumber, getRandomItems, getRandomItem };
