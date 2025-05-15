import React, { useState } from 'react';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [allowComments, setAllowComments] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Post created with title: ${title} and content: ${content}`);
  };

  const formStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    width: '500px',
    margin: '30px auto',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
  };

  const buttonStyle = {
    backgroundColor: '#00ff88',
    color: '#000',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ marginBottom: '20px' }}>Create a New Post</h2>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Write your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ ...inputStyle, height: '150px' }}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={inputStyle}
      />
      <label style={{ display: 'block', marginTop: '10px' }}>
        <input
          type="checkbox"
          checked={allowComments}
          onChange={() => setAllowComments(!allowComments)}
        />
        Allow Comments
      </label>
      <button type="submit" style={buttonStyle}>Post</button>
    </form>
  );
}

export default PostForm;
