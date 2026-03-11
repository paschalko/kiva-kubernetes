export default function PostCard({ post, currentUser, onLike, onDelete }) {
  const isOwner = currentUser && post.authorUsername === currentUser.username;
  const canInteract = !!currentUser;

  return (
    <article className="card">
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center' }}>
        {post.authorProfileImageUrl ? (
          <img
            src={post.authorProfileImageUrl}
            alt={post.authorUsername}
            style={avatarStyle}
          />
        ) : (
          <div style={avatarFallbackStyle}>
            {post.authorUsername?.[0]?.toUpperCase()}
          </div>
        )}
        <div style={{ marginLeft: 8 }}>
          <div style={{ color: '#e4e4e7', fontWeight: 600, fontSize: '0.9rem' }}>{post.authorUsername}</div>
          {post.title && (
            <div style={{ color: '#d4d4d8', fontSize: '0.95rem', fontWeight: 600, marginTop: 2 }}>
              {post.title}
            </div>
          )}
        </div>
      </div>
      <div style={{ aspectRatio: post.mediaType === 'video' ? '16/9' : 'auto', background: '#09090b' }}>
        {post.mediaType === 'image' ? (
          <img
            src={post.mediaUrl}
            alt={post.caption || 'Post'}
            style={{ width: '100%', display: 'block', maxHeight: 400, objectFit: 'contain' }}
          />
        ) : (
          <video
            src={post.mediaUrl}
            controls
            style={{ width: '100%', display: 'block', maxHeight: 400 }}
          />
        )}
      </div>
      <div style={{ padding: '0.75rem 1rem' }}>
        {post.caption && <p style={{ margin: '0 0 0.5rem', whiteSpace: 'pre-wrap' }}>{post.caption}</p>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {canInteract ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onLike}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
            >
              {post.liked ? '❤️ Liked' : '🤍 Like'} ({post.likesCount ?? 0})
            </button>
          ) : (
            <span style={{ color: '#71717a', fontSize: '0.875rem' }}>
              🤍 {post.likesCount ?? 0} likes — log in to like
            </span>
          )}
          {isOwner && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => window.confirm('Delete this post?') && onDelete()}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

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
  flexShrink: 0,
};
