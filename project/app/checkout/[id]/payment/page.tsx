"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CreditCard, Wallet as WalletIcon } from 'lucide-react';

// Initialize Mercado Pago SDK
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pix',
    name: 'Pix',
    description: 'Aprovação em 2min',
    icon: <WalletIcon className="h-5 w-5" />,
  },
  {
    id: 'debit',
    name: 'Cartão de Débito',
    description: 'Pagamento à vista',
    icon: <CreditCard className="h-5 w-5" />,
  },
];

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRental = searchParams.get('type') === 'rental';
  
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [total, setTotal] = useState(89.90); // Example price
  const [finalTotal, setFinalTotal] = useState(total);
  const [pixCode, setPixCode] = useState('');
  const [showPixConfirmation, setShowPixConfirmation] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  
  useEffect(() => {
    if (isRental) {
      const termsAccepted = localStorage.getItem('termosAceitos');
      if (!termsAccepted) {
        toast.error('Você precisa aceitar os termos do contrato primeiro');
        router.push(`/checkout/${params.id}`);
      }
    }

    // Create payment preference when component mounts
    createPreference();
  }, [isRental, params.id, router]);

  const createPreference = async () => {
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              title: 'Produto Exemplo',
              quantity: 1,
              currency_id: 'BRL',
              unit_price: finalTotal,
            },
          ],
          payer: {
            email: 'test@example.com',
          },
        }),
      });

      const { id } = await response.json();
      setPreferenceId(id);
    } catch (error) {
      console.error('Error creating preference:', error);
      toast.error('Erro ao processar pagamento');
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setSelectedMethod(value);
    setShowPixConfirmation(false);
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Selecione uma forma de pagamento');
      return;
    }

    if (selectedMethod === 'pix') {
      try {
        const response = await fetch('/api/create-pix', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: finalTotal,
            description: `Pedido #${params.id}`,
          }),
        });

        const { qrCode, copyPaste } = await response.json();
        setPixCode(copyPaste);
        setShowPixConfirmation(true);
      } catch (error) {
        console.error('Error creating Pix:', error);
        toast.error('Erro ao gerar Pix');
      }
    }
  };

  const handlePixConfirmation = async () => {
    try {
      // Check payment status
      const response = await fetch(`/api/check-payment/${params.id}`);
      const { status } = await response.json();

      if (status === 'approved') {
        toast.success('Pagamento confirmado!');
        router.push('/conta/pedidos');
      } else {
        toast.error('Pagamento ainda não confirmado');
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      toast.error('Erro ao verificar pagamento');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Pagamento</CardTitle>
            <CardDescription>
              Escolha sua forma de pagamento preferida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <RadioGroup
                value={selectedMethod}
                onValueChange={handlePaymentMethodChange}
                className="space-y-4"
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${
                      selectedMethod === method.id ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label
                      htmlFor={method.id}
                      className="flex flex-1 items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        {method.icon}
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {showPixConfirmation ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <QRCodeSVG value={pixCode} size={200} />
                    <div className="text-center">
                      <p className="font-medium">Escaneie o QR Code ou</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(pixCode);
                          toast.success('Código Pix copiado!');
                        }}
                        className="text-primary hover:underline"
                      >
                        copie o código Pix
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={handlePixConfirmation}
                    className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                  >
                    Já realizei o pagamento
                  </Button>
                </div>
              ) : selectedMethod === 'debit' && preferenceId ? (
                <div className="w-full flex justify-center">
                  <Wallet initialization={{ preferenceId }} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t">
                      <span>Total</span>
                      <span>R$ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                    disabled={!selectedMethod}
                  >
                    Finalizar Pagamento
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}