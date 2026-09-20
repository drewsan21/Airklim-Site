import { useState } from 'react';

type ContentType = 'blog' | 'video' | 'gallery' | 'testimonial';

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  image?: string;
  url?: string;
  category?: string;
  published: boolean;
  createdAt: string;
}

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState<ContentType>('blog');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { id: 'blog' as ContentType, label: 'Blog', icon: '📝', count: contents.filter(c => c.type === 'blog').length },
    { id: 'video' as ContentType, label: 'Video', icon: '🎥', count: contents.filter(c => c.type === 'video').length },
    { id: 'gallery' as ContentType, label: 'Galleria', icon: '🖼️', count: contents.filter(c => c.type === 'gallery').length },
    { id: 'testimonial' as ContentType, label: 'Testimonianze', icon: '⭐', count: contents.filter(c => c.type === 'testimonial').length }
  ];

  const filteredContents = contents.filter(c => c.type === activeTab);

  const handleAddContent = (content: Omit<ContentItem, 'id' | 'createdAt'>) => {
    const newContent: ContentItem = {
      ...content,
      id: `content-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setContents([...contents, newContent]);
    setShowAddModal(false);
  };

  const handleTogglePublish = (contentId: string) => {
    setContents(contents.map(c => 
      c.id === contentId ? { ...c, published: !c.published } : c
    ));
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo contenuto?')) {
      setContents(contents.filter(c => c.id !== contentId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestione Contenuti</h1>
          <p className="text-white/50">Gestisci blog, video, galleria e testimonianze</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
        >
          ➕ Aggiungi Contenuto
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{contents.length}</div>
          <div className="text-sm text-white/50">Contenuti Totali</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{contents.filter(c => c.published).length}</div>
          <div className="text-sm text-white/50">Pubblicati</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-amber-400">{contents.filter(c => !c.published).length}</div>
          <div className="text-sm text-white/50">Bozze</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-sky-400">{tabs.find(t => t.id === activeTab)?.count}</div>
          <div className="text-sm text-white/50">{tabs.find(t => t.id === activeTab)?.label}</div>
        </div>
      </div>

      {/* Lista Contenuti */}
      {filteredContents.length === 0 ? (
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-12 text-center">
          <div className="text-6xl mb-4">{tabs.find(t => t.id === activeTab)?.icon}</div>
          <h3 className="text-xl font-bold text-white mb-2">Nessun contenuto</h3>
          <p className="text-white/50 mb-6">Inizia aggiungendo il tuo primo contenuto</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
          >
            ➕ Aggiungi Contenuto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map(content => (
            <div key={content.id} className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden hover:border-sky-500/30 transition-all">
              {content.image && (
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
                  <img src={content.image} alt={content.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white">{content.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    content.published 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {content.published ? 'Pubblicato' : 'Bozza'}
                  </span>
                </div>
                <p className="text-sm text-white/50 line-clamp-2">{content.description}</p>
                {content.category && (
                  <div className="text-xs text-sky-400">{content.category}</div>
                )}
                <div className="text-xs text-white/40">
                  {new Date(content.createdAt).toLocaleDateString('it-IT')}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleTogglePublish(content.id)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      content.published
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                        : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                    }`}
                  >
                    {content.published ? '📥 Annulla Pubblicazione' : '📤 Pubblica'}
                  </button>
                  <button
                    onClick={() => handleDeleteContent(content.id)}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Aggiungi Contenuto */}
      {showAddModal && (
        <ContentFormModal
          type={activeTab}
          onSave={handleAddContent}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

// Componente Form Modal
function ContentFormModal({ type, onSave, onClose }: {
  type: ContentType;
  onSave: (content: Omit<ContentItem, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    type,
    title: '',
    description: '',
    image: '',
    url: '',
    category: '',
    published: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getFormFields = () => {
    switch (type) {
      case 'blog':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Categoria</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
                placeholder="Es: Guida all'Acquisto, Manutenzione, ecc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Immagine Copertina (URL)</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
                placeholder="https://..."
              />
            </div>
          </>
        );
      case 'video':
        return (
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">URL Video (YouTube/Vimeo)</label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        );
      case 'gallery':
        return (
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">URL Immagine</label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              placeholder="https://..."
            />
          </div>
        );
      case 'testimonial':
        return (
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
            >
              <option value="">Seleziona categoria</option>
              <option value="privato">Cliente Privato</option>
              <option value="professionista">Professionista</option>
              <option value="azienda">Azienda</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Aggiungi {tabs.find(t => t.id === type)?.label}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Titolo</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              placeholder="Titolo del contenuto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Descrizione</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none resize-none"
              placeholder="Descrizione del contenuto"
            />
          </div>

          {getFormFields()}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 rounded bg-white/5 border border-white/10"
            />
            <label htmlFor="published" className="text-sm text-white/70">
              Pubblica immediatamente
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
            >
              Aggiungi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const tabs = [
  { id: 'blog' as ContentType, label: 'Blog', icon: '📝' },
  { id: 'video' as ContentType, label: 'Video', icon: '🎥' },
  { id: 'gallery' as ContentType, label: 'Galleria', icon: '🖼️' },
  { id: 'testimonial' as ContentType, label: 'Testimonianze', icon: '⭐' }
];
