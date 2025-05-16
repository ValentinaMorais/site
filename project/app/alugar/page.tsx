"use client";

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RentalFormData {
  fullName: string;
  rg: string;
  cpf: string;
  address: string;
  phone: string;
  birthDate: string;
}

export default function AlugarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState<RentalFormData>({
    fullName: '',
    rg: '',
    cpf: '',
    address: '',
    phone: '',
    birthDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateContract = () => {
    if (!selectedDate) {
      alert('Por favor selecione uma data');
      return;
    }

    if (!formData.fullName || !formData.rg || !formData.cpf || !formData.address || !formData.phone || !formData.birthDate) {
      alert('Por favor preencha todos os campos');
      return;
    }

    // Create contract content
    const contractContent = `
CONTRATO DE LOCAÇÃO DE TRAJE

LOCADOR: RL Brechó, estabelecido na [Endereço], inscrito no CNPJ sob nº [CNPJ].

LOCATÁRIO: ${formData.fullName}, portador do RG nº ${formData.rg}, CPF nº ${formData.cpf}, residente e domiciliado em ${formData.address}, telefone ${formData.phone}, data de nascimento ${formData.birthDate}.

1. OBJETO
1.1 O presente contrato tem como objeto a locação de traje para festa junina, para uso exclusivo na data ${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.

2. VALOR E PAGAMENTO
2.1 O valor da locação é de R$ [VALOR], a ser pago no ato da retirada do traje.

3. PRAZO
3.1 O traje deverá ser devolvido em até 24 horas após o evento.

4. RESPONSABILIDADES
4.1 O LOCATÁRIO se responsabiliza por qualquer dano causado ao traje.
4.2 Em caso de dano ou não devolução, o LOCATÁRIO pagará o valor integral do traje.

5. FORO
5.1 Fica eleito o foro da Comarca de [CIDADE] para dirimir quaisquer dúvidas.

[CIDADE], ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}

_______________________
LOCADOR

_______________________
LOCATÁRIO
`;

    // Create blob and download
    const blob = new Blob([contractContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contrato_${formData.fullName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Disable past dates and already rented dates
  const disabledDates = (date: Date) => {
    return date < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Aluguel de Roupas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Selecione a Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disabledDates}
                locale={ptBR}
                className="rounded-md border"
              />
              {selectedDate && (
                <p className="mt-4 text-sm text-gray-600">
                  Data selecionada: {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                onClick={generateContract}
              >
                Prosseguir para Contrato
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}