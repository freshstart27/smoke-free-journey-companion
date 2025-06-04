import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Minus, Plus, Cigarette } from 'lucide-react';
import { storageManager } from '@/utils/storageManager';

interface SmokingRecord {
  date: string;
  cigarettes: number;
}

const SmokingTracker: React.FC = () => {
  const [todayCigarettes, setTodayCigarettes] = useState(0);
  const [smokingRecords, setSmokingRecords] = useState<SmokingRecord[]>([]);
  const [dailyTarget, setDailyTarget] = useState(20);

  useEffect(() => {
    // Carregar dados do novo sistema de storage
    const records = storageManager.getSmokingRecords();
    setSmokingRecords(records);
    
    const target = storageManager.getDailyTarget();
    setDailyTarget(target);

    // Carregar contagem de hoje
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = records.find((record: SmokingRecord) => record.date === today);
    if (todayRecord) {
      setTodayCigarettes(todayRecord.cigarettes);
    }
  }, []);

  const updateTodayCount = (newCount: number) => {
    if (newCount < 0) return;
    
    setTodayCigarettes(newCount);
    
    const today = new Date().toISOString().split('T')[0];
    const updatedRecords = smokingRecords.filter(record => record.date !== today);
    if (newCount > 0) {
      updatedRecords.push({ date: today, cigarettes: newCount });
    }
    
    setSmokingRecords(updatedRecords);
    storageManager.saveSmokingRecords(updatedRecords);
  };

  const updateDailyTarget = (target: number) => {
    setDailyTarget(target);
    storageManager.saveDailyTarget(target);
  };

  const getProgressPercentage = () => {
    if (dailyTarget === 0) return 0;
    return Math.min((todayCigarettes / dailyTarget) * 100, 100);
  };

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
      if (i === 0 && todayCigarettes > 0) {
        break;
      }
      daysCount++;
    }
    
    return daysCount;
  };

  const progressPercentage = getProgressPercentage();
  const daysWithoutSmoking = getDaysWithoutSmoking();

  return (
    <div className="space-y-6">
      {/* Daily Target Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Cigarette className="w-5 h-5 mr-2" />
            Meta Diária
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Quantos cigarros você costuma fumar por dia?</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="number"
                value={dailyTarget}
                onChange={(e) => updateDailyTarget(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20"
                min="0"
              />
              <span className="text-sm text-gray-600">cigarros/dia</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Count */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Hoje ({new Date().toLocaleDateString('pt-BR')})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {todayCigarettes}
            </div>
            <p className="text-gray-600">cigarros fumados hoje</p>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateTodayCount(todayCigarettes - 1)}
              disabled={todayCigarettes === 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateTodayCount(todayCigarettes + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {dailyTarget > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da meta:</span>
                <span>{todayCigarettes}/{dailyTarget}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progressPercentage <= 50 ? 'bg-green-500' : 
                    progressPercentage <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Days Without Smoking */}
      {daysWithoutSmoking > 0 && (
        <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {daysWithoutSmoking}
            </div>
            <p className="text-green-100">
              {daysWithoutSmoking === 1 ? 'dia sem fumar' : 'dias consecutivos sem fumar'}
            </p>
            <p className="text-green-100 text-sm mt-2">
              🎉 Parabéns! Continue assim!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmokingTracker;
