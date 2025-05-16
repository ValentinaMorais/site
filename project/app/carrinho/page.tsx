"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'rental' | 'purchase';
  image: string;
  quantity: number;
}

const cartItems: CartItem[] = [
  {
    id: '1',
    name: 'Vestido Floral Festa Junina',
    price: 49.90,
    type: 'rental',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
    quantity: 1
  },
  {
    id: '2',
    name: 'Chapéu de Palha Decorado',
    price: 49.90,
    type: 'purchase',
    image: 'https://images.unsplash.com/photo-1576188973526-aa7e0530edf9',
    quantity: 1
  }
];

export default function CarrinhoPage() {
  const [items, setItems] = React.useState<CartItem[]>(cartItems);

  const updateQuantity = (id: string, delta: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15.90;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.type === 'rental' ? 'Aluguel' : 'Compra'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-semibold text-primary">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete</span>
                  <span>R$ {shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                  onClick={() => window.open(`/checkout/${items[0].id}`, '_blank')}
                >
                  Finalizar Compra
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}