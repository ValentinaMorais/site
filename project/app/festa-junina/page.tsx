"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  birthDate: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  }, 'Deve ser maior de 18 anos'),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(3, 'Bairro é obrigatório'),
  city: z.string().min(3, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado inválido'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  { name: 'Jardineiras', href: '/categoria/jardineiras' },
  { name: 'Vestidos', href: '/categoria/vestidos' },
  { name: 'Saias', href: '/categoria/saias' },
];

export default function FestaJuninaPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [verificationStep, setVerificationStep] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const cep = watch('cep');

  useEffect(() => {
    if (cep?.replace(/\D/g, '').length === 8) {
      axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`)
        .then(response => {
          const { data } = response;
          setValue('street', data.logradouro);
          setValue('neighborhood', data.bairro);
          setValue('city', data.localidade);
          setValue('state', data.uf);
        });
    }
  }, [cep, setValue]);

  const onSubmit = async (data: FormData) => {
    // Here we would send SMS verification
    setVerificationStep(true);
  };

  const handleSmsVerification = async () => {
    // Here we would verify SMS code
    if (smsCode.length === 6) {
      // Proceed with contract
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Menu */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="container-padding py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Festa Junina</h1>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Categorias</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col space-y-4">
                {categories.map((category) => (
                  <a
                    key={category.href}
                    href={category.href}
                    className="text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="container-padding pt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Contract Viewer */}
          <Card>
            <CardHeader>
              <CardTitle>Contrato de Locação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="contract-viewer h-[400px] overflow-y-auto p-4 border rounded-lg">
                <h2 className="text-xl font-bold mb-4">CONTRATO DE LOCAÇÃO DE TRAJE</h2>
                {/* Contract content */}
                <div className="space-y-4 text-sm">
                  <p>
                    <strong>LOCADOR:</strong> RL Brechó<br />
                    <strong>CNPJ:</strong> XX.XXX.XXX/0001-XX
                  </p>
                  
                  <div>
                    <h3 className="font-bold">1. OBJETO</h3>
                    <p>1.1 Locação de traje para festa junina...</p>
                  </div>
                  
                  {/* More contract sections */}
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  Li e aceito os termos do contrato
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    {...register('cpf')}
                    placeholder="000.000.000-00"
                    className={errors.cpf ? 'border-red-500' : ''}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-500">{errors.cpf.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...register('birthDate')}
                    className={errors.birthDate ? 'border-red-500' : ''}
                  />
                  {errors.birthDate && (
                    <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    {...register('cep')}
                    placeholder="00000-000"
                    className={errors.cep ? 'border-red-500' : ''}
                  />
                  {errors.cep && (
                    <p className="text-sm text-red-500">{errors.cep.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      {...register('street')}
                      className={errors.street ? 'border-red-500' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      {...register('number')}
                      className={errors.number ? 'border-red-500' : ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      {...register('neighborhood')}
                      className={errors.neighborhood ? 'border-red-500' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      {...register('state')}
                      className={errors.state ? 'border-red-500' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="(00) 00000-0000"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {verificationStep ? (
              <Card>
                <CardHeader>
                  <CardTitle>Verificação por SMS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="Digite o código recebido por SMS"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                    />
                    <Button 
                      type="button"
                      onClick={handleSmsVerification}
                      className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                      disabled={smsCode.length !== 6}
                    >
                      Verificar Código
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button 
                type="submit"
                className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                disabled={!acceptedTerms}
              >
                Prosseguir
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}