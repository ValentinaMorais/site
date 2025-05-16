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
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  salePrice: z.number().min(0, 'Preço deve ser maior que 0'),
  category: z.enum(['feminino', 'masculino', 'infantil']),
  featured: z.boolean().default(false),
  sizes: z.array(z.string()),
  status: z.enum(['active', 'outOfStock']),
});

interface Product {
  id: string;
  name: string;
  salePrice: number;
  status: 'active' | 'outOfStock';
  image: string;
  featured: boolean;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral',
    salePrice: 89.90,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
    featured: true,
  },
  {
    id: '2',
    name: 'Calça Jeans',
    salePrice: 129.90,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
    featured: false,
  },
];

export default function ProductsPage() {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Array<{ file: File; preview: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      sizes: [],
      status: 'active',
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (selectedImages.length + acceptedFiles.length > 6) {
      toast.error('Máximo de 6 imagens permitido');
      return;
    }

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
    maxFiles: 6,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    if (selectedImages.length === 0) {
      toast.error('Adicione pelo menos uma imagem');
      return;
    }

    try {
      // Here we would handle image upload and product creation
      console.log(data, selectedImages);
      toast.success('Produto salvo com sucesso!');
      setIsAddingProduct(false);
      reset();
      setSelectedImages([]);
    } catch (error) {
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      // Here we would handle product deletion
      toast.success('Produto excluído com sucesso!');
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
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
          return 0;
      }
    });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
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
        
        <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
          <DialogTrigger asChild>
            <Button className="bg-[#556B2F] hover:bg-[#455a26]">
              <Plus className="h-5 w-5 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
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
                      <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="salePrice">Preço (R$)</Label>
                    <Input 
                      id="salePrice" 
                      type="number" 
                      step="0.01" 
                      {...register('salePrice', { valueAsNumber: true })} 
                      className={errors.salePrice ? 'border-red-500' : ''}
                    />
                    {errors.salePrice && (
                      <p className="text-sm text-red-500 mt-1">{errors.salePrice.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Categoria</Label>
                    <Select onValueChange={value => setValue('category', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="infantil">Infantil</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Tamanhos Disponíveis</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {['P', 'M', 'G', 'GG'].map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant="outline"
                          className={`w-full ${
                            watch('sizes')?.includes(size) 
                              ? 'bg-primary text-white' 
                              : ''
                          }`}
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
                    <Label>Imagens do Produto</Label>
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
                        Máximo de 6 fotos (PNG, JPG) - até 5MB cada
                      </p>
                    </div>
                    {selectedImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => {
                                setSelectedImages(prev => 
                                  prev.filter((_, i) => i !== index)
                                );
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

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      {...register('featured')}
                    />
                    <Label htmlFor="featured">Destacar na página inicial</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingProduct(false)}
                >
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            Gerencie seus produtos, preços e estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        R$ {product.salePrice.toFixed(2)}
                      </Badge>
                      {product.featured && (
                        <Badge variant="secondary">Destaque</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={product.status === 'outOfStock' ? 'destructive' : 'default'}
                  >
                    {product.status === 'active' ? 'Disponível' : 'Esgotado'}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}