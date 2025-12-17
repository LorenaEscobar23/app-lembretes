// Service para gerenciar notificações do navegador
export class NotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error);
        return false;
      }
    }

    return false;
  }

  static isSupported() {
    return 'Notification' in window;
  }

  static isGranted() {
    return Notification.permission === 'granted';
  }

  static isDenied() {
    return Notification.permission === 'denied';
  }

  static sendNotification(title, options = {}) {
    if (Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/logo.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200],
        ...options,
      });

      // Auto-fechar após 5 segundos
      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  static checkUpcomingReminders(reminders) {
    const now = new Date();
    const reminderWindow = 15 * 60 * 1000; // 15 minutos

    reminders.forEach((reminder) => {
      // Verificar se as notificações estão habilitadas para este lembrete
      if (!reminder.dueDate || reminder.completed || reminder.enableNotifications === false) return;

      const dueDate = new Date(reminder.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();

      // Se o lembrete vence em menos de 15 minutos
      if (timeDiff > 0 && timeDiff <= reminderWindow) {
        const minutesLeft = Math.ceil(timeDiff / 60000);
        
        // Notificar apenas uma vez por lembrete
        const notificationKey = `notified_${reminder.id}`;
        if (!sessionStorage.getItem(notificationKey)) {
          this.sendNotification(`⏰ Lembrete Próximo!`, {
            body: `${reminder.title} vence em ${minutesLeft} minuto${minutesLeft > 1 ? 's' : ''}`,
            tag: `reminder-${reminder.id}`,
            requireInteraction: true,
          });
          sessionStorage.setItem(notificationKey, 'true');
        }
      }

      // Se o lembrete está vencido
      if (timeDiff < 0 && !reminder.notifiedOverdue) {
        const overdueHours = Math.floor(Math.abs(timeDiff) / 3600000);
        
        const notificationKey = `overdue_${reminder.id}`;
        if (!sessionStorage.getItem(notificationKey)) {
          this.sendNotification(`⏱️ Lembrete Vencido!`, {
            body: `${reminder.title} venceu há ${overdueHours} hora${overdueHours > 1 ? 's' : ''}`,
            tag: `overdue-${reminder.id}`,
            requireInteraction: true,
          });
          sessionStorage.setItem(notificationKey, 'true');
        }
      }
    });
  }

  static notifyReminderAdded(title) {
    this.sendNotification('✅ Lembrete Adicionado', {
      body: title,
      tag: 'reminder-added',
    });
  }

  static notifyReminderCompleted(title) {
    this.sendNotification('✓ Lembrete Concluído', {
      body: title,
      tag: 'reminder-completed',
    });
  }

  static notifyMediaAdded(title, type) {
    this.sendNotification(`✅ ${type === 'filme' ? 'Filme' : 'Livro'} Adicionado`, {
      body: title,
      tag: 'media-added',
    });
  }
}
