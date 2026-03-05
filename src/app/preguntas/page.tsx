'use client'

import { useState } from 'react'

type FAQ = {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: '¿Cuál es el horario de atención?',
    answer: 'Nuestro horario de atención es:\n• Lunes a sábado: 11:00 am a 08:30 pm\n• Domingo: Atención solo virtual',
  },
  {
    question: '¿Hacen envíos a todo el país?',
    answer: 'Sí, realizamos envíos a todo el país a través de Olva Courier.',
  },
  {
    question: '¿Qué formas de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito, débito, transferencias bancarias y pagos por Yape o Plin.',
  },
  {
  question: '¿Puedo cambiar o devolver un producto?',
    answer: `Querida SG Lover,

  Tu satisfacción es nuestra prioridad. Puedes solicitar un cambio de producto siempre que:

  • El producto no haya sido utilizado ni lavado y se encuentre en su empaque original con todas las etiquetas intactas, tal como lo recibiste.
  • No tenga marcas de suciedad o maquillaje.
  • No tenga olor a perfume, desodorante, cosméticos o lavado.

  Revisaremos todos los artículos al recibirlos. Cualquier producto que no cumpla con estas condiciones será devuelto al cliente.

  En caso de notar que el producto ha sido manipulado, no se podrá realizar el cambio. No aceptamos productos que no estén en las condiciones originales de venta.

  Además, el costo del delivery para el cambio es responsabilidad del cliente.

  Para solicitar un cambio, deberás escribirnos por WhatsApp al 944105915 o enviar un correo a sgstudio1606@gmail.com dentro de las 36 horas posteriores a la recepción de tu pedido.

  Por favor incluye:
  • Tus datos personales
  • DNI
  • Correo electrónico
  • Celular
  • Número de pedido
  • Motivo del cambio
  • El nuevo producto que deseas

  Una vez recibido tu mensaje, nos contactaremos contigo y te enviaremos la dirección a la cual deberás enviar el producto. El cambio se realizará al precio vigente del producto.

  Finalmente, no realizamos devoluciones de dinero. Si deseas cambiar un producto, puedes solicitar una gift card para usar en una nueva compra. Esta no tiene fecha de caducidad.

  No se aceptan cambios de productos en oferta.`
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-7 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Preguntas Frecuentes</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border rounded-lg shadow-sm">
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-6 py-4 text-lg font-medium text-gray-800 focus:outline-none flex justify-between items-center"
              >
                {faq.question}
                <span>{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 whitespace-pre-line">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
