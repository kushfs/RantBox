import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { FaHeart } from 'react-icons/fa'; // Font Awesome Heart

function PostCard({ title, content, author, createdAt, profilePicUrl, name, postId }) {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const handleLike = () => {
    setLiked((prev) => !prev); // Toggle like
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, users(username)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) console.log('Error fetching comments:', error);
    else setComments(data);
  };

  const handleCommentChange = (e) => setNewComment(e.target.value);

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error fetching user:', userError || 'Unauthenticated');
      return;
    }

    const { id: user_id } = user;

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id, content: newComment }])
      .select();

    if (error) {
      console.log('Error adding comment:', error);
    } else if (data?.length > 0) {
      setComments([data[0], ...comments]);
      setNewComment('');
    }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    const minutes = Math.floor(diff / 60);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div style={cardStyle}>
      <style>
        {`
          .liked-button {
            animation: pop 0.3s ease;
          }

          @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.4); }
            100% { transform: scale(1); }
          }

          .cloud-button:active {
            animation: bounce 0.2s ease;
          }

          @keyframes bounce {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        {profilePicUrl && (
          <img src={profilePicUrl} alt="Profile" style={avatarStyle} />
        )}
        <div>
          <div style={{ fontWeight: 'bold', color: '#333' }}>{author}</div>
          <div style={{ fontSize: '0.85em', color: '#777' }}>
            {name?.trim() || 'Anonymous'}
          </div>
          <div style={{ color: '#aaa', fontSize: '0.8em' }}>
            {new Date(createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '10px', color: '#222' }}>{title}</h3>
      <p style={{ lineHeight: '1.6', color: '#444' }}>{content}</p>

      <div style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
        <button
          onClick={handleLike}
          style={{
            ...btnStyle,
            color: liked ? 'white' : '#888',
            backgroundColor: liked ? '#ff4d6d' : '#eee',
          }}
          className={liked ? 'liked-button' : ''}
        >
          <FaHeart />
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="cloud-button"
          style={{
            ...btnStyle,
            backgroundColor: '#cce5ff',
            color: '#0056b3',
            fontSize: '18px',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            fontWeight: 'bold',
          }}
        >
          💬
        </button>
      </div>

      {showComments && (
        <div style={{ marginTop: '20px' }}>
          <h4>Comments</h4>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Add a comment..."
              style={commentInputStyle}
            />
            <button onClick={handleAddComment} style={postButtonStyle}>
              Post Comment
            </button>
          </div>

          <div style={{ marginTop: '15px' }}>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((comment, index) => (
                <div key={index} style={commentCardStyle}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {comment.user?.name || ''}
                  </div>
                  <div style={{ color: '#777', fontSize: '0.85em' }}>
                    {timeAgo(comment.created_at)}
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const cardStyle = {
  backgroundColor: '#ffebee',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: '20px',
  width: '100%',
  maxWidth: '600px',
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  marginRight: '10px',
  objectFit: 'cover',
};

const btnStyle = {
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  fontSize: '18px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
};

const commentInputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  resize: 'vertical',
};

const postButtonStyle = {
  padding: '8px 14px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const commentCardStyle = {
  backgroundColor: '#f9f9f9',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '10px',
  borderBottom: '1px solid #ddd',  // Add a thin grey line between comments
};

const commentContainerStyle = {
  marginTop: '15px',
  borderTop: '1px solid #ddd',  // Optional: Add a subtle line above the comment section for better separation
};


export default PostCard;
