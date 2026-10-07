import Image from 'next/image';

/**
 * Imagen real de medios de pago provista por el cliente
 * (Assets/Imagenes/Medios de pago.jpg, 734×40px). Reemplaza los
 * wordmarks SVG recreados a mano que se usaban antes de tener el
 * asset oficial.
 */
export default function PaymentLogos() {
  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px]">
      <Image
        src="/images/medios-pago.jpg"
        alt="Medios de pago aceptados: Mastercard, Visa, American Express, PayU, DaviPlata, RappiPay, Nequi, Addi"
        width={734}
        height={40}
        className="h-auto w-full rounded-sm bg-white px-2 py-1"
      />
    </div>
  );
}
