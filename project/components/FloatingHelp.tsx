"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function FloatingHelp() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-[#556B2F] hover:bg-[#455a26] text-white p-3 rounded-full shadow-lg">
            <HelpCircle className="h-6 w-6" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Precisa de ajuda?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Como alugar uma roupa?</h3>
              <p className="text-sm text-gray-600">
                1. Escolha a peça desejada
                2. Clique em "Alugar"
                3. Faça login ou cadastre-se
                4. Leia e aceite o contrato
                5. Escolha a forma de pagamento
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Formas de pagamento</h3>
              <p className="text-sm text-gray-600">
                Aceitamos PIX e cartão de débito
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Contato</h3>
              <p className="text-sm text-gray-600">
                WhatsApp: (44) 99999-9999
                Email: contato@rlbrecho.com.br
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}