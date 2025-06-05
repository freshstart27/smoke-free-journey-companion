
// Gestor de armazenamento organizado para registos de utilizadores
const STORAGE_PREFIX = 'registos';

interface UserData {
  smokingRecords: Array<{date: string; cigarettes: number}>;
  triggerRecords: Array<{id: string; date: string; time: string; emotion: string; situation: string; intensity: number}>;
  feedback: Array<{name: string; email: string; feedbackType: string; message: string; rating: number; timestamp: string}>;
  dailyTarget: number;
  userSettings: {
    cigarettePrice: number;
    startDate: string;
  };
}

class StorageManager {
  private currentUserId: string | null = null;

  setCurrentUser(userId: string | null): void {
    this.currentUserId = userId;
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  private getKey(dataType: keyof UserData): string {
    if (!this.currentUserId) {
      throw new Error('Nenhum utilizador selecionado');
    }
    return `${STORAGE_PREFIX}_${this.currentUserId}_${dataType}`;
  }

  // Métodos para registos de tabagismo
  getSmokingRecords(): UserData['smokingRecords'] {
    if (!this.currentUserId) return [];
    const data = localStorage.getItem(this.getKey('smokingRecords'));
    return data ? JSON.parse(data) : [];
  }

  saveSmokingRecords(records: UserData['smokingRecords']): void {
    if (!this.currentUserId) return;
    localStorage.setItem(this.getKey('smokingRecords'), JSON.stringify(records));
    this.logUserActivity('smoking_record_updated', { recordsCount: records.length });
  }

  // Métodos para registos de gatilhos
  getTriggerRecords(): UserData['triggerRecords'] {
    if (!this.currentUserId) return [];
    const data = localStorage.getItem(this.getKey('triggerRecords'));
    return data ? JSON.parse(data) : [];
  }

  saveTriggerRecords(records: UserData['triggerRecords']): void {
    if (!this.currentUserId) return;
    localStorage.setItem(this.getKey('triggerRecords'), JSON.stringify(records));
    this.logUserActivity('trigger_record_added', { recordsCount: records.length });
  }

  // Métodos para feedback
  getFeedback(): UserData['feedback'] {
    if (!this.currentUserId) return [];
    const data = localStorage.getItem(this.getKey('feedback'));
    return data ? JSON.parse(data) : [];
  }

  saveFeedback(feedback: UserData['feedback']): void {
    if (!this.currentUserId) return;
    localStorage.setItem(this.getKey('feedback'), JSON.stringify(feedback));
    this.logUserActivity('feedback_submitted', { feedbackCount: feedback.length });
  }

  // Métodos para meta diária
  getDailyTarget(): number {
    if (!this.currentUserId) return 20;
    const data = localStorage.getItem(this.getKey('dailyTarget'));
    return data ? parseInt(data) : 20;
  }

  saveDailyTarget(target: number): void {
    if (!this.currentUserId) return;
    localStorage.setItem(this.getKey('dailyTarget'), target.toString());
    this.logUserActivity('daily_target_changed', { newTarget: target });
  }

  // Métodos para configurações do utilizador
  getUserSettings(): UserData['userSettings'] {
    if (!this.currentUserId) return { cigarettePrice: 0.50, startDate: new Date().toISOString() };
    const data = localStorage.getItem(this.getKey('userSettings'));
    return data ? JSON.parse(data) : { cigarettePrice: 0.50, startDate: new Date().toISOString() };
  }

  saveUserSettings(settings: UserData['userSettings']): void {
    if (!this.currentUserId) return;
    localStorage.setItem(this.getKey('userSettings'), JSON.stringify(settings));
    this.logUserActivity('settings_updated', settings);
  }

  // Registo de atividade do utilizador
  private logUserActivity(action: string, data: any): void {
    if (!this.currentUserId) return;
    const activityLog = this.getActivityLog();
    activityLog.push({
      timestamp: new Date().toISOString(),
      action,
      data,
      sessionId: this.getSessionId(),
      userId: this.currentUserId
    });
    
    // Manter apenas os últimos 1000 registos para não sobrecarregar o storage
    if (activityLog.length > 1000) {
      activityLog.splice(0, activityLog.length - 1000);
    }
    
    localStorage.setItem(this.getKey('activityLog' as keyof UserData), JSON.stringify(activityLog));
  }

  getActivityLog(): Array<{timestamp: string; action: string; data: any; sessionId: string; userId?: string}> {
    if (!this.currentUserId) return [];
    const data = localStorage.getItem(this.getKey('activityLog' as keyof UserData));
    return data ? JSON.parse(data) : [];
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('freshstart_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('freshstart_session_id', sessionId);
    }
    return sessionId;
  }

  // Exportar todos os dados do utilizador atual
  exportAllData(): UserData & { activityLog: any[] } {
    if (!this.currentUserId) {
      return {
        smokingRecords: [],
        triggerRecords: [],
        feedback: [],
        dailyTarget: 20,
        userSettings: { cigarettePrice: 0.50, startDate: new Date().toISOString() },
        activityLog: []
      };
    }

    return {
      smokingRecords: this.getSmokingRecords(),
      triggerRecords: this.getTriggerRecords(),
      feedback: this.getFeedback(),
      dailyTarget: this.getDailyTarget(),
      userSettings: this.getUserSettings(),
      activityLog: this.getActivityLog()
    };
  }

  // Migrar dados existentes para a nova estrutura
  migrateOldData(): void {
    // Este método agora não faz migração automática
    // A migração deve ser feita manualmente se necessário
  }

  // Limpar dados do utilizador atual
  clearUserData(): void {
    if (!this.currentUserId) return;
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${STORAGE_PREFIX}_${this.currentUserId}_`)
    );
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Limpar todos os dados (para testes ou reset)
  clearAllData(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem('freshstart_session_id');
  }
}

// Exportar instância única
export const storageManager = new StorageManager();
