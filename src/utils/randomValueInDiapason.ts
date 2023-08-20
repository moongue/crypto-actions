export default function randomValueInDiapason(min: number, max: number) {
  const randomNumber = Math.random() * (max - min) + min;
  return parseFloat(randomNumber.toFixed(6));
}
