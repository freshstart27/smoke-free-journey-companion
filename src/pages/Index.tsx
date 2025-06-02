
import React, { useState, useEffect } from 'react';
import { Calendar, Heart, TrendingUp, Bell, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TriggerForm from '@/components/TriggerForm';
import HealthySuggestions from '@/components/HealthySuggestions';
import ProgressChart from '@/components/ProgressChart';
import MotivationalMessage from '@/components/MotivationalMessage';
import SmokingTracker from '@/components/SmokingTracker';
import QuitBenefits from '@/components/QuitBenefits';
import FeedbackForm from '@/components/FeedbackForm';

interface TriggerRecord {
  id: string;
  date: string;
  time: string;
  emotion: string;
  situation: string;
  intensity: number;
}

const Index = () => {
  const [showTriggerForm, setShowTriggerForm] = useState(false);
  const [triggerRecords, setTriggerRecords] = useState<TriggerRecord[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // Load saved records from localStorage
    const saved = localStorage.getItem('triggerRecords');
    if (saved) {
      setTriggerRecords(JSON.parse(saved));
    }

    // Calculate current streak
    const today = new Date().toDateString();
    const todayRecords = triggerRecords.filter(record => 
      new Date(record.date).toDateString() === today
    );
    setCurrentStreak(todayRecords.length);
  }, [triggerRecords]);

  const addTriggerRecord = (record: Omit<TriggerRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString()
    };
    const updatedRecords = [...triggerRecords, newRecord];
    setTriggerRecords(updatedRecords);
    localStorage.setItem('triggerRecords', JSON.stringify(updatedRecords));
    setShowTriggerForm(false);
  };

  const todayRecords = triggerRecords.filter(record => 
    new Date(record.date).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/8f24ce16-0605-4280-9f46-4cffbbb06664.png" 
              alt="Fresh Start Logo" 
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#333333' }}>
            Fresh Start
          </h1>
          <p style={{ color: '#666666' }}>
            Sua jornada para uma vida sem cigarro, um passo de cada vez
          </p>
        </div>

        {/* Motivational Message */}
        <MotivationalMessage />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-white" style={{ background: '#388E3C' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Registros Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayRecords}</div>
              <p className="text-green-100 text-xs">
                Autoconsciência em ação
              </p>
            </CardContent>
          </Card>

          <Card className="text-white" style={{ background: 'linear-gradient(to right, #A8E6CF, #388E3C)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Total de Registros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{triggerRecords.length}</div>
              <p className="text-green-100 text-xs">
                Conhecimento sobre si mesmo
              </p>
            </CardContent>
          </Card>

          <Card className="text-white" style={{ background: '#A8E6CF', color: '#333333' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Dias Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(triggerRecords.map(r => new Date(r.date).toDateString())).size}
              </div>
              <p className="text-xs opacity-80">
                Comprometimento diário
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Button
            onClick={() => setShowTriggerForm(true)}
            className="w-full text-white font-semibold py-4 rounded-xl shadow-lg transform transition hover:scale-105"
            style={{ 
              background: '#388E3C',
              border: 'none'
            }}
            size="lg"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2E7D32';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#388E3C';
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Gatilho ou Vontade
          </Button>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5" style={{ backgroundColor: '#D0F0FD' }}>
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-800"
              style={{ color: '#333333' }}
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="tracker" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-800"
              style={{ color: '#333333' }}
            >
              Rastreamento
            </TabsTrigger>
            <TabsTrigger 
              value="benefits" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-800"
              style={{ color: '#333333' }}
            >
              Benefícios
            </TabsTrigger>
            <TabsTrigger 
              value="suggestions" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-800"
              style={{ color: '#333333' }}
            >
              Dicas
            </TabsTrigger>
            <TabsTrigger 
              value="feedback" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-800"
              style={{ color: '#333333' }}
            >
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Healthy Suggestions */}
              <HealthySuggestions />

              {/* Progress Chart */}
              <ProgressChart records={triggerRecords} />
            </div>
          </TabsContent>

          <TabsContent value="tracker">
            <SmokingTracker />
          </TabsContent>

          <TabsContent value="benefits">
            <QuitBenefits />
          </TabsContent>

          <TabsContent value="suggestions">
            <HealthySuggestions />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackForm />
          </TabsContent>
        </Tabs>

        {/* Trigger Form Modal */}
        {showTriggerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <TriggerForm
                onSubmit={addTriggerRecord}
                onCancel={() => setShowTriggerForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
