"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  rentPrice: number;
  image: string;
}

const products: Product[] = [
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
  {
    id: '3',
    name: 'Jardineira Caipira Premium',
    rentPrice: 59.90,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
  },
];

export default function JardineirasPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Jardineiras para Festa Junina</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
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
                    <p className="text-sm text-gray-500">Alugar por:</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {product.rentPrice.toFixed(2)}
                    </p>
                  </div>
                  
                  <Button
                    variant="default"
                    className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                    onClick={() => window.location.href = `/alugar/${product.id}`}
                  >
                    Alugar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}