"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cpf } from 'cpf-cnpj-validator';
import InputMask from 'react-input-mask';
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

const userSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  cpf: z.string().refine(value => cpf.isValid(value), 'CPF inválido'),
  phone: z.string().min(14, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  address: z.object({
    street: z.string().min(3, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, 'Bairro é obrigatório'),
    city: z.string().min(3, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado inválido'),
    zipCode: z.string().min(9, 'CEP inválido'),
  }),
  termsAccepted: z.boolean().refine(value => value, 'Você precisa aceitar os termos'),
  dataUseAccepted: z.boolean().refine(value => value, 'Você precisa autorizar o uso dos dados'),
});

type UserFormData = z.infer<typeof userSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRental = searchParams.get('type') === 'rental';
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompleteProfile, setHasCompleteProfile] = useState(false);
  const [identificationDoc, setIdentificationDoc] = useState<File | null>(null);
  const [showContract, setShowContract] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      termsAccepted: false,
      dataUseAccepted: false,
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setIdentificationDoc(acceptedFiles[0]);
      }
    },
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Simulate auth check
    const mockIsLoggedIn = false;
    const mockHasCompleteProfile = false;

    setIsLoggedIn(mockIsLoggedIn);
    setHasCompleteProfile(mockHasCompleteProfile);

    if (!mockIsLoggedIn) {
      router.push('/auth/login?redirect=/checkout');
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isRental && !identificationDoc) {
        toast.error('Upload de documento é obrigatório para aluguel');
        return;
      }

      if (isRental && !showContract) {
        setShowContract(true);
        return;
      }

      // Process checkout
      console.log('Form data:', data);
      console.log('ID Document:', identificationDoc);

      toast.success(isRental ? 'Aluguel realizado com sucesso!' : 'Compra realizada com sucesso!');
      router.push('/conta/pedidos');
    } catch (error) {
      toast.error(isRental ? 'Erro ao processar aluguel' : 'Erro ao processar compra');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-padding max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acesso Restrito</AlertTitle>
            <AlertDescription>
              Faça login ou cadastre-se para continuar.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (showContract && isRental) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-padding max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Contrato de Locação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="contract-content bg-white p-6 rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto mb-6">
                <h2 className="text-2xl font-bold mb-6">CONTRATO DE LOCAÇÃO DE TRAJE</h2>
                <div className="space-y-4">
                  <p>
                    <strong>LOCADOR:</strong> RL Brechó<br />
                    <strong>LOCATÁRIO:</strong> {watch('fullName')}
                  </p>
                  
                  <div>
                    <h3 className="font-bold">1. OBJETO</h3>
                    <p>1.1 O presente contrato tem como objeto a locação de traje para festa junina.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold">2. PRAZO</h3>
                    <p>2.1 O prazo de locação é de 2 (dois) dias corridos.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold">3. RESPONSABILIDADES</h3>
                    <p>3.1 O LOCATÁRIO se responsabiliza por qualquer dano causado ao traje.</p>
                    <p>3.2 Em caso de dano ou não devolução, o LOCATÁRIO pagará o valor integral do traje.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={watch('termsAccepted')}
                    onCheckedChange={(checked) => setValue('termsAccepted', checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Li e aceito os termos do contrato
                  </Label>
                </div>

                <Button 
                  onClick={handleSubmit(onSubmit)}
                  className="w-full bg-[#556B2F] hover:bg-[#455a26]"
                  disabled={!watch('termsAccepted')}
                >
                  Confirmar e Prosseguir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!hasCompleteProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-padding max-w-2xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Complete seu cadastro</AlertTitle>
            <AlertDescription>
              Para prosseguir, precisamos de algumas informações adicionais.
            </AlertDescription>
          </Alert>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      className={errors.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <InputMask
                      mask="999.999.999-99"
                      {...register('cpf')}
                    >
                      {(inputProps: any) => (
                        <Input
                          id="cpf"
                          {...inputProps}
                          className={errors.cpf ? 'border-red-500' : ''}
                        />
                      )}
                    </InputMask>
                    {errors.cpf && (
                      <p className="text-sm text-red-500 mt-1">{errors.cpf.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                    <InputMask
                      mask="(99) 99999-9999"
                      {...register('phone')}
                    >
                      {(inputProps: any) => (
                        <Input
                          id="phone"
                          {...inputProps}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                      )}
                    </InputMask>
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Endereço</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          placeholder="CEP"
                          {...register('address.zipCode')}
                          className={errors.address?.zipCode ? 'border-red-500' : ''}
                        />
                        {errors.address?.zipCode && (
                          <p className="text-sm text-red-500 mt-1">{errors.address.zipCode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Input
                          placeholder="Rua"
                          {...register('address.street')}
                          className={errors.address?.street ? 'border-red-500' : ''}
                        />
                        {errors.address?.street && (
                          <p className="text-sm text-red-500 mt-1">{errors.address.street.message}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          placeholder="Número"
                          {...register('address.number')}
                          className={errors.address?.number ? 'border-red-500' : ''}
                        />
                        {errors.address?.number && (
                          <p className="text-sm text-red-500 mt-1">{errors.address.number.message}</p>
                        )}
                      </div>
                    </div>

                    <Input
                      placeholder="Complemento (opcional)"
                      {...register('address.complement')}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          placeholder="Bairro"
                          {...register('address.neighborhood')}
                          className={errors.address?.neighborhood ? 'border-red-500' : ''}
                        />
                        {errors.address?.neighborhood && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.address.neighborhood.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          placeholder="Cidade"
                          {...register('address.city')}
                          className={errors.address?.city ? 'border-red-500' : ''}
                        />
                        {errors.address?.city && (
                          <p className="text-sm text-red-500 mt-1">{errors.address.city.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Input
                        placeholder="Estado"
                        maxLength={2}
                        {...register('address.state')}
                        className={errors.address?.state ? 'border-red-500' : ''}
                      />
                      {errors.address?.state && (
                        <p className="text-sm text-red-500 mt-1">{errors.address.state.message}</p>
                      )}
                    </div>
                  </div>

                  {isRental && (
                    <div>
                      <Label>Documento de Identificação</Label>
                      <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                      >
                        <input {...getInputProps()} />
                        <Upload className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Arraste e solte seu RG/CNH aqui, ou clique para selecionar
                        </p>
                        <p className="text-xs text-gray-500">
                          Formatos aceitos: JPG, PNG, PDF
                        </p>
                      </div>
                      {identificationDoc && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{identificationDoc.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    {isRental ? (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="dataUse"
                          checked={watch('dataUseAccepted')}
                          onCheckedChange={(checked) => 
                            setValue('dataUseAccepted', checked as boolean)
                          }
                        />
                        <Label htmlFor="dataUse" className="text-sm">
                          Autorizo o uso dos meus dados para esta transação
                        </Label>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="terms"
                            checked={watch('termsAccepted')}
                            onCheckedChange={(checked) => 
                              setValue('termsAccepted', checked as boolean)
                            }
                          />
                          <Label htmlFor="terms" className="text-sm">
                            Li e aceito os termos de compra
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="dataUse"
                            checked={watch('dataUseAccepted')}
                            onCheckedChange={(checked) => 
                              setValue('dataUseAccepted', checked as boolean)
                            }
                          />
                          <Label htmlFor="dataUse" className="text-sm">
                            Autorizo o uso dos meus dados para esta transação
                          </Label>
                        </div>
                      </>
                    )}
                    {errors.termsAccepted && (
                      <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
                    )}
                    {errors.dataUseAccepted && (
                      <p className="text-sm text-red-500">{errors.dataUseAccepted.message}</p>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#556B2F] hover:bg-[#455a26]">
                  {isRental ? 'Prosseguir para Contrato' : 'Continuar para Pagamento'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Finalizar {isRental ? 'Aluguel' : 'Compra'}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Payment form will be added here */}
            <p>Implementar formulário de pagamento</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}