import Realistic from "react-canvas-confetti/dist/presets/realistic";
// import Fireworks from "react-canvas-confetti/dist/presets/explosion";

export default function Confetti() {
  return <Realistic autorun={{ speed: 1, duration: 600 }} />;
}
