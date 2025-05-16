"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Editor } from '@tinymce/tinymce-react';
import { useDropzone } from 'react-dropzone';
import { Plus, Search, Tag, Upload, Edit, Trash, AlertCircle, ArrowUpDown, FileSpreadsheet, File as FilePdf } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  salePrice: z.number().min(0, 'Preço deve ser maior que 0'),
  rentPrice: z.number().min(0, 'Preço deve ser maior que 0'),
  costPrice: z.number().optional(),
  category: z.array(z.string()).min(1, 'Selecione pelo menos uma categoria'),
  tags: z.array(z.string()),
  status: z.enum(['active', 'outOfStock', 'draft']),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  customUrl: z.string().optional(),
  visibility: z.object({
    isAvailable: z.boolean(),
    showInSearch: z.boolean(),
    isOutOfStock: z.boolean(),
  }),
});

interface Product {
  id: string;
  name: string;
  salePrice: number;
  rentPrice: number;
  stock: number;
  status: 'active' | 'outOfStock' | 'draft';
  image: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Vestido Junino Floral',
    salePrice: 89.90,
    rentPrice: 29.90,
    stock: 5,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
  },
  {
    id: '2',
    name: 'Chapéu Caipira Decorado',
    salePrice: 35.90,
    rentPrice: 15.90,
    stock: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1576188973526-aa7e0530edf9',
  },
];

export default function AdminPage() {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Array<{ file: File; preview: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      visibility: {
        isAvailable: true,
        showInSearch: true,
        isOutOfStock: false,
      },
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedImages(prev => [
      ...prev,
      ...acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
    ]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 8,
    maxSize: 2 * 1024 * 1024 // 2MB
  });

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    console.log(data, selectedImages);
    // Handle product submission
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    // Handle export functionality
    console.log(`Exporting as ${format}`);
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || true) && // Add category filter when implemented
      (selectedStatus === 'all' || product.status === selectedStatus)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return b.salePrice - a.salePrice;
        case 'price-low':
          return a.salePrice - b.salePrice;
        case 'recent':
        default:
          return 0; // Add proper date comparison when implemented
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Painel Administrativo</h1>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FilePdf className="h-4 w-4 mr-2" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#556B2F] hover:bg-[#455a26]">
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Novo Produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="basic">
                    <TabsList className="grid grid-cols-4 gap-4">
                      <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                      <TabsTrigger value="media">Fotos e Vídeos</TabsTrigger>
                      <TabsTrigger value="variants">Estoque e Variantes</TabsTrigger>
                      <TabsTrigger value="seo">SEO e Visibilidade</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Nome do Produto</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && (
                              <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                          </div>

                          <div>
                            <Label>Descrição</Label>
                            <Editor
                              apiKey="your-tinymce-api-key"
                              init={{
                                height: 300,
                                menubar: false,
                                plugins: [
                                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                  'bold italic forecolor | alignleft aligncenter ' +
                                  'alignright alignjustify | bullist numlist outdent indent | ' +
                                  'removeformat | help',
                              }}
                              onEditorChange={(content) => {
                                setValue('description', content);
                              }}
                            />
                            {errors.description && (
                              <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="salePrice">Preço de Venda (R$)</Label>
                            <Input 
                              id="salePrice" 
                              type="number" 
                              step="0.01" 
                              {...register('salePrice', { valueAsNumber: true })} 
                            />
                            {errors.salePrice && (
                              <p className="text-sm text-red-500">{errors.salePrice.message}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="rentPrice">Preço do Aluguel (R$/2 dias)</Label>
                            <Input 
                              id="rentPrice" 
                              type="number" 
                              step="0.01" 
                              {...register('rentPrice', { valueAsNumber: true })} 
                            />
                            {errors.rentPrice && (
                              <p className="text-sm text-red-500">{errors.rentPrice.message}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
                            <Input 
                              id="costPrice" 
                              type="number" 
                              step="0.01" 
                              {...register('costPrice', { valueAsNumber: true })} 
                            />
                          </div>

                          <div>
                            <Label>Categorias</Label>
                            <Select onValueChange={value => setValue('category', [value])}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione as categorias" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="festa-junina">Festa Junina</SelectItem>
                                <SelectItem value="vestidos">Vestidos</SelectItem>
                                <SelectItem value="acessorios">Acessórios</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.category && (
                              <p className="text-sm text-red-500">{errors.category.message}</p>
                            )}
                          </div>

                          <div>
                            <Label>Tags</Label>
                            <Input 
                              placeholder="Adicione tags separadas por vírgula"
                              onChange={(e) => setValue('tags', e.target.value.split(','))}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="media" className="space-y-6">
                      <div>
                        <Label>Fotos do Produto</Label>
                        <div 
                          {...getRootProps()} 
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                        >
                          <input {...getInputProps()} />
                          <Upload className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Arraste e solte imagens aqui, ou clique para selecionar
                          </p>
                          <p className="text-xs text-gray-500">
                            Máximo de 8 fotos (PNG, JPG) - até 2MB cada
                          </p>
                        </div>
                        {selectedImages.length > 0 && (
                          <div className="mt-4 grid grid-cols-4 gap-4">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image.preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => {
                                    setSelectedImages(prev => prev.filter((_, i) => i !== index));
                                  }}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="variants" className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label>Tamanhos Disponíveis</Label>
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {['P', 'M', 'G', 'GG'].map((size) => (
                              <Button
                                key={size}
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  const sizes = watch('sizes') || [];
                                  if (sizes.includes(size)) {
                                    setValue('sizes', sizes.filter(s => s !== size));
                                  } else {
                                    setValue('sizes', [...sizes, size]);
                                  }
                                }}
                              >
                                {size}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Cores Disponíveis</Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {['Vermelho', 'Azul', 'Verde'].map((color) => (
                              <Button
                                key={color}
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  const colors = watch('colors') || [];
                                  if (colors.includes(color)) {
                                    setValue('colors', colors.filter(c => c !== color));
                                  } else {
                                    setValue('colors', [...colors, color]);
                                  }
                                }}
                              >
                                {color}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="seoTitle">Título para SEO</Label>
                          <Input id="seoTitle" {...register('seoTitle')} />
                        </div>

                        <div>
                          <Label htmlFor="seoDescription">Descrição para SEO</Label>
                          <Input id="seoDescription" {...register('seoDescription')} />
                        </div>

                        <div>
                          <Label htmlFor="customUrl">URL Personalizada</Label>
                          <Input id="customUrl" {...register('customUrl')} />
                        </div>

                        <div className="space-y-2">
                          <Label>Visibilidade</Label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                {...register('visibility.isAvailable')}
                              />
                              <Label>Disponível para venda</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                {...register('visibility.showInSearch')}
                              />
                              <Label>Aparecer em buscas</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                {...register('visibility.isOutOfStock')}
                              />
                              <Label>Produto esgotado</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-[#556B2F] hover:bg-[#455a26]">
                      Salvar Produto
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>
                Gerencie seus produtos, preços e estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais recentes</SelectItem>
                      <SelectItem value="price-high">Maior preço</SelectItem>
                      <SelectItem value="price-low">Menor preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">
                              Venda: R$ {product.salePrice.toFixed(2)}
                            </Badge>
                            <Badge variant="outline">
                              Aluguel: R$ {product.rentPrice.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={product.stock < 5 ? 'destructive' : 'default'}
                        >
                          Estoque: {product.stock}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Produtos Cadastrados</p>
                    <p className="text-2xl font-bold">120</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Aluguéis Ativos</p>
                    <p className="text-2xl font-bold">25</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Estoque Baixo</p>
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-bold">8 produtos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}