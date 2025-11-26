import React from 'react';
import { Upload, Info } from 'lucide-react';

export default function CardForm({ data, onChange, onImageChange, customImages = [] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const presetImages = [
    // Violin images (1-6)
    'https://images.unsplash.com/photo-1492563817904-5f1dc687974f?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcxNTI4fA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585263547501-7e5a0c222010?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTczMDI2fA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',

    'https://images.unsplash.com/photo-1626234042769-7966a61f42f3?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcwMzg2fA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554605018-0c34eb0db36a?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTY5NDMwfA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',

    // Piano images (7-20)


    'https://images.unsplash.com/photo-1552422530-9b41dc72286b?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcwNzU0fA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522249210728-7cd95094022a?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcwNzcyfA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://plus.unsplash.com/premium_photo-1726812132514-ff13bbcc39af?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcwNzk2fA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571974599782-87624638275e?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcwODI0fA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618585889230-8db08837c79f?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcwODQyfA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1612077216809-1e48cdb1e1b9?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcwODU3fA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587977318625-6e88a0cd5603?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcwOTUwfA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://plus.unsplash.com/premium_photo-1661962698962-f06dfadd4154?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcxMDM4fA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1676877717887-c6fcecf704a7?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzYzOTcwOTMzfA&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80'
  ];

  const allImages = [...customImages, ...presetImages];

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Card Details</h2>

      <div className="form-group">
        <label className="form-label">Layout Style</label>
        <select
          name="layout"
          value={data.layout}
          onChange={handleChange}
          className="form-input"
        >
          <option value="standard">Modern Standard</option>
          <option value="bold">Bold Modern</option>
          <option value="geometric">Geometric Shapes</option>
          <option value="elegant">Classic Elegant</option>
          <option value="creative">Artistic Creative</option>
          <option value="organic">Soft Organic</option>
          <option value="sophisticated">Sophisticated Warm</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Theme Color</label>
        <select
          name="theme"
          value={data.theme}
          onChange={handleChange}
          className="form-input"
        >
          <option value="light">Clean Light</option>
          <option value="dark">Sleek Dark</option>
          <option value="cream">Warm Cream</option>
          <option value="navy">Royal Navy</option>
          <option value="pastel">Soft Pastel</option>
          <option value="earth">Natural Earth</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Card Image</label>
        <div className="image-selector">
          <div className="image-grid">
            {allImages.map((url, index) => (
              <button
                key={index}
                className={`image-option ${data.image === url ? 'selected' : ''}`}
                onClick={() => onChange('image', url)}
                style={{ backgroundImage: `url(${url})` }}
                title={index < customImages.length ? `Custom ${index + 1}` : `Preset ${index - customImages.length + 1}`}
              />
            ))}
          </div>

          <div className="file-upload-wrapper">
            <label className="btn btn-outline upload-btn" style={{ width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Upload size={18} />
              <span>Upload Custom Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="gradient-toggle-wrapper" style={{ marginTop: '1rem' }}>
            <label className="toggle-label">
              <span className="toggle-text">
                Soft Gradient Fade
                <Info size={14} className="info-icon" title="Adds a subtle fade effect to the image edges" />
              </span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={data.imageGradient || false}
                  onChange={(e) => onChange('imageGradient', e.target.checked)}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          className="form-input"
          placeholder="e.g. Clara Schumann"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Profession / Title</label>
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          className="form-input"
          placeholder="e.g. Professional Piano Instructor"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Phone</label>
        <input
          type="tel"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          className="form-input"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          className="form-input"
          placeholder="clara@piano.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Instagram</label>
        <input
          type="text"
          name="instagram"
          value={data.instagram}
          onChange={handleChange}
          className="form-input"
          placeholder="@clara_piano"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Blog / Website</label>
        <input
          type="text"
          name="blog"
          value={data.blog}
          onChange={handleChange}
          className="form-input"
          placeholder="blog.naver.com/clara"
        />
      </div>
    </div>
  );
}
