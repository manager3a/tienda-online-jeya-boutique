/**
 * Wordmarks de medios de pago recreados en SVG (vectorial, por eso nítidos
 * en cualquier resolución/zoom) ya que este entorno no tiene acceso a
 * bancos de íconos externos para descargar los logos oficiales en PNG/SVG.
 * Son representaciones estilizadas con los colores de marca de cada medio
 * de pago, no los archivos de marca oficiales — se pueden reemplazar por
 * los assets reales cuando el cliente los facilite.
 */
export default function PaymentLogos() {
  const logos = [
    { name: 'Mastercard', node: <MastercardMark /> },
    { name: 'American Express', node: <AmexMark /> },
    { name: 'Visa', node: <VisaMark /> },
    { name: 'PayU', node: <TextMark label="PayU" color="#4ba847" /> },
    { name: 'DaviPlata', node: <TextMark label="daviplata" color="#e4032e" /> },
    { name: 'RappiPay', node: <TextMark label="RappiPay" color="#ff441f" /> },
    { name: 'Nequi', node: <TextMark label="nequi" color="#d23fd1" /> },
    { name: 'Addi', node: <TextMark label="addi" color="#1a1a1a" /> },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Medios de pago aceptados">
      {logos.map((l) => (
        <span
          key={l.name}
          title={l.name}
          className="flex h-9 min-w-[60px] items-center justify-center rounded-sm bg-white px-3"
        >
          {l.node}
        </span>
      ))}
    </div>
  );
}

function TextMark({ label, color }: { label: string; color: string }) {
  return (
    <span className="font-heading text-sm font-extrabold italic tracking-tight" style={{ color }}>
      {label}
    </span>
  );
}

function MastercardMark() {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true">
      <circle cx="16" cy="12" r="10" fill="#EB001B" />
      <circle cx="24" cy="12" r="10" fill="#F79E1B" />
      <path
        d="M20 4.5a10 10 0 0 1 0 15 10 10 0 0 1 0-15Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function VisaMark() {
  return (
    <svg width="46" height="16" viewBox="0 0 46 16" aria-hidden="true">
      <text
        x="0"
        y="13"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontWeight="bold"
        fontSize="16"
        fill="#1A1F71"
      >
        VISA
      </text>
    </svg>
  );
}

function AmexMark() {
  return (
    <svg width="44" height="24" viewBox="0 0 44 24" aria-hidden="true">
      <rect width="44" height="24" rx="3" fill="#2E77BC" />
      <text
        x="22"
        y="15"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="8"
        fill="#fff"
      >
        AMEX
      </text>
    </svg>
  );
}
