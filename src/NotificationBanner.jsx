import { useState, useEffect } from 'react';
import { NotificationService } from './NotificationService';
import './NotificationBanner.css';

export default function NotificationBanner() {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!NotificationService.isSupported()) {
      return;
    }

    const status = Notification.permission;
    setPermissionStatus(status);

    // Mostrar banner apenas se não houver permissão
    if (status === 'default') {
      setShowBanner(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await NotificationService.requestPermission();
    if (granted) {
      setPermissionStatus('granted');
      setShowBanner(false);
      NotificationService.sendNotification('🔔 Notificações Ativadas!', {
        body: 'Você receberá notificações sobre seus lembretes',
      });
    } else {
      setPermissionStatus('denied');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner || !NotificationService.isSupported()) {
    return null;
  }

  return (
    <div className="notification-banner">
      <div className="banner-content">
        <span className="banner-icon">🔔</span>
        <div className="banner-text">
          <h3>Receba notificações</h3>
          <p>Não perca seus lembretes com notificações automáticas</p>
        </div>
      </div>
      <div className="banner-actions">
        <button onClick={handleEnableNotifications} className="banner-btn enable">
          Ativar
        </button>
        <button onClick={handleDismiss} className="banner-btn dismiss">
          Agora não
        </button>
      </div>
    </div>
  );
}
