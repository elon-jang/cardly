import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getUserCards, deleteCard } from '../utils/cardService';
import { useAuth } from '../contexts/AuthContext';
import { Pencil, X } from 'lucide-react';
import CardPreview from './CardPreview';

const SavedCards = forwardRef(({ onLoadCard }, ref) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadCards = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await getUserCards(user.id);
    if (!error && data) {
      setCards(data);
    }
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    refresh: loadCards
  }));

  useEffect(() => {
    loadCards();
  }, [user]);

  const handleDelete = async (cardId) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    const { error } = await deleteCard(cardId);
    if (!error) {
      setCards(cards.filter(card => card.id !== cardId));
    }
  };

  const handleLoad = (card) => {
    onLoadCard({
      name: card.name,
      title: card.title,
      phone: card.phone,
      email: card.email,
      instagram: card.instagram,
      blog: card.blog,
      image: card.image,
      theme: card.theme,
      layout: card.layout,
      imageGradient: card.image_gradient,
    });
  };

  if (loading) {
    return (
      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>My Saved Cards</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
        My Saved Cards ({cards.length})
      </h2>

      {cards.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
          No saved cards yet. Create and save your first card!
        </p>
      ) : (
        <div className="saved-cards-grid">
          {cards.map((card) => (
            <div key={card.id} className="saved-card-item">
              <div className="saved-card-preview">
                <CardPreview data={{
                  name: card.name,
                  title: card.title,
                  phone: card.phone,
                  email: card.email,
                  instagram: card.instagram,
                  blog: card.blog,
                  image: card.image,
                  theme: card.theme,
                  layout: card.layout,
                  imageGradient: card.image_gradient
                }} />
              </div>
              <div className="saved-card-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => handleLoad(card)}
                >
                  <Pencil size={16} />
                  <span>Edit</span>
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(card.id)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SavedCards.displayName = 'SavedCards';

export default SavedCards;
