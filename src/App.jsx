import { useState } from 'react';
import Reminders from './Reminders';
import Notes from './Notes';
import './App.css';

function App() {
  const userId = 'local-user';
  const [activeTab, setActiveTab] = useState('reminders');

  return (
    <div className="app-container">
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
      </nav>

      <main>
        <div className={`tab-content ${activeTab === 'reminders' ? 'active' : ''}`}>
          <Reminders userId={userId} />
        </div>
        <div className={`tab-content ${activeTab === 'notes' ? 'active' : ''}`}>
          <Notes userId={userId} />
        </div>
      </main>
    </div>
  );
}

export default App;
