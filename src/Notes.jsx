import { useState, useEffect } from 'react';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { database } from './firebase';
import './Notes.css';

export default function Notes({ userId }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Carregar anotações do Firebase
  useEffect(() => {
    if (!userId) return;

    const notesRef = ref(database, `notes/${userId}`);
    const unsubscribe = onValue(
      notesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const notesList = Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }));
          setNotes(notesList);
        } else {
          setNotes([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar anotações:', err);
        setError('Erro ao carregar anotações. Verifique a conexão.');
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
    if (title.length < 3) {
      setError('Título deve ter pelo menos 3 caracteres');
      return false;
    }
    if (title.length > 100) {
      setError('Título não pode ter mais de 100 caracteres');
      return false;
    }
    if (!content.trim()) {
      setError('Conteúdo é obrigatório');
      return false;
    }
    return true;
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const notesRef = ref(database, `notes/${userId}`);

      if (editingId) {
        // Atualizar
        await update(ref(database, `notes/${userId}/${editingId}`), {
          title: title.trim(),
          content: content.trim(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Adicionar nova
        await push(notesRef, {
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setTitle('');
      setContent('');
      setEditingId(null);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar anotação. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta anotação?')) return;

    try {
      await remove(ref(database, `notes/${userId}/${id}`));
    } catch (err) {
      console.error('Erro ao deletar:', err);
      setError('Erro ao deletar anotação. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setError('');
  };

  // Filtrar por busca
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="notes-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando anotações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <div className="notes-form-section">
        <h2>{editingId ? '✏️ Editar Anotação' : '✏️ Nova Anotação'}</h2>
        <form onSubmit={handleAddOrUpdate} className="notes-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="note-title">Título</label>
            <input
              id="note-title"
              type="text"
              placeholder="Ex: Ideias para projeto..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={isSaving}
            />
            <small className="char-count">{title.length}/100</small>
          </div>

          <div className="form-group">
            <label htmlFor="note-content">Conteúdo</label>
            <textarea
              id="note-content"
              placeholder="Digite sua anotação aqui..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              disabled={isSaving}
            ></textarea>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? '⏳ Salvando...' : (editingId ? '💾 Atualizar' : '➕ Adicionar')}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="notes-search-section">
        <input
          type="text"
          placeholder="🔍 Buscar anotações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <p className="notes-count">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'anotação' : 'anotações'}
        </p>
      </div>

      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📌</p>
            <p className="empty-text">
              {notes.length === 0
                ? 'Nenhuma anotação criada ainda'
                : 'Nenhuma anotação encontrada'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <div className="note-actions">
                  <button
                    onClick={() => handleEdit(note)}
                    className="btn-icon btn-edit"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="btn-icon btn-delete"
                    title="Deletar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="note-content">{note.content}</p>
              <p className="note-meta">
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Data desconhecida'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
