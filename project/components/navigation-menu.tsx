"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, User, Trees, ShoppingCart, Shirt, Tangent, Shovel, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const menuItems = [
  {
    title: 'ALUGUEL FESTA JUNINA',
    icon: <Trees className="h-5 w-5" />,
    items: [
      { name: 'Vestidos de Festa Junina', href: '/categoria/vestidos' },
      { name: 'Saias', href: '/categoria/saias' },
      { name: 'Jardineiras', href: '/categoria/jardineiras' },
    ],
  },
  {
    title: 'VENDA',
    icon: <ShoppingCart className="h-5 w-5" />,
    items: [
      { name: 'Blusas e Camisetas', href: '/venda/blusas-camisetas', icon: <Shirt className="h-4 w-4" /> },
      { name: 'Calças e Shorts', href: '/venda/calcas-shorts', icon: <Tangent className="h-4 w-4" /> },
      { name: 'Sapatos', href: '/venda/sapatos', icon: <Shovel className="h-4 w-4" /> },
      { name: 'Acessórios', href: '/venda/acessorios', icon: <Sparkles className="h-4 w-4" /> },
      { name: 'Croppeds', href: '/venda/croppeds', icon: <Shirt className="h-4 w-4" /> },
    ],
  },
];

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-padding mx-auto">
        <div className="flex flex-col items-center py-6">
          <Link href="/" className="text-3xl font-bold text-primary mb-4">
            RL Brechó
          </Link>

          <div className="flex items-center space-x-6">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-2xl font-bold text-primary">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {menuItems.map((section) => (
                    <div key={section.title} className="space-y-3">
                      <button
                        className="flex items-center w-full text-left font-semibold text-gray-900 hover:text-primary transition-colors"
                        onClick={() => toggleSection(section.title)}
                      >
                        {section.icon}
                        <span className="ml-2">{section.title}</span>
                        <span className={`ml-auto transform transition-transform duration-200 ${
                          expandedSection === section.title ? 'rotate-180' : ''
                        }`}>
                          ▼
                        </span>
                      </button>
                      
                      <div className={`space-y-2 pl-7 ${
                        expandedSection === section.title ? 'block' : 'hidden'
                      }`}>
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center py-2 text-gray-600 hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {'icon' in item && item.icon}
                            <span className={`${'icon' in item ? 'ml-2' : ''}`}>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/carrinho" className="text-gray-600 hover:text-primary transition-colors">
              <ShoppingBag className="h-6 w-6" />
            </Link>
            
            <Link href="/conta" className="text-gray-600 hover:text-primary transition-colors">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}