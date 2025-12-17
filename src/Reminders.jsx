import { useState, useEffect } from 'react';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { database } from './firebase';
import { NotificationService } from './NotificationService';
import './Reminders.css';

export default function Reminders({ userId, setReminders }) {
  const [reminders, setRemindersLocal] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [checklist, setChecklist] = useState([]);
  const [checklistInput, setChecklistInput] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const remindersRef = ref(database, `reminders/${userId}`);
    const unsubscribe = onValue(
      remindersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const remindersList = Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }));
          setRemindersLocal(remindersList);
          setReminders(remindersList);
        } else {
          setRemindersLocal([]);
          setReminders([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar:', err);
        setError('Erro ao carregar lembretes. Verifique a conexão e as regras do Firebase.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('Título é obrigatório');
      return false;
    }
    if (title.trim().length < 3) {
      setError('Título deve ter no mínimo 3 caracteres');
      return false;
    }
    setError('');
    return true;
  };

  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  const addChecklistItem = () => {
    if (checklistInput.trim()) {
      setChecklist([
        ...checklist,
        { id: generateId(), text: checklistInput.trim(), completed: false }
      ]);
      setChecklistInput('');
    }
  };

  const removeChecklistItem = (id) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const toggleChecklistItem = async (reminderId, itemId) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder && reminder.checklist) {
      const updatedChecklist = reminder.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      try {
        await update(ref(database, `reminders/${userId}/${reminderId}`), {
          checklist: updatedChecklist
        });
      } catch (err) {
        console.error('Erro ao atualizar checklist:', err);
        setError('Erro ao atualizar checklist. Tente novamente.');
      }
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);

    const reminderData = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      notificationTime,
      checklist: checklist.length > 0 ? checklist : [],
      enableNotifications,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const updateRef = ref(database, `reminders/${userId}/${editingId}`);
        await update(updateRef, { ...reminderData, updatedAt: new Date().toISOString() });
        setEditingId(null);
      } else {
        const remindersRef = ref(database, `reminders/${userId}`);
        await push(remindersRef, reminderData);
        // Notificar quando lembrete é adicionado
        NotificationService.notifyReminderAdded(title);
      }

      setTitle('');
      setDescription('');
      setDueDate('');
      setNotificationTime('09:00');
      setChecklist([]);
      setChecklistInput('');
      setEnableNotifications(true);
      setError('');
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar lembrete. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (reminder) => {
    setTitle(reminder.title);
    setDescription(reminder.description || '');
    setDueDate(reminder.dueDate || '');
    setNotificationTime(reminder.notificationTime || '09:00');
    setChecklist(reminder.checklist || []);
    setChecklistInput('');
    setEnableNotifications(reminder.enableNotifications !== false);
    setEditingId(reminder.id);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este lembrete?')) return;

    try {
      const deleteRef = ref(database, `reminders/${userId}/${id}`);
      await remove(deleteRef);
      setError('');
    } catch (err) {
      console.error('Erro ao deletar:', err);
      setError('Erro ao deletar lembrete. Tente novamente.');
    }
  };

  const handleToggleComplete = async (reminder) => {
    try {
      const updateRef = ref(database, `reminders/${userId}/${reminder.id}`);
      const isCompleting = !reminder.completed;
      await update(updateRef, { completed: isCompleting });
      
      // Notificar quando lembrete é completado
      if (isCompleting) {
        NotificationService.notifyReminderCompleted(reminder.title);
      }
      
      setError('');
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      setError('Erro ao atualizar lembrete. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setNotificationTime('09:00');
    setChecklist([]);
    setChecklistInput('');
    setEnableNotifications(true);
    setEditingId(null);
    setError('');
  };

  const filteredAndSortedReminders = reminders
    .filter((reminder) => {
      const matchesSearch =
        reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && reminder.completed) ||
        (filter === 'pending' && !reminder.completed);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const stats = {
    total: reminders.length,
    pending: reminders.filter((r) => !r.completed).length,
    completed: reminders.filter((r) => r.completed).length,
  };

  return (
    <div className="reminders-container">
      <div className="header-section">
        <h1>📝 Meus Lembretes</h1>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="close-error">✕</button>
        </div>
      )}

      <form onSubmit={handleAddReminder} className="form-section">
        <h2>{editingId ? '✏️ Editar Lembrete' : '➕ Novo Lembrete'}</h2>
        
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            id="title"
            type="text"
            placeholder="Ex: Comprar leite..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            maxLength={100}
            disabled={isSaving}
            required
          />
          <span className="char-count">{title.length}/100</span>
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            placeholder="Adicione mais detalhes (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea-field"
            rows="3"
            maxLength={500}
            disabled={isSaving}
          />
          <span className="char-count">{description.length}/500</span>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Data de Vencimento</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field"
            disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notificationTime">⏰ Horário da Notificação</label>
          <input
            id="notificationTime"
            type="time"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
            className="input-field"
            disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label>📋 Checklist</label>
          <div className="checklist-input-group">
            <input
              type="text"
              placeholder="Digite um item do checklist..."
              value={checklistInput}
              onChange={(e) => setChecklistInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
              className="input-field"
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={addChecklistItem}
              className="btn btn-secondary"
              disabled={isSaving || !checklistInput.trim()}
            >
              ➕ Adicionar
            </button>
          </div>
          {checklist.length > 0 && (
            <ul className="checklist-items">
              {checklist.map((item) => (
                <li key={item.id} className="checklist-item">
                  <span>{item.text}</span>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="btn-remove"
                    disabled={isSaving}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group checkbox">
          <input
            id="enableNotifications"
            type="checkbox"
            checked={enableNotifications}
            onChange={(e) => setEnableNotifications(e.target.checked)}
            disabled={isSaving}
          />
          <label htmlFor="enableNotifications">
            🔔 Receber notificação no celular
          </label>
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? '⏳ Salvando...' : editingId ? '✏️ Atualizar' : '➕ Adicionar'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={isSaving}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="controls-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar lembretes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-sort-group">
          <div className="sort-group">
            <label htmlFor="sort">Ordenar por:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Mais recentes</option>
              <option value="dueDate">Por data</option>
              <option value="title">Alfabético</option>
            </select>
          </div>

          <div className="filter-buttons">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' && `✓ Todos (${stats.total})`}
                {f === 'pending' && `⏳ Pendentes (${stats.pending})`}
                {f === 'completed' && `✓ Concluídos (${stats.completed})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando lembretes...</p>
        </div>
      ) : filteredAndSortedReminders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Nenhum lembrete encontrado</h3>
          <p>
            {searchTerm
              ? 'Tente ajustar sua busca'
              : reminders.length === 0
              ? 'Crie um novo lembrete para começar!'
              : 'Nenhum lembrete nesta categoria'}
          </p>
        </div>
      ) : (
        <div className="reminders-list">
          {filteredAndSortedReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`reminder-card ${reminder.completed ? 'completed' : ''} ${
                editingId === reminder.id ? 'editing' : ''
              }`}
            >
              <div className="reminder-content">
                <input
                  type="checkbox"
                  checked={reminder.completed}
                  onChange={() => handleToggleComplete(reminder)}
                  className="checkbox"
                  aria-label={`Marcar "${reminder.title}" como ${
                    reminder.completed ? 'incompleto' : 'completo'
                  }`}
                />
                <div className="reminder-text">
                  <h3>{reminder.title}</h3>
                  {reminder.description && <p>{reminder.description}</p>}
                  {reminder.checklist && reminder.checklist.length > 0 && (
                    <ul className="reminder-checklist">
                      {reminder.checklist.map((item) => (
                        <li key={item.id} className={item.completed ? 'completed' : ''}>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklistItem(reminder.id, item.id)}
                            disabled={isSaving}
                          />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="reminder-meta">
                    {reminder.dueDate && (
                      <span className="due-date">
                        📅 {new Date(reminder.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    <span className="created-date">
                      Criado em {new Date(reminder.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="reminder-actions">
                <button
                  onClick={() => handleEdit(reminder)}
                  className="btn-icon edit"
                  title="Editar"
                  disabled={isSaving}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="btn-icon delete"
                  title="Deletar"
                  disabled={isSaving}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
