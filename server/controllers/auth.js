import mongoose from 'mongoose';
import User from '../models/Auth.js';

export const login = async (req, res) => {
    const { email, name, image } = req.body;
    try {
        const existinguser = await User.findOne({ email });
        if (!existinguser) {
            try {
                const newUser = await User.create({ email, name, image })
                res.status(200).json({ result: newUser });
            } catch (error) {
                res.status(500).json({ message: "Error creating user", error });
                return;
            }
        } else {
            res.status(200).json({ result: existinguser });
        }
    } catch (error) {
        res.status(500).json({ message: "Error finding user", error });
        return;
    }
}

export const updateprofile = async (req, res) => {
    const { id: id } = req.params;
    const { channelname, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(500).json({ message: "User Unavailable" });
    }
    try {
        const updatedata = await User.findByIdAndUpdate(
            id, {
            $set: {
                channelname: channelname,
                description: description
            },

        },
            {
                new: true
            }

        )
        res.status(200).json({ result: updatedata });

    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }

}