import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
          alt="RL Brechó - Moda Festa Junina"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              RL Brechó
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Moda sustentável e acessível
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:scale-105 transform transition-transform duration-200 shadow-lg px-8 py-6 text-lg"
            >
              <Link href="/comprar">
                Confira nossa coleção
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Festa Junina Section */}
      <section className="py-16 bg-[#F5DEB3]/20">
        <div className="container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Monte seu look junino perfeito!
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Alugue peças exclusivas por tempo limitado
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:scale-105 transform transition-transform duration-200 shadow-lg px-8 py-6 text-lg"
          >
            <Link href="/alugar/vestidos">
              Alugue já
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 container-padding">
        <h2 className="text-3xl font-bold text-center mb-12">Categorias</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Blusas e Camisetas',
              image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
              href: '/comprar/blusas-camisetas',
            },
            {
              title: 'Croppeds',
              image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
              href: '/comprar/croppeds',
            },
            {
              title: 'Calças e Shorts',
              image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
              href: '/comprar/calcas-shorts',
            },
          ].map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative h-[400px] overflow-hidden rounded-lg"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">{category.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#F5DEB3]/20">
        <div className="container-padding">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o RL Brechó?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Moda Sustentável',
                description: 'Peças selecionadas com cuidado e qualidade garantida',
              },
              {
                title: 'Preços Acessíveis',
                description: 'Economia sem abrir mão do estilo',
              },
              {
                title: 'Atendimento Personalizado',
                description: 'Suporte dedicado para encontrar o look perfeito',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}