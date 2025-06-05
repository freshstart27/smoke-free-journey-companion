
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Plus, LogOut, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
}

interface UserManagerProps {
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ currentUser, onUserChange }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('fresh_start_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  };

  const saveUsers = (userList: UserProfile[]) => {
    localStorage.setItem('fresh_start_users', JSON.stringify(userList));
    setUsers(userList);
  };

  const createUser = () => {
    if (!newUserName.trim()) return;

    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    onUserChange(newUser);
    setNewUserName('');
    setShowCreateForm(false);
  };

  const selectUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      onUserChange(user);
    }
  };

  const logout = () => {
    onUserChange(null);
  };

  if (showCreateForm) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Plus className="w-5 h-5 mr-2" />
            Criar Novo Utilizador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userName">Nome do Utilizador</Label>
            <Input
              id="userName"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Digite o seu nome"
              onKeyDown={(e) => e.key === 'Enter' && createUser()}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={createUser} disabled={!newUserName.trim()}>
              Criar
            </Button>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Users className="w-5 h-5 mr-2" />
            Selecionar Utilizador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.length > 0 && (
            <div>
              <Label>Utilizadores Existentes</Label>
              <Select onValueChange={selectUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um utilizador" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Utilizador
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            <div>
              <span className="font-semibold text-blue-800">{currentUser.name}</span>
              <p className="text-xs text-blue-600">
                Desde {new Date(currentUser.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-blue-600 border-blue-200 hover:bg-blue-100"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Trocar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManager;
