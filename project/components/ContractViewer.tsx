"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ContractViewerProps {
  contractData: {
    name: string;
    date: string;
    value: number;
  };
  onAccept: (signature: string) => void;
}

export default function ContractViewer({ contractData, onAccept }: ContractViewerProps) {
  const [accepted, setAccepted] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
    
    // Save signature
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const handleAccept = () => {
    if (!signature) {
      alert('Por favor, assine o contrato');
      return;
    }
    onAccept(signature);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const reachedBottom = 
      Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 50;
    setReachedBottom(reachedBottom);
  };

  return (
    <div className="space-y-6">
      <div 
        className="contract-content bg-white p-6 rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto"
        onScroll={handleScroll}
      >
        <h2 className="text-2xl font-bold mb-6">CONTRATO DE LOCAÇÃO DE TRAJE</h2>
        {/* Contract content */}
        <div className="space-y-4">
          <p>
            <strong>LOCADOR:</strong> RL Brechó<br />
            <strong>LOCATÁRIO:</strong> {contractData.name}
          </p>
          
          <div>
            <h3 className="font-bold">1. OBJETO</h3>
            <p>Locação de traje para uso em {contractData.date}</p>
          </div>
          
          <div>
            <h3 className="font-bold">2. VALOR</h3>
            <p>R$ {contractData.value.toFixed(2)}</p>
          </div>
          
          {/* Add more contract sections */}
        </div>
      </div>

      <div className="signature-section bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Assinatura Digital</h3>
        
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border border-gray-300 rounded w-full h-[200px] cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
        
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={clearSignature}>
            Limpar
          </Button>
        </div>
      </div>

      <div className="acceptance-section bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Checkbox 
            id="accept"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
            disabled={!reachedBottom}
          />
          <label htmlFor="accept" className="text-sm text-gray-700">
            Li e aceito os termos do contrato
          </label>
        </div>

        <Button
          className="w-full bg-[#556B2F] hover:bg-[#455a26]"
          disabled={!accepted || !signature || !reachedBottom}
          onClick={handleAccept}
        >
          Confirmar e Assinar
        </Button>
      </div>
    </div>
  );
}