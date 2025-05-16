import { NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const payment = await mercadopago.payment.create({
      transaction_amount: body.amount,
      description: body.description,
      payment_method_id: 'pix',
      payer: {
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
      },
    });

    return NextResponse.json({
      qrCode: payment.body.point_of_interaction.transaction_data.qr_code_base64,
      copyPaste: payment.body.point_of_interaction.transaction_data.qr_code,
    });
  } catch (error) {
    console.error('Error creating Pix:', error);
    return NextResponse.json(
      { error: 'Error creating Pix payment' },
      { status: 500 }
    );
  }
}