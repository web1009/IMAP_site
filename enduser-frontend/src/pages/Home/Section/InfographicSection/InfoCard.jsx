// InfoCard.jsx
export default function InfoCard({ title, desc, direction, delay }) {
  return (
    <div
      className={`info-card slide-${direction}`}
      style={{ animationDelay: `${delay * 0.25}s` }}
    >
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}
