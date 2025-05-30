
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';

const HealthySuggestions: React.FC = () => {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  const suggestions = [
    {
      icon: '💧',
      title: 'Beba um copo d\'água',
      description: 'Hidrate-se e mantenha as mãos ocupadas',
      duration: '1 minuto'
    },
    {
      icon: '🫁',
      title: 'Respire profundamente',
      description: 'Inspire por 4s, segure por 4s, expire por 6s',
      duration: '2 minutos'
    },
    {
      icon: '🚶‍♂️',
      title: 'Faça uma caminhada',
      description: 'Mesmo que seja só até a esquina ou no quintal',
      duration: '5-10 minutos'
    },
    {
      icon: '🍎',
      title: 'Coma uma fruta',
      description: 'Satisfaça a necessidade oral de forma saudável',
      duration: '2-3 minutos'
    },
    {
      icon: '🧘‍♀️',
      title: 'Medite por alguns minutos',
      description: 'Concentre-se no momento presente',
      duration: '3-5 minutos'
    },
    {
      icon: '📱',
      title: 'Ligue para alguém querido',
      description: 'Conecte-se com pessoas que te apoiam',
      duration: '5-10 minutos'
    },
    {
      icon: '✋',
      title: 'Massageie suas mãos',
      description: 'Mantenha as mãos ocupadas e relaxe',
      duration: '2 minutos'
    },
    {
      icon: '🎵',
      title: 'Ouça uma música relaxante',
      description: 'Deixe a música acalmar sua mente',
      duration: '3-4 minutos'
    }
  ];

  const getNewSuggestion = () => {
    const newIndex = Math.floor(Math.random() * suggestions.length);
    setCurrentSuggestion(newIndex);
  };

  useEffect(() => {
    // Change suggestion every 30 seconds
    const interval = setInterval(getNewSuggestion, 30000);
    return () => clearInterval(interval);
  }, []);

  const suggestion = suggestions[currentSuggestion];

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <Heart className="w-5 h-5 mr-2 text-green-600" />
          Alternativa Saudável
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-3">{suggestion.icon}</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {suggestion.title}
          </h3>
          <p className="text-gray-600 mb-3">
            {suggestion.description}
          </p>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm inline-block">
            ⏱️ {suggestion.duration}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={getNewSuggestion}
            variant="outline"
            className="w-full border-green-300 text-green-700 hover:bg-green-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Nova Sugestão
          </Button>
          
          <div className="bg-green-100 p-3 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              💪 <strong>Dica:</strong> Pratique essas alternativas mesmo quando não sentir vontade de fumar. 
              Isso fortalece novos hábitos saudáveis!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthySuggestions;
