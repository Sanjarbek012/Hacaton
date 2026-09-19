import FlaskArt from './FlaskArt';

export default function Loader({ label = 'Yuklanmoqda...' }: { label?: string }) {
  return (
    <div className="loader" role="status">
      <FlaskArt size={72} />
      <span>{label}</span>
    </div>
  );
}
