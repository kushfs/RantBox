import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Navbar() {
  const [session, setSession] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [darkTheme, setDarkTheme] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) showNotification('Error logging in with Google: ' + error.message);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const handleAddPost = async () => {
    if (postContent.trim() === '') {
      showNotification('Post cannot be empty.');
      return;
    }

    const nameFromProfile = session?.user?.user_metadata?.full_name || 'Anonymous';

    const { error } = await supabase.from('posts').insert({
      user_id: session.user.id,
      content: postContent,
      name: nameFromProfile,
    });

    if (error) {
      showNotification('Error posting: ' + error.message);
    } else {
      showNotification('Post added!');
      setPostContent('');
      setShowPostForm(false);
    }
  };

  const avatarUrl = session?.user?.user_metadata?.avatar_url;

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000); // Hide notification after 3 seconds
  };

  return (
    <div style={darkTheme ? styles.darkWrapper : styles.lightWrapper}>
      <nav style={styles.navbar}>
        <h1 style={styles.brand}>RantBox</h1>

        <div style={styles.navLinks}>
          {session ? (
            <>
              <button className="nav-btn" onClick={() => setShowPostForm(true)}>Add post +</button>
              <div style={styles.profileContainer}>
                {avatarUrl && <img src={avatarUrl} alt="Profile" style={styles.avatar} />}
                <div style={styles.dropdownContainer}>
                  <button onClick={toggleDropdown} className="nav-btn">Profile ⬇</button>
                  {dropdownVisible && (
                    <div style={styles.dropdownMenu}>
                      <button className="dropdown-btn" onClick={toggleTheme}>
                      </button>
                      <a href="https://github.com/kushfs" target="_blank" rel="noopener noreferrer">
                        <button className="dropdown-btn">About</button>
                      </a>
                      <button className="dropdown-btn" onClick={handleSignOut}>Sign Out</button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <button onClick={signInWithGoogle} className="nav-btn">Login with Google</button>
          )}
        </div>
      </nav>

      {showPostForm && (
        <div style={styles.overlay}>
          <div style={styles.postForm}>
            <h2>Add a Post</h2>
            <textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              style={styles.textarea}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <button onClick={handleAddPost} style={styles.postButton}>Post</button>
              <button onClick={() => setShowPostForm(false)} style={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && <div style={styles.notification}>{notification}</div>}

     <style>{`
  .nav-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    background-color: transparent;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }
  .nav-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  .nav-btn:focus {
    outline: none;
  }
  .dropdown-btn {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: white;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;
  }
  .dropdown-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>

    </div>
  );
}

const styles = {
  lightWrapper: {
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    color: '#000',
  },
  navbar: {
    backgroundColor: '#5d4037',
    padding: '10px 20px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  brand: {
    margin: 0,
    fontSize: '24px',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  profileContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: '#334155',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 10,
    minWidth: '160px',
    overflow: 'hidden',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  postForm: {
    backgroundColor: '#efebe9',
    borderRadius: '10px',
    padding: '20px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    color: '#000',
  },
  textarea: {
    width: '100%',
  boxSizing: 'border-box',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  resize: 'vertical',
  },
  postButton: {
    backgroundColor: '#38bdf8',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#000',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
 notification: {
  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(135deg, rgba(56,189,248,0.8), rgba(56,189,248,0.4))',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '12px',
  zIndex: 100,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  animation: 'fadeInUp 0.6s ease-out',
},

};

export default Navbar;
