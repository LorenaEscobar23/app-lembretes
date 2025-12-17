import { useState, useEffect } from 'react';
import Reminders from './Reminders';
import Notes from './Notes';
import Media from './Media';
import NotificationBanner from './NotificationBanner';
import { NotificationService } from './NotificationService';
import './App.css';

function App() {
  const userId = 'local-user';
  const [activeTab, setActiveTab] = useState('reminders');
  const [reminders, setReminders] = useState([]);

  // Verificar notificações a cada 30 segundos
  useEffect(() => {
    if (!NotificationService.isSupported()) return;

    const interval = setInterval(() => {
      NotificationService.checkUpcomingReminders(reminders);
    }, 30000);

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="app-container">
      <NotificationBanner />
      <header className="app-header">
        <h1>📋 Gestor de Tarefas</h1>
        <p className="app-subtitle">Organize seus lembretes e anotações em um só lugar</p>
      </header>
      
      <nav className="app-tabs">
        <button 
          className={`app-tab ${activeTab === 'reminders' ? 'active' : ''}`}
          onClick={() => setActiveTab('reminders')}
        >
          📝 Lembretes
        </button>
        <button 
          className={`app-tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          📌 Anotações
        </button>
        <button 
          className={`app-tab ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          🎬 Filmes & Livros
        </button>
      </nav>

      <main>
        <div className={`tab-content ${activeTab === 'reminders' ? 'active' : ''}`}>
          <Reminders userId={userId} setReminders={setReminders} />
        </div>
        <div className={`tab-content ${activeTab === 'notes' ? 'active' : ''}`}>
          <Notes userId={userId} />
        </div>
        <div className={`tab-content ${activeTab === 'media' ? 'active' : ''}`}>
          <Media userId={userId} />
        </div>
      </main>
    </div>
  );
}

export default App;
