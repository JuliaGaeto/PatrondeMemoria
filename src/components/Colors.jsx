export default function Color({ color, onClick, flash }) {
  return (
    <div
      className={`colorCard ${color} ${flash ? "flash" : ""}`}
      onClick={onClick}
    ></div>
  );
}
