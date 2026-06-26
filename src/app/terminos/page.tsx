export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white px-8 py-16">
      <div className="max-w-5xl mx-auto bg-white p-12 rounded-lg shadow-md space-y-10">
        <h1 className="text-3xl text-black font-bold">Términos y Condiciones</h1>

        <hr className="border-gray-200" />

        {/* POLÍTICA DE CAMBIOS Y DEVOLUCIONES */}
        <section>
          <h2 className="text-2xl text-black font-bold mb-6">Política de Cambios y Devoluciones</h2>

          <p className="text-black font-semibold mb-1">Los productos en liquidación no aplican para cambio.</p>
          <p className="text-gray-700 mb-2">
            Todo cambio de color/talla por errores de selección por parte del cliente se estará gestionando según stock y se extendería de 1 a 3 días más al plazo de entrega.
          </p>
          <p className="text-gray-700 mb-2">
            Una vez emitida una nota de crédito, no será posible realizar una devolución de dinero correspondiente a la compra original. Esta medida aplica exclusivamente en casos donde el cliente ya ha optado por recibir una nota de crédito y esta ya ha sido efectuada por la empresa.
          </p>
          <p className="text-gray-700 mb-4">
            Las devoluciones se procesarán únicamente a través del mismo método de pago utilizado al momento de la compra, sin excepciones. El reembolso se realizará exclusivamente a la misma tarjeta por la persona que efectuó la compra. No se realizarán devoluciones a tarjetas distintas ni a nombres de terceros, independientemente del vínculo con el comprador.
          </p>

          <h3 className="text-lg text-black font-bold mb-2">¿Plazos para cambios y/o devoluciones?</h3>
          <p className="text-gray-700 mb-4">
            15 días calendario una vez realizada la compra. Válido tanto en web como en tiendas.
          </p>

          <h3 className="text-lg text-black font-bold mb-2">Condiciones de cambios y/o devoluciones</h3>
          <p className="text-gray-700 mb-2">
            Las siguientes condiciones deberán cumplirse en su totalidad. Caso contrario, <span className="font-semibold">NO SE PROCEDERÁ CON EL CAMBIO</span>.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
            <li>
              <span className="font-semibold">Productos en perfecto estado:</span> Indispensable que el/los productos se encuentren en perfectas condiciones: en buen estado y con etiqueta puestas (de tela y de cartón). El/los productos no deben presentar señales de uso.
            </li>
            <li>
              Se deberá indicar el número de pedidos y datos completos (para compras realizadas vía web) o la boleta (para compras en tienda).
            </li>
            <li>
              <span className="font-semibold">Sujeto a stock:</span> Los cambios del producto estarán sujetos al stock existente. En caso no exista stock del producto, se podrá optar por otro producto de igual valor o mayor valor (asumiendo la diferencia excedente).
            </li>
            <li>
              Para cambios en Trujillo se procederá acorde al stock disponible, el cual podrá solicitar en nuestra tienda física.
            </li>
            <li>
              Si no está en la ciudad de Trujillo, deberá enviar el paquete a Trujillo para luego proceder con el cambio; este será sujeto a stock. De igual manera los gastos de envío son asumidos por el cliente.
            </li>
          </ul>

          <h3 className="text-lg text-black font-bold mb-2">¿Cómo realizo un cambio?</h3>
          <p className="text-gray-700 mb-2">
            Escríbenos por WhatsApp al número +51 944 105 915; explicando el motivo del cambio que desees realizar y adjuntando foto del producto a cambiar. <span className="font-semibold">TODA LA SOLICITUD DE CAMBIO ESTÁ SUJETA A EVALUACIÓN</span>, podemos rechazar la solicitud de cambio en caso detectemos un incumplimiento de las condiciones de cambio y/o devoluciones.
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Los cambios son válidos únicamente en tiendas:</span> Puedes acercarte a cualquiera de nuestras sucursales con tu boleta de compra y número de pedido para realizar el cambio, todo ello previa coordinación con la marca vía WhatsApp al +51 944 105 915 y sujeto a stock de tienda.
          </p>
          <p className="text-gray-700 font-semibold mb-1">Para cambios fuera de la ciudad de Trujillo:</p>
          <p className="text-gray-700 mb-2">
            La clienta deberá comunicarse vía WhatsApp al +51 944 105 915 para solicitar los datos de envío a nuestra central en Trujillo. Luego procederá a acercarse a la agencia de Shalom o Olva más cercana y enviar el producto <span className="font-semibold">COMPLETAMENTE SELLADO Y EMBALADO</span>.
          </p>
          <p className="text-gray-700 mb-4">
            Una vez recibido el producto y validadas las condiciones de cambio y/o devoluciones procederemos con el nuevo envío, el cual será asumido por el cliente.
          </p>

          <h3 className="text-lg text-black font-bold mb-2">¿Se puede realizar devoluciones?</h3>
          <p className="text-gray-700 mb-4">
            No se realizan devoluciones en efectivo u otro medio de pago. El cambio se puede realizar con otra prenda de igual o mayor precio (pagando el excedente). No se realizan cambios de prendas compradas en liquidación o prendas con signos de uso.
          </p>

          <h3 className="text-lg text-black font-bold mb-2">¿Problemas con tu producto o pedido?</h3>
          <p className="text-gray-700 mb-2">
            ¡Descuida! Te solicitamos las disculpas respectivas en caso exista alguna falla en tu producto, error de envío o falta de stock. Procederíamos a realizar el cambio o devolución siempre que se cumpla lo establecido:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-2">
            <li>
              Es indispensable que el/los productos se encuentren en las mismas condiciones en las que fueron entregados: con etiquetas puestas (de tela y de cartón). El/los productos no deben presentar señales de uso. Se procederá con el cambio o devolución previa evaluación y si la notificación se encuentra dentro de los 30 días calendario.
            </li>
            <li>
              <span className="font-semibold">Sujeto a stock:</span> Los cambios del producto estarán sujetos al stock existente. En caso no exista stock del producto, el usuario podrá optar por otro producto de igual valor o solicitar su devolución.
            </li>
            <li>
              Para cambios fuera de Trujillo, el usuario deberá comunicarse vía WhatsApp al +51 944 105 915 para solicitar los datos de envío a nuestra central en Trujillo. Luego procederá a acercarse a la agencia de Olva Courier más cercana y enviar el producto <span className="font-semibold">COMPLETAMENTE SELLADO Y EMBALADO</span>.
            </li>
            <li>El costo del retorno de prenda y nuevo envío será asumido por nosotros.</li>
          </ul>
        </section>

        <hr className="border-gray-200" />

        {/* CONDICIONES DEL SERVICIO */}
        <section>
          <h2 className="text-2xl text-black font-bold mb-6">Condiciones del Servicio</h2>
          <h3 className="text-lg text-black font-bold mb-2">Términos y condiciones de envío</h3>

          <h4 className="text-base text-black font-semibold mb-1">¿Cuánto tardaré en recibir mi pedido?</h4>
          <p className="text-gray-700 mb-2">
            Todos los pedidos realizados a través de nuestra web son enviados exclusivamente mediante Olva Courier, con el fin de garantizar mayor seguridad y control en las entregas.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-2">
            <li><span className="font-semibold">Provincias:</span> El tiempo estimado es de 3 a 4 días hábiles.</li>
            <li>El tiempo de envío puede variar entre 1 a 2 días hábiles adicionales, dependiendo del stock disponible y la hora en que se realizó la compra.</li>
          </ul>
          <p className="text-gray-700 mb-2">
            Los envíos hacia la agencia se realizan de lunes a viernes.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-2">
            <li>Si realizas tu compra viernes por la tarde, sábado o domingo, tu pedido será programado para envío el lunes siguiente.</li>
            <li>Si realizas tu compra en feriados, tu pedido se enviará el primer día hábil próximo.</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Es importante tener en cuenta que los plazos de entrega podrían extenderse por motivos externos a SG STUDIO, tales como retrasos por parte del Courier o factores ajenos a nuestro control.
          </p>

          <h4 className="text-base text-black font-semibold mb-1">Direcciones fuera de cobertura</h4>
          <p className="text-gray-700 mb-4">
            En caso de que la dirección proporcionada por el cliente no se encuentre dentro de la cobertura de Olva Courier, nuestros asesores se comunicarán directamente para solicitar un cambio de dirección o coordinar el recojo en la agencia de tu preferencia.
          </p>

          <h4 className="text-base text-black font-semibold mb-1">¿Cómo hago seguimiento a mi pedido?</h4>
          <p className="text-gray-700 mb-2">
            Cuando hayamos hecho el envío de tu pedido, un encargado se comunicará contigo y te enviará el tracking de tu pedido.
          </p>
          <p className="text-gray-700 mb-4">
            Podrás ingresar a la misma página de Olva para poder realizar el rastreo de tu pedido.{' '}
            <a href="https://www.olvacourier.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
              www.olvacourier.com
            </a>
          </p>

          <h4 className="text-base text-black font-semibold mb-1">¿Qué requisitos necesito para hacer el recojo de mi compra?</h4>
          <p className="text-gray-700 font-semibold mb-1">Si el titular de la compra lo recibe, debe tener:</p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-2">
            <li>Ser mayor de edad.</li>
            <li>Foto del pedido realizado.</li>
            <li>Foto de DNI.</li>
          </ul>
          <p className="text-gray-700 font-semibold mb-1">Si lo recibe otra persona que no es el titular, debe presentar estos datos:</p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-2">
            <li>Foto del pedido realizado.</li>
            <li>Foto de DNI.</li>
            <li>Consentimiento del titular.</li>
          </ul>
          <p className="text-gray-700 mb-4">
            No se puede enviar a un repartidor a recoger una compra. La entrega solo se hará al titular de la compra u otra persona bajo el consentimiento del titular.
          </p>

          <h4 className="text-base text-black font-semibold mb-1">¿En cuánto tiempo tengo para recoger un producto en tienda?</h4>
          <p className="text-gray-700 mb-2">
            Desde el día que fue confirmado tu pedido para recojo, cuentas con un tiempo máximo de 15 días hábiles para recogerlo.
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Nota:</span> De lo contrario, la empresa no se hace responsable de tu pedido.
          </p>
        </section>

        <hr className="border-gray-200" />

        <p className="text-sm text-gray-500">Última actualización: Junio 2026</p>
      </div>
    </div>
  );
}
