'use client'

import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Comment {
    id: string;
    videoid: string;
    userid: string;
    commentbody: string;
    usercommented: string;
    commentedon: string;
}

const Comments = ({ videoId }: any) => {

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComments, setNewComments] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const user = {
        id: '1',
        name: 'Bhawana Bisht',
        image: 'https://i.pravatar.cc/150?img=5',
    };

    const fetchedComments: Comment[] = [
        {
            id: "1",
            videoid: "1",
            userid: "1",
            commentbody: "Great video! Really enjoyed watching this.",
            usercommented: "John Doe",
            commentedon: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: "2",
            videoid: "1",
            userid: "2",
            commentbody: "Thanks for sharing this amazing content!",
            usercommented: "Jane Smith",
            commentedon: new Date(Date.now() - 7200000).toISOString(),
        },
    ];

    useEffect(() => {
        const filtered = fetchedComments.filter(c => c.videoid === videoId);
        setComments(filtered);
    }, [videoId]);

    const handleSubmitComment = () => {
        if (!newComments.trim()) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            videoid: videoId,
            userid: user.id,
            commentbody: newComments,
            usercommented: user.name,
            commentedon: new Date().toISOString(),
        };

        setComments(prev => [newComment, ...prev]);
        setNewComments("");
    };


    const handleEdit = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditText(comment.commentbody);
    };


    const handleUpdateComment = () => {
        if (!editText.trim()) return;

        setComments(prev =>
            prev.map(c =>
                c.id === editingCommentId
                    ? { ...c, commentbody: editText }
                    : c
            )
        );

        setEditingCommentId(null);
        setEditText("");
    };


    const handleDelete = (id: string) => {
        setComments(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="w-full max-w-3xl mt-6 text-black">

            {/* COUNT */}
            <h2 className="text-lg font-semibold mb-6">
                {comments.length} Comments
            </h2>

            {/* ADD COMMENT */}
            <div className="flex gap-3 mb-8">
                <img
                    src={user.image}
                    className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComments}
                        onChange={(e) => setNewComments(e.target.value)}
                        className="w-full border-b border-gray-300 focus:border-black outline-none text-sm py-2 placeholder:text-gray-500"
                    />

                    {newComments.trim() && (
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => setNewComments("")}
                                className="text-sm bg-gray-200 px-4 py-1.5 rounded-full hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmitComment}
                                className="text-sm px-4 py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                            >
                                Comment
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* COMMENTS LIST */}
            <div className="flex flex-col gap-6">
                {comments.map((c) => (
                    <div key={c.id} className="flex gap-3 group">

                        {/* AVATAR */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0">
                            {c.usercommented[0]}
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col w-full">

                            {/* NAME + TIME */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">
                                    {c.usercommented}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(c.commentedon).toLocaleDateString()}
                                </span>
                            </div>

                            {/* EDIT MODE */}
                            {editingCommentId === c.id ? (
                                <div className="mt-2">
                                    <input
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full border-b border-gray-400 focus:border-black outline-none text-sm py-1"
                                    />

                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => setEditingCommentId(null)}
                                            className="text-xs px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateComment}
                                            className="text-xs px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* COMMENT TEXT */}
                                    <p className="text-sm text-gray-800 mt-1 leading-relaxed">
                                        {c.commentbody}
                                    </p>

                                    {/* ACTIONS */}
                                    <div className="flex items-center gap-2 mt-2 opacity-70 group-hover:opacity-100 transition duration-200">

                                        {/* LIKE */}
                                        <button className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span className="text-xs font-medium">Like</span>
                                        </button>

                                        {/* DISLIKE */}
                                        <button className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition">
                                            <ThumbsDown className="w-4 h-4" />
                                            <span className="text-xs font-medium">Dislike</span>
                                        </button>

                                        {/* EDIT */}
                                        <button
                                            onClick={() => handleEdit(c)}
                                            className="px-2 py-1 text-xs rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition"
                                        >
                                            Edit
                                        </button>

                                        {/* DELETE */}
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="px-2 py-1 text-xs rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                                        >
                                            Delete
                                        </button>

                                        {/* REPLY */}
                                        <button className="px-2 py-1 text-xs rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition">
                                            Reply
                                        </button>

                                    </div>


                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;