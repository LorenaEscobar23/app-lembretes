import Reminders from './Reminders';
import './App.css';

function App() {
  // Usar um userId fixo para armazenar os lembretes localmente
  const userId = 'local-user';

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📋 Gestor de Lembretes</h1>
      </header>
      <main>
        <Reminders userId={userId} />
      </main>
    </div>
  );
}

export default App;
