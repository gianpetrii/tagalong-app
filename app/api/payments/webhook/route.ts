import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { PaymentManager } from '@/lib/payment-manager'

// Configurar MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook MercadoPago recibido:', body)

    // Verificar que es una notificación de pago
    if (body.type !== 'payment') {
      return NextResponse.json({ message: 'Tipo de notificación no soportado' })
    }

    const paymentId = body.data.id

    // Obtener los detalles del pago desde MercadoPago
    const paymentInfo = await payment.get({ id: paymentId })

    console.log('Información del pago:', paymentInfo)

    // Mapear el estado de MercadoPago a nuestro sistema
    const statusMapping: Record<string, string> = {
      'approved': 'approved',
      'pending': 'pending',
      'in_process': 'in_process',
      'rejected': 'rejected',
      'cancelled': 'cancelled',
      'refunded': 'refunded'
    }

    const ourStatus = statusMapping[paymentInfo.status!] || 'pending'
    const bookingId = paymentInfo.external_reference!

    // Buscar el pago en nuestra base de datos por bookingId
    // (necesitaremos implementar una función para esto)
    
    // Por ahora, vamos a crear un nuevo pago si no existe
    try {
      const paymentDbId = await PaymentManager.createPayment(
        bookingId,
        paymentInfo.transaction_amount!,
        'mercadopago',
        'ARS',
        `Pago de reserva ${bookingId}`,
        bookingId,
        {
          email: paymentInfo.payer?.email || '',
          identification: paymentInfo.payer?.identification ? {
            type: paymentInfo.payer.identification.type || '',
            number: paymentInfo.payer.identification.number || ''
          } : undefined,
          phone: paymentInfo.payer?.phone ? {
            area_code: paymentInfo.payer.phone.area_code || '',
            number: paymentInfo.payer.phone.number || ''
          } : undefined
        }
      )

      // Actualizar el estado del pago
      await PaymentManager.updatePaymentStatus(
        paymentDbId,
        ourStatus as any,
        paymentId.toString(),
        paymentInfo.collector_id
      )

    } catch (error) {
      console.error('Error procesando pago:', error)
      // Intentar actualizar un pago existente
      // Esta lógica se puede mejorar con una búsqueda más específica
    }

    return NextResponse.json({ message: 'Webhook procesado correctamente' })

  } catch (error) {
    console.error('Error procesando webhook de MercadoPago:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Manejar GET requests para verificación de MercadoPago
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Webhook endpoint activo' })
} 