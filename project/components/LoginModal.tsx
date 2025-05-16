"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(11, 'Telefone inválido'),
  cpf: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isRental?: boolean;
}

export default function LoginModal({ isOpen, onClose, onSuccess, isRental }: LoginModalProps) {
  const [activeTab, setActiveTab] = React.useState('login');

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      // Implement login logic here
      console.log('Login data:', data);
      toast.success('Login realizado com sucesso!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error('Login error:', error);
    }
  };

  const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      if (isRental && !data.cpf) {
        toast.error('CPF é obrigatório para aluguel');
        return;
      }
      // Implement registration logic here
      console.log('Register data:', data);
      toast.success('Cadastro realizado com sucesso!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao criar conta');
      console.error('Register error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acesse sua conta</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...loginForm.register('email')}
                  className={loginForm.formState.errors.email ? 'border-red-500' : ''}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register('password')}
                  className={loginForm.formState.errors.password ? 'border-red-500' : ''}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full bg-[#556B2F] hover:bg-[#455a26]">
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  {...registerForm.register('name')}
                  className={registerForm.formState.errors.name ? 'border-red-500' : ''}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  {...registerForm.register('email')}
                  className={registerForm.formState.errors.email ? 'border-red-500' : ''}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  {...registerForm.register('phone')}
                  className={registerForm.formState.errors.phone ? 'border-red-500' : ''}
                  placeholder="(00) 00000-0000"
                />
                {registerForm.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              {isRental && (
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    {...registerForm.register('cpf')}
                    className={registerForm.formState.errors.cpf ? 'border-red-500' : ''}
                    placeholder="000.000.000-00"
                  />
                  {registerForm.formState.errors.cpf && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.cpf.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="register-password">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  {...registerForm.register('password')}
                  className={registerForm.formState.errors.password ? 'border-red-500' : ''}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...registerForm.register('confirmPassword')}
                  className={registerForm.formState.errors.confirmPassword ? 'border-red-500' : ''}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full bg-[#556B2F] hover:bg-[#455a26]">
                Criar conta
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}