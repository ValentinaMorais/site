import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { cep } = await request.json();
    const cleanCep = cep.replace(/\D/g, '');
    
    let shippingFee = 0;
    let available = false;
    let city = '';

    // Maringá
    if (cleanCep.startsWith('87047')) {
      shippingFee = 10;
      available = true;
      city = 'Maringá';
    } 
    // Sarandi
    else if (cleanCep.startsWith('87111')) {
      shippingFee = 15;
      available = true;
      city = 'Sarandi';
    }

    return NextResponse.json({
      shippingFee,
      available,
      city,
      message: available 
        ? `Entrega disponível para ${city} - R$ ${shippingFee.toFixed(2)}`
        : 'Entrega não disponível para esta região'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao calcular frete' },
      { status: 500 }
    );
  }
}