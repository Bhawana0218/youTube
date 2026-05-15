"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

const RecordPage = () => {
    const { user } = useUser() as {
        user: {
            id: string;
            name?: string;
            channelname?: string;
        } | null;
    };
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [recording, setRecording] = useState(false);
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [videoTitle, setVideoTitle] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const previewRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recordedUrlRef = useRef<string | null>(null);

    useEffect(() => {
        const initCamera = async () => {
            if (!navigator.mediaDevices?.getUserMedia) {
                setPermissionError("Your browser does not support camera recording.");
                return;
            }

            try {
                const userStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                streamRef.current = userStream;
                setStream(userStream);
                if (previewRef.current) {
                    previewRef.current.srcObject = userStream;
                }
            } catch {
                setPermissionError("Please allow camera and microphone access to record video.");
            }
        };

        initCamera();

        return () => {
            if (recordedUrlRef.current) {
                URL.revokeObjectURL(recordedUrlRef.current);
                recordedUrlRef.current = null;
            }
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        };
    }, []);

    const startRecording = () => {
        if (!stream) return;

        const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp8,opus",
        });

        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            if (recordedUrlRef.current) {
                URL.revokeObjectURL(recordedUrlRef.current);
            }
            recordedUrlRef.current = url;
            setVideoBlob(blob);
            setRecordedUrl(url);
            setRecording(false);
            if (!videoTitle.trim()) {
                setVideoTitle(`Recording ${new Date().toLocaleString()}`);
            }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
        setRecordedUrl(null);
        setVideoBlob(null);
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
    };

    const downloadRecording = () => {
        if (!videoBlob) return;
        const link = document.createElement("a");
        link.href = recordedUrl || "";
        link.download = "recording.webm";
        link.click();
    };

    const clearRecording = () => {
        if (recordedUrlRef.current) {
            URL.revokeObjectURL(recordedUrlRef.current);
            recordedUrlRef.current = null;
        }
        setRecordedUrl(null);
        setVideoBlob(null);
        setVideoTitle("");
    };

    const postRecording = async () => {
        if (!videoBlob) {
            toast.error("Record a video first.");
            return;
        }
        if (!user?.id) {
            toast.error("Please sign in first.");
            return;
        }

        const title = videoTitle.trim() || "Untitled Recording";
        const filename = `${title.replace(/[^a-zA-Z0-9-_]/g, "_") || "recording"}.webm`;
        const file = new File([videoBlob], filename, { type: "video/webm" });

        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("videotitle", title);
        formdata.append("videochannel", user.channelname || user.name || "Unknown Channel");
        formdata.append("uploader", user.id);

        try {
            setIsPosting(true);
            await axiosInstance.post("/video/upload", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Recorded video posted successfully.");
            clearRecording();
        } catch {
            toast.error("Failed to post recording. Please try again.");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Record Video</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Capture video directly from your camera and save it locally.
                        </p>
                    </div>
                    <Link href="/" className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900">
                        Back to Home
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4 shadow-sm">
                        <div className="overflow-hidden rounded-3xl bg-black">
                            <video
                                ref={previewRef}
                                autoPlay
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            {!recording ? (
                                <button
                                    type="button"
                                    onClick={startRecording}
                                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                                    disabled={!stream}
                                >
                                    Start Recording
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={stopRecording}
                                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
                                >
                                    Stop Recording
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={clearRecording}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                            >
                                Clear
                            </button>
                        </div>

                        {permissionError && (
                            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {permissionError}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900">Recording Status</h2>
                            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${recording ? "bg-red-600" : "bg-emerald-600"}`}
                                />
                                {recording ? "Recording in progress..." : "Ready to record."}
                            </p>
                            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-gray-700">
                                <p className="font-semibold">Tips:</p>
                                <ul className="mt-3 space-y-2 list-disc pl-5">
                                    <li>Allow camera and microphone access.</li>
                                    <li>Use a quiet space for better audio.</li>
                                    <li>After stopping, download your video file.</li>
                                </ul>
                            </div>
                        </div>

                        {recordedUrl && (
                            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-900">Recorded Video</h2>
                                <div className="mt-4">
                                    <label htmlFor="record-title" className="mb-1 block text-sm font-medium text-gray-700">
                                        Video title
                                    </label>
                                    <input
                                        id="record-title"
                                        type="text"
                                        value={videoTitle}
                                        onChange={(e) => setVideoTitle(e.target.value)}
                                        placeholder="Enter title before posting"
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
                                    />
                                </div>
                                <video
                                    src={recordedUrl}
                                    controls
                                    className="mt-4 w-full rounded-3xl bg-black"
                                />
                                <div className="mt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={downloadRecording}
                                        className="rounded-full bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900"
                                    >
                                        Download Video
                                    </button>
                                    <button
                                        type="button"
                                        onClick={postRecording}
                                        disabled={isPosting}
                                        className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isPosting ? "Posting..." : "Post Video"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearRecording}
                                        className="rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                                    >
                                        Remove Recording
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordPage;
