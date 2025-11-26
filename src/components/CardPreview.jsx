import React from 'react';
import { Phone, Mail, Instagram, Globe } from 'lucide-react';

export default function CardPreview({ data }) {
  const { name, title, phone, email, blog, instagram, image, theme, layout, imageGradient } = data;

  return (
    <div id="business-card" className={`business-card theme-${theme} layout-${layout}`}>
      {/* Decorative elements based on layout */}
      {layout === 'creative' && (
        <>
          <div className="deco-circle" style={{
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.1)',
            top: '-100px',
            right: '-100px'
          }} />
          <div className="deco-circle" style={{
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.05)',
            bottom: '-50px',
            left: '-50px'
          }} />
        </>
      )}

      {layout === 'organic' && (
        <>
          <div className="organic-blob blob-1"></div>
          <div className="organic-blob blob-2"></div>
        </>
      )}

      {layout === 'geometric' && (
        <>
          <div className="geo-shape geo-1"></div>
          <div className="geo-shape geo-2"></div>
          <div className="geo-shape geo-3"></div>
        </>
      )}

      {layout === 'elegant' && (
        <div className="elegant-border"></div>
      )}

      {layout === 'sophisticated' && (
        <>
          <div className="sophisticated-frame"></div>
          <div className="sophisticated-accent"></div>
        </>
      )}

      <div className={`card-image-section ${imageGradient ? 'has-gradient' : ''}`}>
        {image ? (
          <img src={image} alt="Card" />
        ) : (
          <div className="placeholder-image">
            <span>📷</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h2 className="card-name">{name || 'Your Name'}</h2>
          <p className="card-title">{title || 'Piano Instructor'}</p>
          {layout === 'elegant' && <div className="separator"></div>}
        </div>

        <div className="card-details">
          {phone && (
            <div className="detail-item">
              <span className="detail-icon"><Phone size={16} /></span>
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="detail-item">
              <span className="detail-icon"><Mail size={16} /></span>
              <span>{email}</span>
            </div>
          )}
          {instagram && (
            <div className="detail-item">
              <span className="detail-icon"><Instagram size={16} /></span>
              <span>{instagram}</span>
            </div>
          )}
          {blog && (
            <div className="detail-item">
              <span className="detail-icon"><Globe size={16} /></span>
              <span>{blog}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
