import { useState, useEffect } from 'react';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { database } from './firebase';
import './Media.css';

export default function Media({ userId }) {
  const [mediaList, setMediaList] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('filme');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [watched, setWatched] = useState(false);
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const mediaRef = ref(database, `media/${userId}`);
    const unsubscribe = onValue(
      mediaRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const mediaArray = Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }));
          setMediaList(mediaArray);
        } else {
          setMediaList([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar:', err);
        setError('Erro ao carregar mídias. Verifique a conexão.');
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
    setError('');
    return true;
  };

  const handleAddMedia = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);

    const mediaData = {
      title: title.trim(),
      type,
      author: author.trim(),
      rating: parseInt(rating),
      watched,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const updateRef = ref(database, `media/${userId}/${editingId}`);
        await update(updateRef, mediaData);
        setEditingId(null);
      } else {
        const mediaRef = ref(database, `media/${userId}`);
        await push(mediaRef, mediaData);
      }

      setTitle('');
      setType('filme');
      setAuthor('');
      setRating(5);
      setWatched(false);
      setNotes('');
      setError('');
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar mídia. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (media) => {
    setTitle(media.title);
    setType(media.type);
    setAuthor(media.author || '');
    setRating(media.rating || 5);
    setWatched(media.watched || false);
    setNotes(media.notes || '');
    setEditingId(media.id);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;

    try {
      const deleteRef = ref(database, `media/${userId}/${id}`);
      await remove(deleteRef);
      setError('');
    } catch (err) {
      console.error('Erro ao deletar:', err);
      setError('Erro ao deletar mídia. Tente novamente.');
    }
  };

  const handleToggleWatched = async (media) => {
    try {
      const updateRef = ref(database, `media/${userId}/${media.id}`);
      await update(updateRef, { watched: !media.watched });
      setError('');
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      setError('Erro ao atualizar mídia. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setType('filme');
    setAuthor('');
    setRating(5);
    setWatched(false);
    setNotes('');
    setEditingId(null);
    setError('');
  };

  const filteredAndSortedMedia = mediaList
    .filter((media) => {
      const matchesSearch =
        media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        media.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || media.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const stats = {
    total: mediaList.length,
    filmes: mediaList.filter((m) => m.type === 'filme').length,
    livros: mediaList.filter((m) => m.type === 'livro').length,
    watched: mediaList.filter((m) => m.watched).length,
  };

  return (
    <div className="media-container">
      <div className="header-section">
        <h1>🎬 Filmes & Livros</h1>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="close-error">✕</button>
        </div>
      )}

      <form onSubmit={handleAddMedia} className="form-section">
        <h2>{editingId ? '✏️ Editar Mídia' : '➕ Adicionar Novo'}</h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Tipo *</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
              disabled={isSaving}
            >
              <option value="filme">🎬 Filme</option>
              <option value="livro">📚 Livro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              placeholder="Ex: Inception, Harry Potter..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              disabled={isSaving}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="author">
              {type === 'filme' ? 'Diretor' : 'Autor'}
            </label>
            <input
              id="author"
              type="text"
              placeholder={type === 'filme' ? 'Ex: Christopher Nolan' : 'Ex: J.K. Rowling'}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="input-field"
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Avaliação</label>
            <div className="rating-input">
              <input
                id="rating"
                type="range"
                min="0"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="range-slider"
                disabled={isSaving}
              />
              <span className="rating-value">{rating}/10</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Anotações</label>
          <textarea
            id="notes"
            placeholder="Suas impressões, recomendações..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="textarea-field"
            rows="3"
            disabled={isSaving}
          />
        </div>

        <div className="form-group checkbox">
          <input
            id="watched"
            type="checkbox"
            checked={watched}
            onChange={(e) => setWatched(e.target.checked)}
            disabled={isSaving}
          />
          <label htmlFor="watched">
            {type === 'filme' ? '✓ Já assisti' : '✓ Já li'}
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
            placeholder="🔍 Buscar por título ou diretor/autor..."
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
              <option value="rating">Melhor avaliação</option>
              <option value="title">Alfabético</option>
            </select>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Todos ({stats.total})
            </button>
            <button
              className={`filter-btn ${filterType === 'filme' ? 'active' : ''}`}
              onClick={() => setFilterType('filme')}
            >
              Filmes ({stats.filmes})
            </button>
            <button
              className={`filter-btn ${filterType === 'livro' ? 'active' : ''}`}
              onClick={() => setFilterType('livro')}
            >
              Livros ({stats.livros})
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando mídias...</p>
        </div>
      ) : filteredAndSortedMedia.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>Nenhuma mídia encontrada</h3>
          <p>
            {searchTerm
              ? 'Tente ajustar sua busca'
              : mediaList.length === 0
              ? 'Adicione seus filmes e livros favoritos!'
              : 'Nenhuma mídia neste tipo'}
          </p>
        </div>
      ) : (
        <div className="media-list">
          {filteredAndSortedMedia.map((media) => (
            <div
              key={media.id}
              className={`media-card ${media.watched ? 'watched' : ''} ${
                editingId === media.id ? 'editing' : ''
              }`}
            >
              <div className="media-type-badge">{media.type === 'filme' ? '🎬' : '📚'}</div>

              <div className="media-content">
                <input
                  type="checkbox"
                  checked={media.watched}
                  onChange={() => handleToggleWatched(media)}
                  className="checkbox"
                  aria-label={`Marcar "${media.title}" como ${
                    media.watched ? 'não assistido' : 'assistido'
                  }`}
                />
                <div className="media-info">
                  <h3>{media.title}</h3>
                  {media.author && (
                    <p className="author">
                      {media.type === 'filme' ? '🎥' : '✍️'} {media.author}
                    </p>
                  )}
                  {media.notes && <p className="notes">💭 {media.notes}</p>}
                  <div className="media-meta">
                    <span className="rating">⭐ {media.rating}/10</span>
                    <span className="status">
                      {media.watched ? (media.type === 'filme' ? '✓ Assistido' : '✓ Lido') : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="media-actions">
                <button
                  onClick={() => handleEdit(media)}
                  className="btn-icon edit"
                  title="Editar"
                  disabled={isSaving}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(media.id)}
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
