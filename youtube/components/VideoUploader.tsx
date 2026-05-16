import { Check, FileVideo, Upload, X } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import axiosInstance from "@/lib/axiosinstance";

const VideoUploader = ({ channelId, channelName }: any) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoTitle, setVideoTitle] = useState("");
    const [uploadComplete, setUploadComplete] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadInterval = useRef<NodeJS.Timeout | null>(null);

    const handlefilechange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("video/")) {
            toast.error("Please upload a valid video file.");
            return;
        }

        if (file.size > 200 * 1024 * 1024) {
            toast.error("File size exceeds 200MB limit.");
            return;
        }

        setVideoFile(file);
        setVideoTitle(file.name);
    };

    const resetForm = () => {
        setVideoFile(null);
        setVideoTitle("");
        setIsUploading(false);
        setUploadProgress(0);
        setUploadComplete(false);

        if (uploadInterval.current) {
            clearInterval(uploadInterval.current);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const cancelUpload = () => {
        if (isUploading) {
            toast.error("Upload cancelled");
            resetForm();
        }
    };

    const startUpload = () => {
        if (!videoFile) {
            toast.error("Please select a video first");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setUploadComplete(false);

        uploadInterval.current = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    if (uploadInterval.current) clearInterval(uploadInterval.current);
                    setIsUploading(false);
                    setUploadComplete(true);
                    toast.success("Upload complete!");
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const handleUpload = async () => {
        if (!videoFile || !videoTitle.trim()) {
            toast.error("Plesae Provide a video or Title.");
            return;
        }
        const formdata = new FormData();
        formdata.append("file", videoFile);
        formdata.append("videotitle", videoTitle);
        formdata.append("videochannel", channelName || "Unknown Channel");
        formdata.append("uploader", channelId);
        try {
            setIsUploading(true);
            setUploadProgress(0);
            const res = await axiosInstance.post("/video/upload", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (ProgressEvent: any) => {
                    const progress = Math.round(
                        (ProgressEvent.loaded * 100) /
                        (ProgressEvent.total || 1)
                    );

                    setUploadProgress(progress);
                }
            });
            toast.success(res.data?.message || "Video uploaded successfully!");
            resetForm();
        } catch (error) {
            setIsUploading(false);
            toast.error("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border">
            <h2 className="text-2xl font-bold mb-6">Upload a Video</h2>

            {!videoFile ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50 transition"
                >
                    <Upload className="mx-auto mb-3 text-gray-500" />
                    <p className="font-medium">Drag & Drop video here</p>
                    <p className="text-sm text-gray-500">or click to select</p>
                    <p className="text-xs text-gray-400 mt-2">
                        MP4, WebM, MOV or AVI (max 200MB)
                    </p>

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="video/*"
                        className="hidden"
                        onChange={handlefilechange}
                    />
                </div>
            ) : (
                <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <FileVideo className="text-blue-500" />
                            <div>
                                <p className="font-medium">{videoFile.name}</p>
                                <p className="text-sm text-gray-500">
                                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                        </div>

                        {!isUploading && (
                            <Button variant="destructive" onClick={resetForm}>
                                <X className="w-4 h-4" />
                            </Button>
                        )}

                        {uploadComplete && (
                            <div className="flex items-center gap-2 text-green-600">
                                <Check className="w-4 h-4" />
                                <span className="text-sm">Done</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder="Enter video title"
                        />
                    </div>
                    {isUploading && (
                        <div className="space-y-2 h-8">
                            <div className="flex justify-between text-sm">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} />
                        </div>
                    )}

                    <div className="flex gap-3">
                        {!uploadComplete && (
                            <>
                                <Button variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>

                                <Button onClick={handleUpload} disabled={isUploading}>
                                    {isUploading ? "Uploading..." : "Upload"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoUploader;