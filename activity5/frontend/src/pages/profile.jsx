import { useEffect, useState } from "react";
import { Header } from "../components/header";
import * as jwtModule from 'jwt-decode';
const jwtDecode = jwtModule?.default ?? jwtModule?.jwtDecode ?? jwtModule;
import axios from 'axios';

export function Profile() {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [commentsByPost, setCommentsByPost] = useState({});
    const [newCommentByPost, setNewCommentByPost] = useState({});
    const [editingPostIdLocal, setEditingPostIdLocal] = useState(null);
    const [editPostTitle, setEditPostTitle] = useState('');
    const [editPostContent, setEditPostContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [showChangePw, setShowChangePw] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const id = Number(decoded.sub ?? decoded.id);
                setUserId(id);
                setUsername(decoded.username ?? '');
            } catch (err) {
                console.error('Failed to decode token', err);
            }
        }

        fetchUserPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUserPosts = async () => {
        setLoading(true);
        try {
            // request a reasonably large page size to get all posts
            const res = await axios.get('http://localhost:3000/posts?page=1&limit=1000');
            const posts = res.data?.data?.posts ?? [];
            const token = localStorage.getItem('token');
            let id = null;
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    id = Number(decoded.sub ?? decoded.id);
                    setUserId(id);
                    setUsername(decoded.username ?? '');
                } catch {}
            }

            if (id) {
                setUserPosts(posts.filter(p => Number(p.user_id) === Number(id)));
                // fetch comments for each post
                const commentsMap = {};
                for (const p of posts.filter(p => Number(p.user_id) === Number(id))) {
                    try {
                        const resp = await axios.get(`http://localhost:3000/comments/post/${p.id}`);
                        commentsMap[p.id] = resp.data?.data ?? [];
                    } catch (err) {
                        commentsMap[p.id] = [];
                    }
                }
                setCommentsByPost(commentsMap);
            } else {
                // if not logged in, show nothing and prompt to login
                setUserPosts([]);
            }
        } catch (err) {
            console.error('Failed to fetch posts', err);
            setUserPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) return alert('Please fill in both fields');
        if (newPassword !== confirmPassword) return alert('New passwords do not match');

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to change your password');
            return;
        }

        try {
            const res = await axios.patch('http://localhost:3000/auth/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data?.success) {
                alert(res.data.message || 'Password changed');
                setShowChangePw(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                alert(res.data?.message || 'Failed to change password');
            }
        } catch (err) {
            console.error('Change password error', err);
            alert(err.response?.data?.message || 'Error changing password');
        }
    };

    return (
        <div className="max-h-screen flex overflow-y-hidden">

            <div className="w-full">
                
                <Header LoginOpen={() => {}} SigninOpen={() => {}} />

                <div className="h-screen flex flex-col items-center px-20 overflow-y-scroll">
                    
                    <div className="w-3/4 border-x-1 border-blue-400 pb-20">

                        <div className=" mt-5 p-2 border-y-1 border-gray-300">

                            <div className="flex justify-around items-center">
                                <p className="font-semibold">Username: <span className="font-bold">{username || 'Guest'}</span></p>
                                <button onClick={() => setShowChangePw(!showChangePw)} className="bg-blue-500 text-white font-semibold cursor-pointer p-2 rounded hover:bg-blue-600">Change Password</button>
                            </div>

                        </div>

                        {showChangePw && (
                            <div className="mt-4 p-4 border rounded bg-gray-50">
                                <form onSubmit={handleChangePassword}>
                                    <input type="password" placeholder="Current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
                                    <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
                                    <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
                                    <div className="flex justify-end gap-2">
                                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                                        <button type="button" onClick={() => setShowChangePw(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className=" mt-5 p-2">

                            <div className="flex justify-center">
                                <button className="text-lg font-bold cursor-pointer">Your blog posts</button>
                            </div>

                        </div>

                        <div className=" mt-5 p-2 border-y-1 border-blue-500 hover:bg-gray-200">

                            <div className="flex justify-center">
                                <button className="text-xl text-blue-500 font-semibold cursor-pointer hover:text-blue-700">Post new blog</button>
                            </div>

                        </div>

                        <div className=" mt-5 p-2 border-y-1 border-blue-400">

                            {loading ? (
                                <p className="p-4 text-center">Loading your posts...</p>
                            ) : userPosts.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">No posts found for your account.</div>
                            ) : (
                                userPosts.map(post => (
                                    <div key={post.id} className="border-b-1 border-gray-300 p-4 mb-4">
                                        <div className="border-b-1 border-gray-300">
                                            <h1 className="font-semibold">{username}</h1>
                                            <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="p-2">
                                            {editingPostIdLocal === post.id ? (
                                                <>
                                                    <input value={editPostTitle} onChange={e => setEditPostTitle(e.target.value)} className="w-full p-2 mb-2 border rounded" />
                                                    <textarea value={editPostContent} onChange={e => setEditPostContent(e.target.value)} className="w-full p-2 mb-2 border rounded h-28" />
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={async () => {
                                                            const token = localStorage.getItem('token');
                                                            try {
                                                                await axios.patch(`http://localhost:3000/posts/${post.id}`, { title: editPostTitle, content: editPostContent }, { headers: { Authorization: `Bearer ${token}` } });
                                                                await fetchUserPosts();
                                                                setEditingPostIdLocal(null);
                                                            } catch (err) { console.error(err); alert('Failed to update post'); }
                                                        }} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                                                        <button onClick={() => setEditingPostIdLocal(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
                                                    <p>{post.content}</p>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex gap-2 justify-end mb-2">
                                            <button onClick={() => {
                                                setEditingPostIdLocal(post.id);
                                                setEditPostTitle(post.title);
                                                setEditPostContent(post.content);
                                            }} className="text-orange-500 font-semibold cursor-pointer hover:text-orange-700">Edit</button>
                                            <button onClick={async () => {
                                                if (!window.confirm('Delete this post?')) return;
                                                const token = localStorage.getItem('token');
                                                try {
                                                    await axios.delete(`http://localhost:3000/posts/${post.id}`, { headers: { Authorization: `Bearer ${token}` } });
                                                    await fetchUserPosts();
                                                } catch (err) { console.error(err); alert('Failed to delete post'); }
                                            }} className="text-red-500 font-semibold cursor-pointer hover:text-red-700">Delete</button>
                                        </div>

                                        {/* Comments section */}
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
                                                            {Number(c.user_id) === Number(userId) && (
                                                                <>
                                                                    <button onClick={() => { setEditingCommentId(c.id); setEditingCommentContent(c.content); }} className="text-orange-500 mr-2">Edit</button>
                                                                    <button onClick={async () => {
                                                                        if (!window.confirm('Delete this comment?')) return;
                                                                        const token = localStorage.getItem('token');
                                                                        try {
                                                                            await axios.delete(`http://localhost:3000/comments/${c.id}`, { headers: { Authorization: `Bearer ${token}` } });
                                                                            const resp = await axios.get(`http://localhost:3000/comments/post/${post.id}`);
                                                                            setCommentsByPost({...commentsByPost, [post.id]: resp.data?.data ?? []});
                                                                        } catch (err) { console.error(err); alert('Failed to delete comment'); }
                                                                    }} className="text-red-500">Delete</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {editingCommentId === c.id ? (
                                                        <div className="mt-2">
                                                            <textarea value={editingCommentContent} onChange={e => setEditingCommentContent(e.target.value)} className="w-full p-2 mb-2 border rounded h-20" />
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={async () => {
                                                                    const token = localStorage.getItem('token');
                                                                    try {
                                                                        await axios.patch(`http://localhost:3000/comments/${c.id}`, { content: editingCommentContent }, { headers: { Authorization: `Bearer ${token}` } });
                                                                        const resp = await axios.get(`http://localhost:3000/comments/post/${post.id}`);
                                                                        setCommentsByPost({...commentsByPost, [post.id]: resp.data?.data ?? []});
                                                                        setEditingCommentId(null);
                                                                        setEditingCommentContent('');
                                                                    } catch (err) { console.error(err); alert('Failed to update comment'); }
                                                                }} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
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
                                                    <button onClick={async () => {
                                                        const token = localStorage.getItem('token');
                                                        if (!token) { alert('Please login to comment'); return; }
                                                        const content = newCommentByPost[post.id];
                                                        if (!content) return alert('Comment cannot be empty');
                                                        try {
                                                            await axios.post('http://localhost:3000/comments', { postId: post.id, content }, { headers: { Authorization: `Bearer ${token}` } });
                                                            const resp = await axios.get(`http://localhost:3000/comments/post/${post.id}`);
                                                            setCommentsByPost({...commentsByPost, [post.id]: resp.data?.data ?? []});
                                                            setNewCommentByPost({...newCommentByPost, [post.id]: ''});
                                                        } catch (err) { console.error(err); alert('Failed to add comment'); }
                                                    }} className="bg-blue-500 text-white px-4 py-2 rounded">Comment</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}