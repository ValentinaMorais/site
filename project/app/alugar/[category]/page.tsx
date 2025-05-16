"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { addDays } from 'date-fns';

interface Product {
  id: string;
  name: string;
  rentPrice: number;
  image: string;
}

interface Address {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const products: Record<string, Product[]> = {
  vestidos: [
    {
      id: '1',
      name: 'Vestido Floral Festa Junina',
      rentPrice: 49.90,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
    },
    {
      id: '2',
      name: 'Vestido Xadrez Tradicional',
      rentPrice: 39.90,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
    },
    {
      id: '3',
      name: 'Vestido Caipira Luxo',
      rentPrice: 59.90,
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
    },
  ],
  jardineiras: [
    {
      id: '1',
      name: 'Jardineira Xadrez Tradicional',
      rentPrice: 39.90,
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
    },
    {
      id: '2',
      name: 'Jardineira Jeans Festa',
      rentPrice: 49.90,
      image: 'https://images.unsplash.com/photo-1617551307578-7f5159d63456',
    },
  ],
};

const relatedProducts: Record<string, Product[]> = {
  vestidos: [
    {
      id: '1',
      name: 'Chapéu de Palha Decorado',
      rentPrice: 15.90,
      image: 'https://images.unsplash.com/photo-1576188973526-aa7e0530edf9',
    },
  ],
};

export default function CategoryPage({ params }: { params: { category: string }}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<Address | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [cepError, setCepError] = useState('');

  const category = params.category;
  const categoryProducts = products[category] || [];
  const related = relatedProducts[category] || [];

  const categoryTitles: Record<string, string> = {
    vestidos: 'Vestidos para Festa Junina',
    jardineiras: 'Jardineiras para Festa Junina',
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length === 8) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    
    setCep(value);
    setCepError('');
    setShowCalendar(false);
    setAddress(null);

    if (value.length === 9) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${value.replace('-', '')}/json/`);
        if (response.data.erro) {
          setCepError('CEP não encontrado');
          return;
        }
        setAddress(response.data);
        setShowCalendar(true);
      } catch (error) {
        setCepError('Erro ao buscar CEP');
      }
    }
  };

  const handleRent = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const disabledDates = (date: Date) => {
    return date < new Date();
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const getReturnDate = (startDate: Date) => {
    return addDays(startDate, 2);
  };

  const handleProceedToCheckout = () => {
    if (selectedProduct && selectedDate) {
      window.location.href = `/checkout/${selectedProduct.id}?type=rental&date=${selectedDate.toISOString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {categoryTitles[category]}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-80">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Alugar por 2 dias:</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {product.rentPrice.toFixed(2)}
                    </p>
                  </div>
                  
                  <Button
                    variant="default"
                    className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                    onClick={() => handleRent(product)}
                  >
                    Alugar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Complete seu Look</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-primary font-bold">R$ {product.rentPrice.toFixed(2)}</p>
                    
                    <Button
                      variant="default"
                      className="w-full mt-4 bg-[#556B2F] hover:bg-[#455a26]"
                      onClick={() => handleRent(product)}
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Alugar {selectedProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  placeholder="00000-000"
                  value={cep}
                  onChange={handleCepChange}
                  maxLength={9}
                  className={cepError ? 'border-red-500' : ''}
                />
                {cepError && (
                  <p className="text-sm text-red-500">{cepError}</p>
                )}
              </div>

              {address && (
                <div className="space-y-4">
                  <div>
                    <Label>Endereço</Label>
                    <p className="text-gray-700">{address.logradouro}</p>
                  </div>
                  <div>
                    <Label>Bairro</Label>
                    <p className="text-gray-700">{address.bairro}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cidade</Label>
                      <p className="text-gray-700">{address.localidade}</p>
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <p className="text-gray-700">{address.uf}</p>
                    </div>
                  </div>
                </div>
              )}

              {showCalendar && (
                <div className="space-y-2">
                  <Label>Selecione a Data de Retirada</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={disabledDates}
                    className="rounded-md border"
                  />
                  {selectedDate && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-900">Período do Aluguel:</p>
                      <p className="text-sm text-gray-600">
                        Retirada: {selectedDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Devolução: {getReturnDate(selectedDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Prazo fixo de aluguel: 2 dias
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Button
                className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                disabled={!showCalendar || !selectedDate}
                onClick={handleProceedToCheckout}
              >
                Prosseguir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}