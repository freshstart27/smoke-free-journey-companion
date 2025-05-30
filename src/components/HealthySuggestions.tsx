
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';

const HealthySuggestions: React.FC = () => {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  const suggestions = [
    {
      icon: '💧',
      title: 'Beba um copo d\'água gelada',
      description: 'Hidrate-se e mantenha as mãos ocupadas com o copo',
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
      title: 'Faça uma caminhada rápida',
      description: 'Mesmo que seja só até a esquina ou no quintal',
      duration: '5-10 minutos'
    },
    {
      icon: '🍎',
      title: 'Coma uma fruta ou cenoura',
      description: 'Satisfaça a necessidade oral de forma saudável',
      duration: '2-3 minutos'
    },
    {
      icon: '🧘‍♀️',
      title: 'Medite por alguns minutos',
      description: 'Use um app de meditação ou apenas observe sua respiração',
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
      description: 'Use creme hidratante e mantenha as mãos ocupadas',
      duration: '2 minutos'
    },
    {
      icon: '🎵',
      title: 'Ouça uma música relaxante',
      description: 'Deixe a música acalmar sua mente',
      duration: '3-4 minutos'
    },
    {
      icon: '🧽',
      title: 'Organize algo pequeno',
      description: 'Arrume uma gaveta, mesa ou lave a louça',
      duration: '5-15 minutos'
    },
    {
      icon: '📖',
      title: 'Leia algumas páginas',
      description: 'Um livro, artigo ou notícias que te interessem',
      duration: '5-10 minutos'
    },
    {
      icon: '🌱',
      title: 'Cuide de uma planta',
      description: 'Regue, pode ou simplesmente observe a natureza',
      duration: '3-5 minutos'
    },
    {
      icon: '🖊️',
      title: 'Escreva seus pensamentos',
      description: 'Anote como se sente ou faça uma lista de gratidão',
      duration: '3-7 minutos'
    },
    {
      icon: '🧩',
      title: 'Resolva um quebra-cabeça',
      description: 'Sudoku, palavras cruzadas ou jogos no celular',
      duration: '5-10 minutos'
    },
    {
      icon: '💪',
      title: 'Faça exercícios leves',
      description: 'Polichinelos, agachamentos ou alongamentos',
      duration: '3-8 minutos'
    },
    {
      icon: '🍵',
      title: 'Prepare um chá ou café',
      description: 'Ritual relaxante e aquecimento das mãos',
      duration: '3-5 minutos'
    },
    {
      icon: '🎨',
      title: 'Desenhe ou rabisque',
      description: 'Mesmo sem habilidade, expressar-se é terapêutico',
      duration: '5-15 minutos'
    },
    {
      icon: '🧼',
      title: 'Lave o rosto com água fria',
      description: 'Refrescante e ajuda a "resetar" a mente',
      duration: '1-2 minutos'
    },
    {
      icon: '🎯',
      title: 'Defina uma micro-meta',
      description: 'Algo pequeno que pode fazer nos próximos 10 minutos',
      duration: '2-10 minutos'
    },
    {
      icon: '🍊',
      title: 'Descasque uma laranja',
      description: 'O aroma cítrico é relaxante e ocupa as mãos',
      duration: '3-5 minutos'
    },
    {
      icon: '📷',
      title: 'Tire uma foto bonita',
      description: 'Busque algo interessante ao seu redor',
      duration: '2-5 minutos'
    },
    {
      icon: '🧘',
      title: 'Pratique gratidão',
      description: 'Liste mentalmente 3 coisas pelas quais é grato',
      duration: '2-3 minutos'
    },
    {
      icon: '🎪',
      title: 'Assista um vídeo engraçado',
      description: 'Rir libera endorfinas e melhora o humor',
      duration: '3-5 minutos'
    },
    {
      icon: '🧴',
      title: 'Passe protetor solar',
      description: 'Cuidado com a pele e ritual de autocuidado',
      duration: '2 minutos'
    },
    {
      icon: '🎭',
      title: 'Faça caretas no espelho',
      description: 'Exercite os músculos faciais e sorria para si',
      duration: '1-2 minutos'
    },
    {
      icon: '📝',
      title: 'Faça uma lista',
      description: 'Tarefas, compras ou sonhos - organizar a mente',
      duration: '3-7 minutos'
    }
  ];

  const getNewSuggestion = () => {
    const newIndex = Math.floor(Math.random() * suggestions.length);
    setCurrentSuggestion(newIndex);
  };

  useEffect(() => {
    // Change suggestion every 45 seconds
    const interval = setInterval(getNewSuggestion, 45000);
    return () => clearInterval(interval);
  }, []);

  const suggestion = suggestions[currentSuggestion];

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <Heart className="w-5 h-5 mr-2 text-green-600" />
          Mudança de Hábito
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
            Nova Alternativa
          </Button>
          
          <div className="bg-green-100 p-3 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              💡 <strong>Dica:</strong> Experimente diferentes alternativas para descobrir quais funcionam melhor para você. 
              A variedade ajuda a criar novos hábitos!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthySuggestions;
