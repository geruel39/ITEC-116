import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { LoginPopup } from "../components/login"
import { SignupPopup } from "../components/signup";
import axios from "axios";
import * as jwtModule from 'jwt-decode';
const jwtDecode = jwtModule?.default ?? jwtModule?.jwtDecode ?? jwtModule;

export function Post() {
    const [OpenLogin, setOpenLogin] = useState(false);
    const [OpenSignup, setOpenSignup] = useState(false);
    const [showPostForm, setShowPostForm] = useState(false);
    const [posts, setPosts] = useState([]);
    const [commentsByPost, setCommentsByPost] = useState({});
    const [showCommentsFor, setShowCommentsFor] = useState({});
    const [newCommentByPost, setNewCommentByPost] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const postsPerPage = 5;

    useEffect(() => {
        fetchPosts();
    }, [currentPage]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUserId(Number(decoded.sub || decoded.id));
            } catch (err) {
                console.error('Failed to decode token', err);
            }
        } else {
            setCurrentUserId(null);
        }
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/posts?page=${currentPage}&limit=${postsPerPage}`);
            console.log('Posts response:', response.data); // For debugging
            if (response.data.success && response.data.data) {
                setPosts(response.data.data.posts);
                setTotalPages(response.data.data.totalPages);
            } else {
                setPosts([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Keep UI usable even if fetch fails (don't force login to view posts)
            setPosts([]);
            setTotalPages(0);
        }
    };

    const handleEditClick = (post) => {
        setEditingPostId(post.id);
        setEditTitle(post.title);
        setEditContent(post.content);
    };

    const fetchComments = async (postId) => {
        try {
            const resp = await axios.get(`http://localhost:3000/comments/post/${postId}`);
            setCommentsByPost(prev => ({ ...prev, [postId]: resp.data?.data ?? [] }));
        } catch (err) {
            console.error('Failed to fetch comments', err);
            setCommentsByPost(prev => ({ ...prev, [postId]: [] }));
        }
    };

    const toggleComments = async (postId) => {
        setShowCommentsFor(prev => {
            const next = { ...prev, [postId]: !prev[postId] };
            return next;
        });
        // if not loaded and we're opening, fetch
        if (!commentsByPost[postId]) {
            await fetchComments(postId);
        }
    };

    const handleAddComment = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) { setOpenLogin(true); return; }
        const content = newCommentByPost[postId];
        if (!content) return alert('Comment cannot be empty');
        try {
            await axios.post('http://localhost:3000/comments', { postId, content }, { headers: { Authorization: `Bearer ${token}` } });
            await fetchComments(postId);
            setNewCommentByPost(prev => ({ ...prev, [postId]: '' }));
        } catch (err) {
            console.error('Failed to add comment', err);
            alert('Failed to add comment');
        }
    };

    const handleUpdateComment = async (commentId, postId) => {
        const token = localStorage.getItem('token');
        if (!token) { setOpenLogin(true); return; }
        try {
            await axios.patch(`http://localhost:3000/comments/${commentId}`, { content: editingCommentContent }, { headers: { Authorization: `Bearer ${token}` } });
            await fetchComments(postId);
            setEditingCommentId(null);
            setEditingCommentContent('');
        } catch (err) {
            console.error('Failed to update comment', err);
            alert('Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId, postId) => {
        if (!window.confirm('Delete this comment?')) return;
        const token = localStorage.getItem('token');
        if (!token) { setOpenLogin(true); return; }
        try {
            await axios.delete(`http://localhost:3000/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
            await fetchComments(postId);
        } catch (err) {
            console.error('Failed to delete comment', err);
            alert('Failed to delete comment');
        }
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditTitle('');
        setEditContent('');
    };

    const handleUpdate = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setOpenLogin(true);
            return;
        }

        try {
            const response = await axios.patch(
                `http://localhost:3000/posts/${postId}`,
                { title: editTitle, content: editContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                handleCancelEdit();
                fetchPosts();
                alert(response.data.message || 'Post updated');
            } else {
                alert('Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setOpenLogin(true);
            } else {
                alert(error.response?.data?.message || 'Error updating post');
            }
        }
    };

    const handleDelete = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setOpenLogin(true);
            return;
        }

        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await axios.delete(`http://localhost:3000/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                fetchPosts();
                alert(response.data.message || 'Post deleted');
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setOpenLogin(true);
            } else {
                alert(error.response?.data?.message || 'Error deleting post');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setOpenLogin(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/posts',
                { title, content },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Create post response:', response.data); // For debugging
            if (response.data.success) {
                setTitle('');
                setContent('');
                setShowPostForm(false);
                fetchPosts();
                alert(response.data.message || 'Post created successfully!');
            } else {
                alert('Failed to create post. Please try again.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setOpenLogin(true);
            } else {
                alert(error.response?.data?.message || 'Error creating post. Please try again.');
            }
        }
    };

    return (
        <div className="max-h-screen flex overflow-y-hidden">
            <LoginPopup Open={OpenLogin} Close={() => setOpenLogin(false)} />
            <SignupPopup Open={OpenSignup} Close={() => setOpenSignup(false)} />

            <div className="w-full">
                <Header LoginOpen={() => setOpenLogin(true)} SigninOpen={() => setOpenSignup(true)} />

                <div className="h-full flex flex-col items-center px-20 overflow-y-scroll">
                    <div className="w-3/4 border-x-1 border-blue-400 pb-20">

                        <div className="mt-5 p-2 border-y-1 border-blue-500 hover:bg-gray-200">
                            <div className="flex justify-center">
                                <button 
                                    onClick={() => setShowPostForm(!showPostForm)}
                                    className="text-xl text-blue-500 font-semibold cursor-pointer hover:text-blue-700"
                                >
                                    {showPostForm ? 'Cancel' : 'Post new blog'}
                                </button>
                            </div>
                        </div>

                        {showPostForm && (
                            <div className="mt-5 p-4 border-1 border-blue-400 rounded-lg">
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Post Title"
                                        className="w-full p-2 mb-4 border rounded"
                                        required
                                    />
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write your post..."
                                        className="w-full p-2 mb-4 border rounded h-40"
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <button 
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Create Post
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {posts && posts.length > 0 ? (
                            posts.map((post) => {
                                const isOwner = currentUserId && Number(post.user_id) === Number(currentUserId);
                                return (
                                    <div key={post.id} className="mt-5 p-2 border-y-1 border-blue-400">
                                        <div className="border-b-1 border-gray-300">
                                            <h1 className="font-semibold">{post.author_username || 'Anonymous'}</h1>
                                            <p className="text-xs text-gray-500">
                                                {new Date(post.created_at).toLocaleString()}
                                            </p>
                                        </div>

                                        {editingPostId === post.id ? (
                                            <div className="border-b-1 border-gray-300 p-2">
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="w-full p-2 mb-2 border rounded"
                                                />
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full p-2 mb-2 border rounded h-40"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleUpdate(post.id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
                                                    <button onClick={handleCancelEdit} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-b-1 border-gray-300 p-2">
                                                <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
                                                <p>{post.content}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => toggleComments(post.id)} className="text-blue-500 font-semibold cursor-pointer hover:text-blue-700">Comments</button>
                                            {isOwner && editingPostId !== post.id && (
                                                <>
                                                    <button onClick={() => handleEditClick(post)} className="text-orange-500 font-semibold cursor-pointer hover:text-orange-700">Edit</button>
                                                    <button onClick={() => handleDelete(post.id)} className="text-red-500 font-semibold cursor-pointer hover:text-red-700">Delete</button>
                                                </>
                                            )}
                                        </div>

                                        {showCommentsFor[post.id] && (
                                            <div className="mt-3">
                                                <h3 className="font-semibold mb-2">Comments</h3>
                                                {(commentsByPost[post.id] || []).map(c => (
                                                    <div key={c.id} className="mb-2 border p-2 rounded">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-semibold">{c.author_username || 'Anonymous'}</p>
                                                                <p className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</p>
                                                            </div>
                                                            <div>
                                                                {Number(c.user_id) === Number(currentUserId) && (
                                                                    <>
                                                                        <button onClick={() => { setEditingCommentId(c.id); setEditingCommentContent(c.content); }} className="text-orange-500 mr-2">Edit</button>
                                                                        <button onClick={() => handleDeleteComment(c.id, post.id)} className="text-red-500">Delete</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {editingCommentId === c.id ? (
                                                            <div className="mt-2">
                                                                <textarea value={editingCommentContent} onChange={e => setEditingCommentContent(e.target.value)} className="w-full p-2 mb-2 border rounded h-20" />
                                                                <div className="flex gap-2 justify-end">
                                                                    <button onClick={() => handleUpdateComment(c.id, post.id)} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                                                                    <button onClick={() => setEditingCommentId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="mt-2">{c.content}</p>
                                                        )}
                                                    </div>
                                                ))}

                                                <div className="mt-2">
                                                    <textarea value={newCommentByPost[post.id] || ''} onChange={e => setNewCommentByPost({...newCommentByPost, [post.id]: e.target.value})} placeholder="Add a comment..." className="w-full p-2 border rounded h-20" />
                                                    <div className="flex justify-end mt-2">
                                                        <button onClick={() => handleAddComment(post.id)} className="bg-blue-500 text-white px-4 py-2 rounded">Comment</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="mt-5 p-4 text-center text-gray-500">
                                No posts found. Be the first to create a post!
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border rounded disabled:opacity-50 text-blue-500 hover:text-blue-700"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border rounded disabled:opacity-50 text-blue-500 hover:text-blue-700"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}