import { useEffect, useState } from 'react';
import * as postService from '../../services/postService';
import './PostListPage.css';
import PostItem from '../../components/PostItem/PostItem';

export default function PostListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts = await postService.index();
        setPosts(prevPosts => {
          // Create a Set of existing post IDs for quick lookup
          const existingIds = new Set(prevPosts.map(p => p._id));
          // Only add posts that don't already exist
          const newPosts = fetchedPosts.filter(post => !existingIds.has(post._id));
          return [...prevPosts, ...newPosts];
        });
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    }
    fetchPosts();
  }, []);

  const postItems = posts.map((p) => <PostItem key={p._id} post={p} />);

  return (
    <>
      <h1>Post List</h1>
      <section className="post-item-container">{postItems}</section>
    </>
  );
}
