import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-[#333] text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO + DESCRIPCIÓN */}
        <div className="flex flex-col gap-3">
          <Image
            src="/logo.png"
            alt="SolangeSublime"
            width={120}
            height={120}
            className="object-contain"
          />
          <p className="text-sm text-gray-300">
            © 2024 SolangeSublime. Todos los derechos reservados.
          </p>
        </div>

        {/* MEDIOS DE PAGO */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Medios de pago</h2>

          <div className="flex items-center gap-4 flex-wrap">
            <Image src="/mercado-pago.svg" alt="Mercado Pago" width={80} height={40} />
            <Image src="/banco-estado.svg" alt="Banco Estado" width={80} height={40} />
            <Image src="/transferencia.svg" alt="Transferencia" width={80} height={40} />
          </div>
        </div>

        {/* QUIÉNES SOMOS */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Quiénes somos</h2>
          <p className="text-sm text-gray-300">
            Somos una tienda enfocada en ofrecer productos de calidad con una experiencia simple y segura.
          </p>
        </div>

        {/* CONTACTO + REDES */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Contacto</h2>
          <p className="text-sm text-gray-300">contacto@solangesublime.cl</p>

          <h2 className="text-lg font-semibold mt-2">Redes sociales</h2>
          <div className="flex gap-4 items-center">
            <a href="#" className="hover:scale-110 transition">
              <Image src="/instagram.svg" alt="Instagram" width={22} height={22} />
            </a>

            <a href="#" className="hover:scale-110 transition">
              <Image src="/facebook.svg" alt="Facebook" width={22} height={22} />
            </a>

            <a href="https://wa.me/569XXXXXXXX" className="hover:scale-110 transition">
              <Image src="/whatsapp.svg" alt="WhatsApp" width={22} height={22} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;