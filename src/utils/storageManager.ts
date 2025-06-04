
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
  private getKey(dataType: keyof UserData): string {
    return `${STORAGE_PREFIX}_${dataType}`;
  }

  // Métodos para registos de tabagismo
  getSmokingRecords(): UserData['smokingRecords'] {
    const data = localStorage.getItem(this.getKey('smokingRecords'));
    return data ? JSON.parse(data) : [];
  }

  saveSmokingRecords(records: UserData['smokingRecords']): void {
    localStorage.setItem(this.getKey('smokingRecords'), JSON.stringify(records));
    this.logUserActivity('smoking_record_updated', { recordsCount: records.length });
  }

  // Métodos para registos de gatilhos
  getTriggerRecords(): UserData['triggerRecords'] {
    const data = localStorage.getItem(this.getKey('triggerRecords'));
    return data ? JSON.parse(data) : [];
  }

  saveTriggerRecords(records: UserData['triggerRecords']): void {
    localStorage.setItem(this.getKey('triggerRecords'), JSON.stringify(records));
    this.logUserActivity('trigger_record_added', { recordsCount: records.length });
  }

  // Métodos para feedback
  getFeedback(): UserData['feedback'] {
    const data = localStorage.getItem(this.getKey('feedback'));
    return data ? JSON.parse(data) : [];
  }

  saveFeedback(feedback: UserData['feedback']): void {
    localStorage.setItem(this.getKey('feedback'), JSON.stringify(feedback));
    this.logUserActivity('feedback_submitted', { feedbackCount: feedback.length });
  }

  // Métodos para meta diária
  getDailyTarget(): number {
    const data = localStorage.getItem(this.getKey('dailyTarget'));
    return data ? parseInt(data) : 20;
  }

  saveDailyTarget(target: number): void {
    localStorage.setItem(this.getKey('dailyTarget'), target.toString());
    this.logUserActivity('daily_target_changed', { newTarget: target });
  }

  // Métodos para configurações do utilizador
  getUserSettings(): UserData['userSettings'] {
    const data = localStorage.getItem(this.getKey('userSettings'));
    return data ? JSON.parse(data) : { cigarettePrice: 0.50, startDate: new Date().toISOString() };
  }

  saveUserSettings(settings: UserData['userSettings']): void {
    localStorage.setItem(this.getKey('userSettings'), JSON.stringify(settings));
    this.logUserActivity('settings_updated', settings);
  }

  // Registo de atividade do utilizador
  private logUserActivity(action: string, data: any): void {
    const activityLog = this.getActivityLog();
    activityLog.push({
      timestamp: new Date().toISOString(),
      action,
      data,
      sessionId: this.getSessionId()
    });
    
    // Manter apenas os últimos 1000 registos para não sobrecarregar o storage
    if (activityLog.length > 1000) {
      activityLog.splice(0, activityLog.length - 1000);
    }
    
    localStorage.setItem(this.getKey('activityLog' as keyof UserData), JSON.stringify(activityLog));
  }

  getActivityLog(): Array<{timestamp: string; action: string; data: any; sessionId: string}> {
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

  // Exportar todos os dados do utilizador
  exportAllData(): UserData & { activityLog: any[] } {
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
    // Migrar dados antigos se existirem
    const oldSmokingRecords = localStorage.getItem('smokingRecords');
    const oldTriggerRecords = localStorage.getItem('triggerRecords');
    const oldFeedback = localStorage.getItem('appFeedback');
    const oldDailyTarget = localStorage.getItem('dailyTarget');

    if (oldSmokingRecords && !localStorage.getItem(this.getKey('smokingRecords'))) {
      this.saveSmokingRecords(JSON.parse(oldSmokingRecords));
      localStorage.removeItem('smokingRecords');
    }

    if (oldTriggerRecords && !localStorage.getItem(this.getKey('triggerRecords'))) {
      this.saveTriggerRecords(JSON.parse(oldTriggerRecords));
      localStorage.removeItem('triggerRecords');
    }

    if (oldFeedback && !localStorage.getItem(this.getKey('feedback'))) {
      this.saveFeedback(JSON.parse(oldFeedback));
      localStorage.removeItem('appFeedback');
    }

    if (oldDailyTarget && !localStorage.getItem(this.getKey('dailyTarget'))) {
      this.saveDailyTarget(parseInt(oldDailyTarget));
      localStorage.removeItem('dailyTarget');
    }
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

// Executar migração automaticamente
storageManager.migrateOldData();
