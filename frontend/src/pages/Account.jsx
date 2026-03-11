import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAccount, updateAccountProfile } from '../api/client';
import PostCard from '../components/PostCard';

export default function Account() {
  const { user, getToken, login } = useAuth();
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || '');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAccount(getToken);
        setProfileImageUrl(data.user.profileImageUrl || '');
        setPosts(data.posts || []);
      } catch (e) {
        setError(e.message || 'Failed to load account');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, getToken, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = await updateAccountProfile(profileImageUrl, getToken);
      if (user) {
        login(localStorage.getItem('kiva_blog_token'), {
          ...user,
          profileImageUrl: data.user.profileImageUrl || '',
        });
      }
    } catch (e) {
      setError(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;
  if (loading) return <div className="container">Loading account…</div>;

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <h1 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Account</h1>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="profileImageUrl">
              Profile picture URL
            </label>
            <input
              id="profileImageUrl"
              type="url"
              placeholder="https://example.com/your-avatar.png"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
            />
          </div>
          {profileImageUrl && (
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ display: 'block', marginBottom: 4, color: '#a1a1aa', fontSize: '0.875rem' }}>
                Preview
              </span>
              <img
                src={profileImageUrl}
                alt="Profile preview"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '999px',
                  objectFit: 'cover',
                  border: '2px solid #3f3f46',
                }}
              />
            </div>
          )}
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      <h2 style={{ margin: '0 0 0.75rem' }}>Your posts</h2>
      {posts.length === 0 ? (
        <p style={{ color: '#71717a' }}>You have not posted anything yet.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={user}
            onLike={() => {}}
            onDelete={() => {}}
          />
        ))
      )}
    </div>
  );
}

