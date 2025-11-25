import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getUserCards, deleteCard } from '../utils/cardService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Pencil, X, Download, FileDown, Plus, LayoutGrid } from 'lucide-react';
import CardPreview from './CardPreview';
import ConfirmDialog from './ConfirmDialog';

const SavedCards = forwardRef(({ onLoadCard, onCreateCard }, ref) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, cardId: null });
  const { user } = useAuth();
  const { showToast } = useToast();

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

  const handleDelete = (cardId) => {
    setConfirmDialog({ isOpen: true, cardId });
  };

  const confirmDelete = async () => {
    const { error } = await deleteCard(confirmDialog.cardId);
    if (!error) {
      setCards(cards.filter(card => card.id !== confirmDialog.cardId));
      showToast('Card deleted successfully', 'success');
    } else {
      showToast('Failed to delete card', 'error');
    }
    setConfirmDialog({ isOpen: false, cardId: null });
  };

  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, cardId: null });
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

  const handleDownloadPNG = async (card, cardIndex) => {
    try {
      // Find the actual rendered card preview in the grid
      const cardElements = document.querySelectorAll('.saved-card-preview .business-card');
      const targetCard = cardElements[cardIndex];

      if (!targetCard) {
        console.error('Card element not found');
        return;
      }

      // Wait a bit for any pending renders
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use the export utility with the direct card element
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(targetCard, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      link.download = `${card.name.replace(/\s+/g, '-')}-card.png`;
      link.href = dataUrl;
      link.click();
      showToast('Card downloaded as PNG', 'success');
    } catch (error) {
      console.error('Error downloading PNG:', error);
      showToast('Failed to download PNG. Please try again.', 'error');
    }
  };

  const handleDownloadPDF = async (card, cardIndex) => {
    try {
      // Find the actual rendered card preview in the grid
      const cardElements = document.querySelectorAll('.saved-card-preview .business-card');
      const targetCard = cardElements[cardIndex];

      if (!targetCard) {
        console.error('Card element not found');
        return;
      }

      // Wait a bit for any pending renders
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use the export utility
      const { toPng } = await import('html-to-image');
      const jsPDF = (await import('jspdf')).default;

      const imgData = await toPng(targetCard, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      // Standard business card size (3.5 x 2 inches approx 89 x 51 mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [89, 51]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 89, 51);
      pdf.save(`${card.name.replace(/\s+/g, '-')}-card.pdf`);
      showToast('Card downloaded as PDF', 'success');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showToast('Failed to download PDF. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>My Saved Cards</h2>
        <div className="saved-cards-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="saved-card-item skeleton-card">
              <div className="skeleton-preview"></div>
              <div className="skeleton-actions"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
        My Saved Cards ({cards.length})
      </h2>

      {cards.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-state-icon">
            <LayoutGrid size={48} />
          </div>
          <h3>No saved cards yet</h3>
          <p>Create your first professional business card in seconds.</p>
          <button className="btn btn-primary" onClick={onCreateCard}>
            <Plus size={18} />
            <span>Create New Card</span>
          </button>
        </div>
      ) : (
        <div className="saved-cards-grid">
          {cards.map((card, index) => (
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
                  title="Edit Card"
                >
                  <Pencil size={18} />
                  <span>Edit</span>
                </button>
                <button
                  className="btn btn-outline btn-download"
                  onClick={() => handleDownloadPNG(card, index)}
                  title="Download PNG"
                >
                  <Download size={18} />
                  <span>PNG</span>
                </button>
                <button
                  className="btn btn-outline btn-download"
                  onClick={() => handleDownloadPDF(card, index)}
                  title="Download PDF"
                >
                  <FileDown size={18} />
                  <span>PDF</span>
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(card.id)}
                  title="Delete Card"
                >
                  <X size={20} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Card"
        message="Are you sure you want to delete this card? This action cannot be undone."
      />
    </div>
  );
});

SavedCards.displayName = 'SavedCards';

export default SavedCards;
