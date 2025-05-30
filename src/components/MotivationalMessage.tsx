
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MotivationalMessage: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    {
      text: "Cada momento de consciência é uma vitória. Você está no caminho certo! 🌟",
      color: "from-yellow-400 to-orange-400"
    },
    {
      text: "Sua saúde agradece cada escolha consciente que você faz. Continue forte! 💪",
      color: "from-green-400 to-emerald-400"
    },
    {
      text: "Registrar seus gatilhos é um ato de amor próprio. Você merece uma vida livre! 💙",
      color: "from-blue-400 to-indigo-400"
    },
    {
      text: "Cada dia sem cigarro é um presente para seu futuro. Você consegue! 🎁",
      color: "from-purple-400 to-pink-400"
    },
    {
      text: "Sua jornada inspira outros. Continue sendo exemplo de coragem! 🌈",
      color: "from-pink-400 to-rose-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const message = messages[currentMessage];

  return (
    <Card className={`bg-gradient-to-r ${message.color} text-white mb-8 transform transition-all duration-500 hover:scale-105`}>
      <CardContent className="p-6 text-center">
        <p className="text-lg font-medium leading-relaxed">
          {message.text}
        </p>
      </CardContent>
    </Card>
  );
};

export default MotivationalMessage;
