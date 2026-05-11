'use client';

import { useUser } from "@/lib/AuthContext";
import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commnetbody: string;
  usercommented: string;
  commentedon: string;
}

const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComments, setNewComments] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser() as {
    user: {
      _id: string;
      name: string;
      image: string;
      email?: string;
      channelname: string;
    } | null;
    loading: boolean;
    logout: () => Promise<void>;
    handlegooglesignin: () => Promise<void>;
  };

  // FETCH COMMENTS
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/comment/video/${videoId}`
      );

      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  // POST COMMENT
  const handleSubmitComment = async () => {
    if (!newComments.trim() || !user) return;

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/comment/post", {
        videoid: videoId,
        userid: user._id,
        commnetbody: newComments,
        usercommented: user.channelname || user.name,
        commentedon: new Date(),
      });

      setNewComments("");
      fetchComments();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE COMMENT
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/comment/delete/${id}`
      );

      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-3xl mt-6 text-black">
      {/* COUNT */}
      <h2 className="text-lg font-semibold mb-6">
        {comments.length} Comments
      </h2>

      {/* ADD COMMENT */}
      {user && (
        <div className="flex gap-3 mb-8">
          <img
            src={user.image}
            alt="user"
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
                  disabled={loading}
                  onClick={handleSubmitComment}
                  className="text-sm px-4 py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  {loading ? "Posting..." : "Comment"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMMENTS LIST */}
      <div className="flex flex-col gap-6">
        {comments.map((c) => (
          <div key={c._id} className="flex gap-3 group">
            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0">
              {c.usercommented?.[0]}
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

              {/* COMMENT TEXT */}
              <p className="text-sm text-gray-800 mt-1 leading-relaxed">
                {c.commnetbody}
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

                {/* DELETE */}
                {user?._id === c.userid && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-2 py-1 text-xs rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;