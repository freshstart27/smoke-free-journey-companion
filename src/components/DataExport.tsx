
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { storageManager } from '@/utils/storageManager';

const DataExport: React.FC = () => {
  const exportData = () => {
    try {
      // Obter todos os dados
      const allData = storageManager.exportAllData();
      
      // Criar o conteúdo do ficheiro
      const exportContent = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        appName: "Fresh Start - Parar de Fumar",
        data: allData
      };

      // Converter para JSON formatado
      const jsonString = JSON.stringify(exportContent, null, 2);
      
      // Criar o ficheiro para download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Criar nome do ficheiro com data
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      const filename = `fresh-start-dados-${dateStr}-${timeStr}.json`;
      
      // Fazer download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL
      URL.revokeObjectURL(url);
      
      console.log('✅ Dados exportados com sucesso:', filename);
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    }
  };

  const getDataSummary = () => {
    const data = storageManager.exportAllData();
    return {
      smokingRecords: data.smokingRecords.length,
      triggerRecords: data.triggerRecords.length,
      feedback: data.feedback.length,
      activityLogs: data.activityLog.length,
      dailyTarget: data.dailyTarget,
      hasSettings: !!data.userSettings
    };
  };

  const summary = getDataSummary();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <FileText className="w-5 h-5 mr-2" />
          Exportação de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-3 text-gray-800">Resumo dos Seus Dados:</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Registos de Cigarro:</span>
              <span className="font-medium ml-2">{summary.smokingRecords}</span>
            </div>
            <div>
              <span className="text-gray-600">Registos de Gatilhos:</span>
              <span className="font-medium ml-2">{summary.triggerRecords}</span>
            </div>
            <div>
              <span className="text-gray-600">Feedback Enviado:</span>
              <span className="font-medium ml-2">{summary.feedback}</span>
            </div>
            <div>
              <span className="text-gray-600">Logs de Atividade:</span>
              <span className="font-medium ml-2">{summary.activityLogs}</span>
            </div>
            <div>
              <span className="text-gray-600">Meta Diária:</span>
              <span className="font-medium ml-2">{summary.dailyTarget} cigarros</span>
            </div>
            <div>
              <span className="text-gray-600">Configurações:</span>
              <span className="font-medium ml-2">{summary.hasSettings ? '✓' : '✗'}</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={exportData}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Todos os Dados
        </Button>

        <div className="bg-blue-100 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            💾 <strong>Backup Seguro:</strong> Esta exportação inclui todos os seus dados pessoais, 
            registos de progresso e configurações. Mantenha o ficheiro em local seguro.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExport;
