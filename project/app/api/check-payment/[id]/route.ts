import { NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await mercadopago.payment.get(parseInt(params.id));
    
    return NextResponse.json({
      status: payment.body.status,
    });
  } catch (error) {
    console.error('Error checking payment:', error);
    return NextResponse.json(
      { error: 'Error checking payment status' },
      { status: 500 }
    );
  }
}