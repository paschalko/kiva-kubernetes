import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <>
      <header style={headerStyle}>
        <Link to="/" style={logoStyle}>Kiva Blog</Link>
        <nav style={navStyle}>
          {user ? (
            <>
              <Link to="/new" className="btn btn-primary" style={{ marginRight: 8 }}>New Post</Link>
              <Link to="/account" style={accountLinkStyle}>
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.username}
                    style={avatarStyle}
                  />
                ) : (
                  <div style={avatarFallbackStyle}>
                    {user.username[0]?.toUpperCase()}
                  </div>
                )}
                <span style={userStyle}>{user.username}</span>
              </Link>
              <button type="button" className="btn btn-ghost" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/signup" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      <main style={mainStyle}>{children}</main>
    </>
  );
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.5rem',
  borderBottom: '1px solid #27272a',
  background: '#18181b',
};

const logoStyle = { color: '#e4e4e7', fontSize: '1.25rem', fontWeight: 700, textDecoration: 'none' };
const navStyle = { display: 'flex', alignItems: 'center', gap: 8 };
const userStyle = { marginLeft: 8, color: '#e4e4e7', fontSize: '0.9rem' };
const mainStyle = { padding: '1.5rem 0', minHeight: 'calc(100vh - 60px)' };
const accountLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  padding: '0.25rem 0.5rem',
  borderRadius: 999,
  background: '#18181b',
  border: '1px solid #27272a',
};
const avatarStyle = {
  width: 32,
  height: 32,
  borderRadius: '999px',
  objectFit: 'cover',
};
const avatarFallbackStyle = {
  width: 32,
  height: 32,
  borderRadius: '999px',
  background: '#3f3f46',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#e4e4e7',
  fontWeight: 600,
  fontSize: '0.9rem',
};
