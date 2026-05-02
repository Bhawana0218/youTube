import User from '../models/Auth.js';

export const login = async (req, res) =>{
    const {email, name, image} = req.body;
    try{
        const existinguser = await User.findOne({ email });
        if(!existinguser){
            try{
                const newUser = await User.create({email, name, image})
                res.status(200).json({result: newUser});
            } catch (error) {
                res.status(500).json({ message: "Error creating user", error });
                return;
            }
        }else {
            res.status(200).json({result: existinguser});
        }
    } catch (error) {
        res.status(500).json({ message: "Error finding user", error });
        return;
    }
}