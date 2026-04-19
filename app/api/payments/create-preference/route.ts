import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configurar MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: { 
    timeout: 5000,
    idempotencyKey: 'abc' 
  }
})

const preference = new Preference(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, amount, description, payerEmail, payerName } = body

    // Validar datos requeridos
    if (!bookingId || !amount || !description || !payerEmail) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Configurar la preferencia de pago
    const preferenceData = {
      items: [
        {
          id: bookingId,
          title: description,
          description: `Reserva de viaje - ${description}`,
          category_id: "services",
          quantity: 1,
          currency_id: "ARS" as const,
          unit_price: Number(amount)
        }
      ],
      payer: {
        name: payerName,
        email: payerEmail
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending`
      },
      auto_return: "approved" as const,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
      statement_descriptor: "TagAlong Viajes",
      external_reference: bookingId,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    }

    // Crear la preferencia en MercadoPago
    const response = await preference.create({ body: preferenceData })

    return NextResponse.json({
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point
    })

  } catch (error) {
    console.error('Error creando preferencia de MercadoPago:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 