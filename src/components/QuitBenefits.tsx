
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, DollarSign, CheckCircle } from 'lucide-react';

interface SmokingRecord {
  date: string;
  cigarettes: number;
}

interface Benefit {
  days: number;
  icon: string;
  title: string;
  description: string;
  category: 'health' | 'money' | 'other';
}

const QuitBenefits: React.FC = () => {
  const [smokingRecords, setSmokingRecords] = useState<SmokingRecord[]>([]);
  const [cigarettePrice, setCigarettePrice] = useState(0.50); // R$ por cigarro
  const [dailyAverage, setDailyAverage] = useState(20);

  useEffect(() => {
    const saved = localStorage.getItem('smokingRecords');
    if (saved) {
      setSmokingRecords(JSON.parse(saved));
    }

    const savedTarget = localStorage.getItem('dailyTarget');
    if (savedTarget) {
      setDailyAverage(parseInt(savedTarget));
    }
  }, []);

  const getDaysWithoutSmoking = () => {
    const today = new Date();
    let daysCount = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const record = smokingRecords.find(r => r.date === dateStr);
      if (record && record.cigarettes > 0) {
        break;
      }
      daysCount++;
    }
    
    return daysCount;
  };

  const benefits: Benefit[] = [
    {
      days: 1,
      icon: '💨',
      title: 'Respiração mais limpa',
      description: 'O monóxido de carbono no sangue volta ao normal',
      category: 'health'
    },
    {
      days: 2,
      icon: '👃',
      title: 'Olfato e paladar melhoram',
      description: 'Você já consegue sentir sabores e cheiros melhor',
      category: 'health'
    },
    {
      days: 7,
      icon: '🫁',
      title: 'Pulmões mais limpos',
      description: 'Os cílios dos pulmões começam a se regenerar',
      category: 'health'
    },
    {
      days: 14,
      icon: '❤️',
      title: 'Circulação melhora',
      description: 'Risco de ataque cardíaco começa a diminuir',
      category: 'health'
    },
    {
      days: 30,
      icon: '🏃‍♂️',
      title: 'Mais energia',
      description: 'Capacidade pulmonar aumenta em até 30%',
      category: 'health'
    },
    {
      days: 90,
      icon: '🧠',
      title: 'Função cerebral melhora',
      description: 'Circulação sanguínea melhora significativamente',
      category: 'health'
    },
    {
      days: 365,
      icon: '💪',
      title: 'Risco reduzido pela metade',
      description: 'Risco de doença cardíaca é reduzido em 50%',
      category: 'health'
    }
  ];

  const daysWithoutSmoking = getDaysWithoutSmoking();
  const moneySaved = daysWithoutSmoking * dailyAverage * cigarettePrice;
  const cigarettesNotSmoked = daysWithoutSmoking * dailyAverage;

  const getAchievedBenefits = () => {
    return benefits.filter(benefit => daysWithoutSmoking >= benefit.days);
  };

  const getNextBenefit = () => {
    return benefits.find(benefit => daysWithoutSmoking < benefit.days);
  };

  const achievedBenefits = getAchievedBenefits();
  const nextBenefit = getNextBenefit();

  if (daysWithoutSmoking === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500 mb-4">
            <Cigarette className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Comece sua jornada livre do cigarro!</h3>
            <p>Quando você parar de fumar, os benefícios aparecerão aqui.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Dias sem fumar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysWithoutSmoking}</div>
            <p className="text-green-100 text-xs">
              Sua saúde agradece!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Dinheiro economizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {moneySaved.toFixed(2)}</div>
            <p className="text-blue-100 text-xs">
              {cigarettesNotSmoked} cigarros não fumados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Benefit */}
      {nextBenefit && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg text-orange-800">
              Próximo Benefício em {nextBenefit.days - daysWithoutSmoking} dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{nextBenefit.icon}</div>
              <div>
                <h4 className="font-semibold text-orange-800">{nextBenefit.title}</h4>
                <p className="text-orange-700 text-sm">{nextBenefit.description}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((daysWithoutSmoking / nextBenefit.days) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achieved Benefits */}
      {achievedBenefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Benefícios Conquistados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievedBenefits.reverse().map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="text-2xl">{benefit.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">{benefit.title}</h4>
                  <p className="text-green-700 text-sm">{benefit.description}</p>
                </div>
                <div className="text-green-600 text-sm font-medium">
                  {benefit.days} {benefit.days === 1 ? 'dia' : 'dias'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-purple-400 to-purple-500 text-white">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">
            🌟 Você está fazendo um trabalho incrível!
          </h3>
          <p className="text-purple-100">
            Cada dia sem fumar é uma vitória para sua saúde, seu bolso e sua família.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuitBenefits;
