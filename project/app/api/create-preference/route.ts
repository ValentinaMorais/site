import { NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const preference = await mercadopago.preferences.create({
      items: body.items,
      payment_methods: {
        default_payment_method_id: 'debit_card',
        excluded_payment_methods: [
          { id: 'credit_card' },
        ],
        installments: 1,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
      },
      auto_return: 'approved',
    });

    return NextResponse.json({ id: preference.body.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json(
      { error: 'Error creating payment preference' },
      { status: 500 }
    );
  }
}