"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Order {
  id: string;
  date: string;
  status: string;
  items: {
    name: string;
    price: number;
    type: 'rental' | 'purchase';
  }[];
}

const orders: Order[] = [
  {
    id: '#12345',
    date: '2024-03-20',
    status: 'Em andamento',
    items: [
      {
        name: 'Vestido Floral Festa Junina',
        price: 49.90,
        type: 'rental'
      }
    ]
  },
  {
    id: '#12344',
    date: '2024-03-15',
    status: 'Concluído',
    items: [
      {
        name: 'Chapéu de Palha Decorado',
        price: 49.90,
        type: 'purchase'
      }
    ]
  }
];

export default function ContaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Minha Conta</h1>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="rentals">Aluguéis</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border-b border-gray-200 last:border-0 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Pedido {order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full">
                        {order.status}
                      </span>
                    </div>
                    {order.items.map((item, index) => (
                      <div key={index} className="mt-2">
                        <p className="text-sm">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          R$ {item.price.toFixed(2)} - {item.type === 'rental' ? 'Aluguel' : 'Compra'}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle>Aluguéis Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Você não possui aluguéis ativos no momento.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p className="text-gray-900">Maria Silva</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">maria.silva@email.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefone</p>
                  <p className="text-gray-900">(11) 98765-4321</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Endereço</p>
                  <p className="text-gray-900">Rua das Flores, 123 - São Paulo, SP</p>
                </div>
                <Button className="w-full bg-[#556B2F] hover:bg-[#455a26]">
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}