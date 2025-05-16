"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RentalContractProps {
  onAccept: (accepted: boolean) => void;
  customerName?: string;
  productDetails?: {
    name: string;
    price: number;
    rentalPeriod: string;
  };
}

export default function RentalContract({
  onAccept,
  customerName = '',
  productDetails
}: RentalContractProps) {
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: any) => {
    const element = e.target as HTMLDivElement;
    const reachedBottom = 
      Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 50;
    
    if (reachedBottom && !hasReachedBottom) {
      setHasReachedBottom(true);
    }
  };

  const handleAccept = (checked: boolean) => {
    setAccepted(checked);
    onAccept(checked);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Contrato de Locação</h2>
        
        <ScrollArea className="h-[400px] w-full rounded-md border p-4" onScrollCapture={handleScroll}>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">CONTRATO DE LOCAÇÃO DE TRAJE</h3>
              <p className="mt-2">
                <strong>LOCADOR:</strong> RL Brechó<br />
                <strong>LOCATÁRIO:</strong> {customerName}
              </p>
            </div>

            <div>
              <h4 className="font-semibold">1. OBJETO</h4>
              <p>
                1.1 O presente contrato tem como objeto a locação de traje para festa junina,
                conforme descrição e condições abaixo:
              </p>
              {productDetails && (
                <ul className="list-disc ml-6 mt-2">
                  <li>Produto: {productDetails.name}</li>
                  <li>Valor: R$ {productDetails.price.toFixed(2)}</li>
                  <li>Período: {productDetails.rentalPeriod}</li>
                </ul>
              )}
            </div>

            <div>
              <h4 className="font-semibold">2. PRAZO</h4>
              <p>2.1 O prazo de locação é de 2 (dois) dias corridos.</p>
              <p>2.2 A devolução após o prazo incorrerá em multa diária de 20% sobre o valor do aluguel.</p>
            </div>

            <div>
              <h4 className="font-semibold">3. RESPONSABILIDADES</h4>
              <p>3.1 O LOCATÁRIO se responsabiliza por:</p>
              <ul className="list-disc ml-6">
                <li>Manter o traje em perfeitas condições</li>
                <li>Não realizar alterações sem autorização</li>
                <li>Devolver no prazo estabelecido</li>
                <li>Arcar com custos de danos ou perdas</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">4. PAGAMENTO</h4>
              <p>4.1 O pagamento deve ser realizado integralmente no ato da retirada.</p>
              <p>4.2 Será cobrada caução no valor de R$ 100,00, devolvida após a devolução do traje em perfeitas condições.</p>
            </div>

            <div>
              <h4 className="font-semibold">5. CONDIÇÕES GERAIS</h4>
              <p>5.1 Este contrato é pessoal e intransferível.</p>
              <p>5.2 A prova do traje é obrigatória no ato da retirada.</p>
              <p>5.3 Não é permitido lavar o traje em casa.</p>
            </div>
          </div>
        </ScrollArea>

        <div className="mt-4 flex items-center gap-2">
          <Checkbox
            id="terms"
            checked={accepted}
            onCheckedChange={handleAccept}
            disabled={!hasReachedBottom}
          />
          <label
            htmlFor="terms"
            className={`text-sm ${!hasReachedBottom ? 'text-gray-400' : 'text-gray-700'}`}
          >
            Li e aceito os termos do contrato
          </label>
        </div>
      </div>

      {!hasReachedBottom && (
        <p className="text-sm text-gray-500 text-center">
          Role até o final para aceitar os termos
        </p>
      )}
    </div>
  );
}