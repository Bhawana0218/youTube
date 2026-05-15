'use client';

import { useUser } from '@/lib/AuthContext';
import axiosInstance from '@/lib/axiosinstance';
import { MoreVertical, Pencil, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type RawComment = {
  _id?: string;
  id?: string;
  videoid?: string;
  videoId?: string;
  userid?: string | { _id?: string; id?: string; channelname?: string; profilepicture?: string; image?: string };
  userId?: string;
  commentbody?: string;
  commnetbody?: string;
  usercommented?: string;
  userCommented?: string;
  commentedon?: string;
  commentedOn?: string;
  userImage?: string;
  likes?: number;
};

type NormalizedComment = {
  id: string;
  videoId: string;
  userId: string;
  body: string;
  authorName: string;
  authorImage: string;
  commentedOn: string;
  likes: number;
};

type UserType = {
  id: string;
  name: string;
  image: string;
  channelname?: string;
};

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const getRelativeTime = (value: string) => {
  if (!value) return 'recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';

  const diffMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const mins = Math.round(diffMs / (1000 * 60));
  if (Math.abs(mins) < 60) return rtf.format(mins, 'minute');

  const hrs = Math.round(mins / 60);
  if (Math.abs(hrs) < 24) return rtf.format(hrs, 'hour');

  const days = Math.round(hrs / 24);
  if (Math.abs(days) < 30) return rtf.format(days, 'day');

  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return rtf.format(months, 'month');

  const years = Math.round(months / 12);
  return rtf.format(years, 'year');
};

const normalizeComment = (item: RawComment, index: number): NormalizedComment | null => {
  const body = (item.commentbody ?? item.commnetbody ?? '').trim();
  if (!body) return null;

  const userRef = typeof item.userid === 'object' && item.userid !== null ? item.userid : null;
  const id = item._id || item.id || `${item.userid || 'user'}-${index}`;
  const userId = (typeof item.userid === 'string' ? item.userid : userRef?._id || userRef?.id) || item.userId || '';
  const authorName = item.usercommented || item.userCommented || userRef?.channelname || 'Unknown user';
  const commentedOn = item.commentedon || item.commentedOn || new Date().toISOString();

  return {
    id,
    videoId: item.videoid || item.videoId || '',
    userId,
    body,
    authorName,
    authorImage: item.userImage || userRef?.profilepicture || userRef?.image || DEFAULT_AVATAR,
    commentedOn,
    likes: Number(item.likes || 0),
  };
};

const extractComments = (payload: unknown): RawComment[] => {
  if (Array.isArray(payload)) return payload as RawComment[];
  if (!payload || typeof payload !== 'object') return [];

  const data = payload as {
    comments?: unknown;
    result?: unknown;
    data?: unknown;
  };

  if (Array.isArray(data.comments)) return data.comments as RawComment[];
  if (Array.isArray(data.result)) return data.result as RawComment[];
  if (Array.isArray(data.data)) return data.data as RawComment[];

  return [];
};

const Comments = ({ videoId }: { videoId?: string }) => {
  const { user } = useUser() as { user: UserType | null };

  const [comments, setComments] = useState<NormalizedComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editingText, setEditingText] = useState('');

  const viewerName = user?.channelname || user?.name || 'You';
  const viewerAvatar = user?.image || DEFAULT_AVATAR;

  const commentCountLabel = useMemo(() => `${comments.length.toLocaleString()} Comments`, [comments.length]);

  const fetchComments = async () => {
    if (!videoId) {
      setComments([]);
      return;
    }

    try {
      setFetching(true);
      const response = await axiosInstance.get(`/comment/video/${videoId}`);
      const list = extractComments(response.data)
        .map((item, index) => normalizeComment(item, index))
        .filter((item): item is NormalizedComment => Boolean(item))
        .sort((a, b) => new Date(b.commentedOn).getTime() - new Date(a.commentedOn).getTime());

      setComments(list);
    } catch (error) {
      console.log('Fetch comment error:', error);
      setComments([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleSubmit = async () => {
    const body = newComment.trim();
    if (!body || !videoId) return;

    if (!user) {
      alert('Please login to comment');
      return;
    }

    const localDraft: NormalizedComment = {
      id: `temp-${Date.now()}`,
      videoId,
      userId: user.id,
      body,
      authorName: viewerName,
      authorImage: viewerAvatar,
      commentedOn: new Date().toISOString(),
      likes: 0,
    };

    setComments((prev) => [localDraft, ...prev]);
    setNewComment('');

    try {
      setSubmitting(true);
      const payload = {
        videoid: videoId,
        userid: user.id,
        commentbody: body,
        commnetbody: body,
        usercommented: viewerName,
        commentedon: new Date().toISOString(),
      };

      await axiosInstance.post('/comment/post', payload);
      await fetchComments();
    } catch (error) {
      console.log('Post comment error:', error);
      setComments((prev) => prev.filter((item) => item.id !== localDraft.id));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const previous = comments;
    setComments((prev) => prev.filter((item) => item.id !== id));
    setActiveMenu('');

    try {
      await axiosInstance.delete(`/comment/delete/${id}`);
    } catch (error) {
      console.log('Delete comment error:', error);
      setComments(previous);
    }
  };

  const startEdit = (id: string, body: string) => {
    setEditingId(id);
    setEditingText(body);
    setActiveMenu('');
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditingText('');
  };

  const saveEdit = async (id: string) => {
    const body = editingText.trim();
    if (!body) return;

    const previous = comments;
    setComments((prev) => prev.map((item) => (item.id === id ? { ...item, body } : item)));

    try {
      await axiosInstance.put(`/comment/update/${id}`, { commentbody: body });
      cancelEdit();
    } catch (error) {
      console.log('Edit comment error:', error);
      setComments(previous);
    }
  };

  return (
    <section className="mt-6 w-full text-zinc-900 dark:text-zinc-100">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{commentCountLabel}</h2>
        <button
          type="button"
          className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Top comments
        </button>
      </div>

      <div className="mb-8 flex gap-3">
        <img src={viewerAvatar} alt="Your profile" className="h-10 w-10 rounded-full object-cover" />
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={user ? 'Add a comment...' : 'Sign in to add a comment...'}
            className="w-full border-b border-zinc-300 bg-transparent px-1 pb-2 text-sm outline-none transition focus:border-zinc-700 dark:border-zinc-700 dark:focus:border-zinc-200"
            disabled={!videoId}
          />

          {newComment.trim() && (
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewComment('')}
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {submitting ? 'Commenting...' : 'Comment'}
              </button>
            </div>
          )}
        </div>
      </div>

      {fetching && <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading comments...</p>}

      {!fetching && comments.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No comments yet. Be the first to comment.</p>
      )}

      {!fetching && comments.length > 0 && (
        <div className="space-y-6">
          {comments.map((comment) => {
            const isOwner = Boolean(user?.id) && user?.id === comment.userId;
            const menuOpen = activeMenu === comment.id;
            const isEditing = editingId === comment.id;

            return (
              <article key={comment.id} className="group flex gap-3">
                <img src={comment.authorImage} alt={comment.authorName} className="h-10 w-10 rounded-full object-cover" />

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{comment.authorName}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{getRelativeTime(comment.commentedOn)}</span>
                      </div>

                      {!isEditing && <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-900 dark:text-zinc-100">{comment.body}</p>}

                      {isEditing && (
                        <div className="mt-2">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-none border-0 border-b border-zinc-300 bg-transparent px-0 py-1 text-sm outline-none focus:border-zinc-700 dark:border-zinc-700 dark:focus:border-zinc-300"
                          />
                          <div className="mt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEdit(comment.id)}
                              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {isOwner && !isEditing && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenu(menuOpen ? '' : comment.id)}
                          className="rounded-full p-2 text-zinc-600 opacity-0 transition hover:bg-zinc-100 hover:text-zinc-900 group-hover:opacity-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {menuOpen && (
                          <div className="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                            <button
                              type="button"
                              onClick={() => startEdit(comment.id, comment.body)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(comment.id)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="mt-2 flex items-center gap-1">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        <ThumbsUp size={14} />
                        <span>{comment.likes}</span>
                      </button>
                      <button
                        type="button"
                        className="rounded-full p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                        <ThumbsDown size={14} />
                      </button>
                      <button
                        type="button"
                        className="rounded-full px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Comments;
