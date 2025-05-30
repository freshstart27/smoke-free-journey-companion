
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TriggerRecord {
  id: string;
  date: string;
  time: string;
  emotion: string;
  situation: string;
  intensity: number;
}

interface ProgressChartProps {
  records: TriggerRecord[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ records }) => {
  // Prepare data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayRecords = records.filter(record => record.date === date);
    const dayName = new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' });
    
    return {
      day: dayName,
      registros: dayRecords.length,
      intensidadeMedia: dayRecords.length > 0 
        ? Math.round(dayRecords.reduce((sum, r) => sum + r.intensity, 0) / dayRecords.length)
        : 0
    };
  });

  const totalThisWeek = chartData.reduce((sum, day) => sum + day.registros, 0);
  const avgIntensity = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, day) => sum + day.intensidadeMedia, 0) / chartData.filter(d => d.registros > 0).length) || 0
    : 0;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Seus Padrões - Últimos 7 Dias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-800">{totalThisWeek}</div>
            <div className="text-sm text-blue-600">Registros esta semana</div>
          </div>
          <div className="bg-indigo-100 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-800">{avgIntensity}/10</div>
            <div className="text-sm text-indigo-600">Intensidade média</div>
          </div>
        </div>

        {records.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="day" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  formatter={(value, name) => [
                    value, 
                    name === 'registros' ? 'Registros' : 'Intensidade Média'
                  ]}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="registros" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-600">
              Comece a registrar seus gatilhos para ver seus padrões aqui!
            </p>
          </div>
        )}

        <div className="bg-blue-100 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            📈 <strong>Insights:</strong> Acompanhar seus padrões ajuda a identificar 
            situações de risco e momentos que precisam de mais atenção.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
