import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";


const ChannelDialog = ({ isOpen, onClose, channelData, mode }: any) => {

    const router = useRouter();

    const { user, login } = useUser() as {
        user: {
            id: string;
            name: string;
            image: string;
            email?: string;
            channelname?: string;
        } | null;
        loading: boolean;
        login: (userData: any) => void;
        logout: () => Promise<void>;
        handlegooglesignin: () => Promise<void>;
    };

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (channelData && mode === "edit") {
            setFormData({
                name: channelData.name || "",
                description: channelData.description || "",
            });
        } else {
            setFormData({
                name: user?.name || "",
                description: "",
            });
        }
    }, [channelData, mode, user]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!user) return;

        if (!formData.name.trim()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                channelname: formData.name,
                description: formData.description,
            };


            const response = await axiosInstance.post(
                `/user/update/${user.id}`,
                payload
            );

            // Transform _id to id for frontend consistency
            const updatedUser = response.data.result;
            if (updatedUser._id) {
                updatedUser.id = updatedUser._id;
                delete updatedUser._id;
            }

            login(updatedUser);

            router.push(`/channel/${user.id}`);

            setFormData({
                name: '',
                description: '',
            })

            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // const handleSubmit = async (e: FormEvent) => {
    //     e.preventDefault();

    //     const payload = {
    //         channelname: formData.name,
    //         description: formData.description

    //     };

    //     if (!user) return;

    //     const response = await axiosInstance.patch(
    //         `/user/update/${user._id}`,
    //         payload
    //     );

    //     login(response?.data);

    //     router.push(`/channel/${user?._id}`);

    //     if (!formData.name.trim()) return;

    //     setIsSubmitting(true);

    //     try {
    //         // simulate API call
    //         await new Promise((res) => setTimeout(res, 1200));

    //         console.log("Channel Saved:", formData);

    //         onClose();
    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl p-6">

                {/* Header */}
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        {mode === "create"
                            ? "Create Your Channel"
                            : "Edit Your Channel"}
                    </DialogTitle>

                    <p className="text-sm text-gray-500">
                        Give your channel a name and description like YouTube creator setup
                    </p>
                </DialogHeader>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">

                    {/* Channel Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Channel Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter channel name"
                            className="rounded-lg"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Channel Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell viewers about your channel..."
                            className="rounded-lg resize-none"
                        />
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex flex-row gap-3 pt-6 border-t">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 rounded-lg"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting || !formData.name}
                            className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : mode === "create"
                                    ? "Create Channel"
                                    : "Save Channel"}
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChannelDialog;