import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../api/client';

export default function CreatePost() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose an image or video.');
      return;
    }
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('title', title);
      formData.append('caption', caption);
      await createPost(formData, getToken);
      navigate('/');
    } catch (e) {
      setError(e.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const accept = 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime';

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: '2rem auto', padding: '1.5rem' }}>
        <h1 style={{ marginTop: 0 }}>New post</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required-badge">required</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="media">Image or video <span className="required-badge">required</span></label>
            <input
              id="media"
              type="file"
              accept={accept}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={2000}
              placeholder="Write a caption…"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting…' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
