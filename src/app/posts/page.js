'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/auth'); 
    } else {
      const loggedInUser = {
        email: localStorage.getItem('userEmail'),
        id: localStorage.getItem('userId'),
      };
      setUser(loggedInUser);
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes, commentsRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/comments'),
        ]);

        const [postsData, usersData, commentsData] = await Promise.all([
          postsRes.json(),
          usersRes.json(),
          commentsRes.json(),
        ]);

        setPosts(postsData);
        setUsers(usersData);
        setComments(commentsData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePostClick = (postId) => {
    const relatedComments = comments.filter((comment) => comment.postId === postId);
    setPostComments(relatedComments);
    setSelectedPost(postId);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setPostComments([]);
  };

  if (loading) return <div className="text-center py-8">Loading posts...</div>;

  const filteredPosts = user?.email === 'admin@admin.com'
    ? posts 
    : posts.filter((post) => post.userId === parseInt(user?.id)); 

  const loggedInUser = users.find((u) => u.email === user?.email);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Posts
        {user?.email && loggedInUser && user.email !== 'admin@admin.com' && (
          <span className="text-xl text-gray-600 ml-3">({loggedInUser.name})</span>
        )}
      </h1>

      {/* Data visualization for admins only */}
      {user?.email === 'admin@admin.com' && (
        <div className="mb-8 flex justify-center">
          <h2 className="text-xl font-semibold mb-2">Data Visualization</h2>
          <ApexCharts
            options={{ chart: { type: 'pie' }, labels: ['Users', 'Posts', 'Comments'] }}
            series={[users.length, posts.length, comments.length]}
            type="pie"
            width="400"
          />
        </div>
      )}

      {/* Post list with styled cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.length === 0 ? (
          <div>No posts available for you.</div> 
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="cursor-pointer border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white hover:bg-gray-50 flex flex-col justify-center items-center text-center min-h-[150px]"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{post.body}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal for displaying post details */}
      {selectedPost && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedPost?.title}</h2>
            <p className="mb-4 text-gray-700">{selectedPost?.body}</p>

            <h3 className="text-xl font-semibold mb-2">Comments</h3>
            {postComments.length > 0 ? (
              <ul className="space-y-4">
                {postComments.map((comment) => (
                  <li key={comment.id} className="border-b pb-2">
                    <p className="font-medium">
                      {comment.name} <span className="text-sm text-gray-500">({comment.email})</span>
                    </p>
                    <p className="text-gray-600">{comment.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments available for this post.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
