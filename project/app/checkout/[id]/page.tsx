"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRental = searchParams.get('type') === 'rental';
  const rentalDate = searchParams.get('date');
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);

  useEffect(() => {
    // Check if terms were previously accepted for rentals
    if (isRental) {
      const accepted = localStorage.getItem('termosAceitos');
      if (accepted) {
        setTermsAccepted(true);
      }
    }
  }, [isRental]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const reachedBottom = 
      Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 50;
    setReachedBottom(reachedBottom);
  };

  const handleAcceptTerms = (checked: boolean) => {
    setTermsAccepted(checked);
    if (checked) {
      localStorage.setItem('termosAceitos', 'true');
      localStorage.setItem('termosAceitosData', new Date().toISOString());
    } else {
      localStorage.removeItem('termosAceitos');
      localStorage.removeItem('termosAceitosData');
    }
  };

  const handleProceed = () => {
    if (isRental && !termsAccepted) {
      toast.error('Você precisa aceitar os termos do contrato para prosseguir');
      return;
    }

    // Proceed to payment
    router.push(`/checkout/${params.id}/payment`);
  };

  if (!isRental) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-padding max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Finalizar Compra</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleProceed}
                className="w-full bg-[#556B2F] hover:bg-[#455a26]"
              >
                Prosseguir para Pagamento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Contrato de Locação</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              onScroll={handleScroll}
              className="contract-viewer bg-white p-6 rounded-lg border border-gray-200 max-h-[500px] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">CONTRATO DE LOCAÇÃO DE TRAJE</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold">1. OBJETO</h3>
                  <p>1.1 O presente contrato tem como objeto a locação de traje para festa junina.</p>
                  {rentalDate && (
                    <p>1.2 Data de retirada: {new Date(rentalDate).toLocaleDateString()}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-bold">2. PRAZO</h3>
                  <p>2.1 O prazo de locação é de 2 (dois) dias corridos.</p>
                  <p>2.2 A devolução após o prazo incorrerá em multa diária.</p>
                </div>
                
                <div>
                  <h3 className="font-bold">3. RESPONSABILIDADES</h3>
                  <p>3.1 O LOCATÁRIO se responsabiliza por qualquer dano causado ao traje.</p>
                  <p>3.2 Em caso de dano ou não devolução, o LOCATÁRIO pagará o valor integral do traje.</p>
                </div>

                <div>
                  <h3 className="font-bold">4. CONDIÇÕES DE USO</h3>
                  <p>4.1 O traje deve ser devolvido nas mesmas condições em que foi retirado.</p>
                  <p>4.2 Não é permitido realizar alterações ou ajustes no traje sem autorização.</p>
                </div>

                <div>
                  <h3 className="font-bold">5. PAGAMENTO</h3>
                  <p>5.1 O pagamento deve ser realizado no ato da retirada do traje.</p>
                  <p>5.2 Será cobrada caução, que será devolvida após a devolução do traje em perfeitas condições.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={handleAcceptTerms}
                  disabled={!reachedBottom}
                />
                <label 
                  htmlFor="terms" 
                  className="text-sm text-gray-700"
                >
                  Li e aceito os termos do contrato
                </label>
              </div>

              <Button
                onClick={handleProceed}
                className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                disabled={!termsAccepted || !reachedBottom}
              >
                Prosseguir para Pagamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}