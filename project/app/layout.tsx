import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { NavigationMenu } from '@/components/navigation-menu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RL Brechó - Locação e Venda de Roupas',
  description: 'Aluguel e venda de roupas para festas juninas e eventos especiais',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <NavigationMenu />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}