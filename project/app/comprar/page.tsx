"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral Festa Junina',
    price: 199.90,
    category: 'Vestidos',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
  },
  {
    id: '2',
    name: 'Jardineira Xadrez Tradicional',
    price: 159.90,
    category: 'Jardineiras',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
  },
  {
    id: '3',
    name: 'Chapéu de Palha Decorado',
    price: 49.90,
    category: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1576188973526-aa7e0530edf9',
  },
];

export default function ComprarPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Comprar Roupas e Acessórios</h1>
        
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
                <span className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-3">
                  {product.category}
                </span>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{product.name}</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <Button
                    className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                    onClick={() => window.location.href = `/checkout/${product.id}?type=purchase`}
                  >
                    Comprar Agora
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