'use client';

import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

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

interface ChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelData?: {
    channelname?: string;
    description?: string;
  };
  mode: "create" | "edit";
}

const ChannelDialog = ({
  open,
  onOpenChange,
  channelData,
  mode,
}: ChannelDialogProps) => {

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
        name: channelData.channelname || "",
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
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;
    const userId = user.id || (user as any)._id;
    if (!userId) {
      console.error("Create channel failed: missing user id");
      return;
    }
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        channelname: formData.name.trim(),
        description: formData.description.trim(),
      };

      const response = await axiosInstance.post(
        `/user/update/${userId}`,
        payload
      );

      const updatedUser = response.data.result;
      if (updatedUser?._id) {
        updatedUser.id = updatedUser._id;
        delete updatedUser._id;
      }

      login(updatedUser);

      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
      });

      router.push(`/channel/${updatedUser.id}`);

    } catch (error) {
      console.log("Channel Creation Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full rounded-2xl p-6 overflow-hidden">
        <DialogHeader className="space-y-2">
          
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {mode === "create"
              ? "Create Your Channel"
              : "Edit Your Channel"}
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Give your channel a name and description.
          </p>

        </DialogHeader>

        <form
          id="channel-form"
          onSubmit={handleSubmit}
          className="space-y-5 mt-4 w-full"
        >
          <div className="space-y-2">
            
            <Label htmlFor="name">
              Channel Name
            </Label>

            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter channel name"
              className="rounded-lg w-full"
              required
            />

          </div>
          <div className="space-y-2">
            
            <Label htmlFor="description">
              Channel Description
            </Label>

            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell viewers about your channel..."
              className="rounded-lg resize-none w-full break-all overflow-hidden"
            />
          </div>
          <DialogFooter className="flex flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="channel-form"
              disabled={
                isSubmitting ||
                !formData.name.trim()
              }
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