
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface TriggerFormProps {
  onSubmit: (record: {
    date: string;
    time: string;
    emotion: string;
    situation: string;
    intensity: number;
  }) => void;
  onCancel: () => void;
}

const TriggerForm: React.FC<TriggerFormProps> = ({ onSubmit, onCancel }) => {
  const [emotion, setEmotion] = useState('');
  const [situation, setSituation] = useState('');
  const [intensity, setIntensity] = useState([5]);

  const emotions = [
    { value: 'stressed', label: '😰 Estressado' },
    { value: 'anxious', label: '😟 Ansioso' },
    { value: 'bored', label: '😑 Entediado' },
    { value: 'sad', label: '😢 Triste' },
    { value: 'angry', label: '😠 Irritado' },
    { value: 'happy', label: '😊 Feliz' },
    { value: 'tired', label: '😴 Cansado' },
    { value: 'social', label: '😄 Sociável' }
  ];

  const situations = [
    { value: 'work', label: '💼 No trabalho' },
    { value: 'home', label: '🏠 Em casa' },
    { value: 'social', label: '👥 Em grupo social' },
    { value: 'driving', label: '🚗 Dirigindo' },
    { value: 'break', label: '☕ Pausa/intervalo' },
    { value: 'phone', label: '📱 Ao telefone' },
    { value: 'alcohol', label: '🍺 Bebendo álcool' },
    { value: 'aftermeal', label: '🍽️ Após refeição' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emotion || !situation) return;

    const now = new Date();
    onSubmit({
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].slice(0, 5),
      emotion,
      situation,
      intensity: intensity[0]
    });
  };

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-t-xl">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Registrar Gatilho</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-orange-100 text-sm">
          Registre como você se sente para ganhar autoconsciência
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              Como você está se sentindo? 💭
            </Label>
            <Select value={emotion} onValueChange={setEmotion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma emoção" />
              </SelectTrigger>
              <SelectContent>
                {emotions.map((em) => (
                  <SelectItem key={em.value} value={em.value}>
                    {em.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              Onde/quando isso aconteceu? 📍
            </Label>
            <Select value={situation} onValueChange={setSituation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma situação" />
              </SelectTrigger>
              <SelectContent>
                {situations.map((sit) => (
                  <SelectItem key={sit.value} value={sit.value}>
                    {sit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              Intensidade da vontade: {intensity[0]}/10 🔥
            </Label>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Leve</span>
              <span>Moderada</span>
              <span>Intensa</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💙 <strong>Lembre-se:</strong> Registrar seus gatilhos é um ato de coragem e autocuidado. 
              Cada registro te aproxima da liberdade!
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!emotion || !situation}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Registrar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TriggerForm;
