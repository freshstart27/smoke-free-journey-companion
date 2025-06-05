
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Database, Download, Eye, EyeOff } from 'lucide-react';
import { storageManager } from '@/utils/storageManager';

interface UserStats {
  id: string;
  name: string;
  createdAt: string;
  smokingRecords: number;
  triggerRecords: number;
  feedback: number;
  lastActivity: string;
}

const AdminPanel: React.FC = () => {
  const [allUsers, setAllUsers] = useState<UserStats[]>([]);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    loadAllUsersData();
  }, []);

  const loadAllUsersData = () => {
    // Carregar lista de utilizadores
    const savedUsers = localStorage.getItem('fresh_start_users');
    if (!savedUsers) return;

    const users = JSON.parse(savedUsers);
    const usersStats: UserStats[] = [];

    users.forEach((user: any) => {
      // Temporariamente mudar para cada utilizador para obter os dados
      const currentUserId = storageManager.getCurrentUserId();
      storageManager.setCurrentUser(user.id);

      const smokingRecords = storageManager.getSmokingRecords();
      const triggerRecords = storageManager.getTriggerRecords();
      const feedback = storageManager.getFeedback();
      const activityLog = storageManager.getActivityLog();

      const lastActivity = activityLog.length > 0 
        ? activityLog[activityLog.length - 1].timestamp 
        : user.createdAt;

      usersStats.push({
        id: user.id,
        name: user.name,
        createdAt: user.createdAt,
        smokingRecords: smokingRecords.length,
        triggerRecords: triggerRecords.length,
        feedback: feedback.length,
        lastActivity
      });

      // Restaurar utilizador original
      storageManager.setCurrentUser(currentUserId);
    });

    setAllUsers(usersStats);
  };

  const exportAllUsersData = () => {
    const savedUsers = localStorage.getItem('fresh_start_users');
    if (!savedUsers) return;

    const users = JSON.parse(savedUsers);
    const allData: any = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      appName: "Fresh Start - Dados Administrativos",
      totalUsers: users.length,
      users: []
    };

    const currentUserId = storageManager.getCurrentUserId();

    users.forEach((user: any) => {
      storageManager.setCurrentUser(user.id);
      
      const userData = {
        userInfo: user,
        data: storageManager.exportAllData()
      };
      
      allData.users.push(userData);
    });

    // Restaurar utilizador original
    storageManager.setCurrentUser(currentUserId);

    // Criar ficheiro para download
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `fresh-start-admin-dados-${dateStr}.json`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const isFirstUser = () => {
    const savedUsers = localStorage.getItem('fresh_start_users');
    if (!savedUsers) return false;
    
    const users = JSON.parse(savedUsers);
    const currentUserId = storageManager.getCurrentUserId();
    
    return users.length > 0 && users[0].id === currentUserId;
  };

  if (!isFirstUser()) {
    return null; // Não mostrar nada se não for o primeiro utilizador
  }

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center text-red-800">
          <Shield className="w-5 h-5 mr-2" />
          Painel de Administração
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Estatísticas Gerais</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowData(!showData)}
            >
              {showData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showData ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Total de Utilizadores:</span>
              <span className="font-medium ml-2">{allUsers.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Registos de Cigarro:</span>
              <span className="font-medium ml-2">
                {allUsers.reduce((sum, user) => sum + user.smokingRecords, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Registos de Gatilhos:</span>
              <span className="font-medium ml-2">
                {allUsers.reduce((sum, user) => sum + user.triggerRecords, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Feedback Total:</span>
              <span className="font-medium ml-2">
                {allUsers.reduce((sum, user) => sum + user.feedback, 0)}
              </span>
            </div>
          </div>
        </div>

        {showData && (
          <div className="bg-white p-4 rounded-lg border border-red-200 max-h-64 overflow-y-auto">
            <h4 className="font-semibold mb-3 text-gray-800">Detalhes por Utilizador:</h4>
            <div className="space-y-2">
              {allUsers.map(user => (
                <div key={user.id} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-600 text-xs">
                    Registado: {new Date(user.createdAt).toLocaleDateString('pt-BR')} | 
                    Última atividade: {new Date(user.lastActivity).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-500">
                    Cigarros: {user.smokingRecords} | Gatilhos: {user.triggerRecords} | Feedback: {user.feedback}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={exportAllUsersData}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Dados de Todos os Utilizadores
        </Button>

        <div className="bg-red-100 p-3 rounded-lg">
          <p className="text-sm text-red-800">
            🔐 <strong>Acesso Restrito:</strong> Este painel só é visível para o criador do site 
            (primeiro utilizador registado). Os dados incluem informações de todos os utilizadores.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
