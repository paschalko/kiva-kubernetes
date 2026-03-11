import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPosts, likePost, deletePost } from '../api/client';
import PostCard from '../components/PostCard';

export default function Home() {
  const { user, getToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  const load = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts(getToken, query);
      setPosts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLike = async (postId) => {
    if (!user) return;
    try {
      const updated = await likePost(postId, getToken);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, liked: updated.liked, likesCount: updated.likesCount }
            : p
        )
      );
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (postId) => {
    if (!user) return;
    try {
      await deletePost(postId, getToken);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setActiveQuery(search.trim());
    await load(search.trim());
  };

  if (loading) return <div className="container">Loading…</div>;
  if (error) return <div className="container"><p className="error-msg">{error}</p></div>;

  return (
    <div className="container">
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Search by username or title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      {activeQuery && (
        <p style={{ marginTop: 0, marginBottom: '0.75rem', color: '#a1a1aa', fontSize: '0.875rem' }}>
          Showing results for <strong>{activeQuery}</strong>
        </p>
      )}
      {!user && (
        <p style={{ marginBottom: '1rem', color: '#a1a1aa' }}>
          You can browse posts. <Link to="/login">Log in</Link> or <Link to="/signup">Sign up</Link> to create posts and like.
        </p>
      )}
      {posts.length === 0 ? (
        <p style={{ color: '#71717a' }}>No posts yet. Be the first to create one!</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={user}
            onLike={() => handleLike(post._id)}
            onDelete={() => handleDelete(post._id)}
          />
        ))
      )}
    </div>
  );
}
