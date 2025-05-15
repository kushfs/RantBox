import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import PostCard from './PostCard';
import { supabase } from './supabaseClient';

function App() {
  const [posts, setPosts] = useState([]);

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Router>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#d7ccc8',
          minHeight: '100vh',
        }}
      >
        <Navbar setPosts={setPosts} />
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                {posts.length === 0 ? (
                  <p>No posts available.</p>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      title={post.title}
                      content={post.content}
                      author={post.name ? post.name : ''} // ✅ use name if present, else Anonymous
                      createdAt={post.created_at}
                      profilePicUrl={post.profilePicUrl} // ✅ optional, only if you store this
                    />
                  ))
                )}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
