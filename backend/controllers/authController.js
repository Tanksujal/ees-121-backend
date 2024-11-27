const UserModel= require("../model/user")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, phone, address,businessCategory,businessName,businessAddress } = req.body;


        if (!name || !email || !password || !confirmpassword || !phone || !address) {
            return res.status(400).send({
                success: false,
                message: "Please fill all the fields",
            });
        }

        if (password !== confirmpassword) {
            return res.status(400).send({
                success: false,
                message: "Password and Confirm Password don't match",
            });
        }


        const userExist = await UserModel.findOne({ email: email });
        if (userExist) {
            return res.status(400).send({
                success: false,
                message: "Email already exists",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new UserModel({
            name,
            email,
            password: hashedPassword, // Store hashed password
            phone,
            address,
            businessCategory,
            businessName,
            businessAddress
        });
        await user.save();
       

        return res.status(200).send({
            success: true,
            message: "User registered successfully",
            user: user
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "An error occurred during registration",
            error: error.message,
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).send({
                success: false,
                message: "Phone and Password are required",
            });
        }
        const user = await UserModel.findOne({ phone });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Phone or Password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Phone or Password",
            });
        }
        return res.status(200).json({
            success: true,
            message: `Login successful`,
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "An error occurred during login",
            error: error.message,
        });
    }
};
const registerUserweb = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, phone, address, businessCategory, businessName, businessAddress } = req.body;

        if (!name || !email || !password || !confirmpassword || !phone || !address) {
            return res.status(400).send({ success: false, message: "Please fill all the fields" });
        }

        if (password !== confirmpassword) {
            return res.status(400).send({ success: false, message: "Password and Confirm Password don't match" });
        }

        const userExist = await UserModel.findOne({ email: email });
        if (userExist) {
            return res.status(400).send({ success: false, message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new UserModel({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            businessCategory,
            businessName,
            businessAddress
        });

        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.cookie("token", token, {
            
        });

        return res.status(200).send({ success: true, message: "User registered successfully", user: user });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred during registration",
            error: error.message,
        });
    }
};

const loginUserweb = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).send({
                success: false,
                message: "Phone and Password are required",
            });
        }
        const user = await UserModel.findOne({ phone });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Phone or Password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Phone or Password",
            });
        }
        const token = jwt.sign(
            { id: user._id, user:user},
            process.env.JWT_SECRET,
            { expiresIn: "24h" } 
        );
        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "lax",
        });
        return res.status(200).json({
            success: true,
            message: `Login successful`,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred during login",
            error: error.message,
        });
    }
};
const getAdmin = async(req,res) => {
    try {
        res.status(200).send({
            success: true,
            message: "Welcome, Admin! You have access to this route.",
            user:req.user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred during login",
            error: error.message,
        });
    }
}
const getalluser = async(req,res) => {
    try {
        const user = await UserModel.find({})
        return res.status(200).json({
            success: true,
            message: "User Fetched Succesfully.",
            user
            })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "An error occurred during userfetch",
            error: error.message,
        });
    }
}
const getUser = async(req,res) => {
    try {
        const id = req.user.id
        const user = await UserModel.findById(id)
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "User Fetched Succesfully.",
            user
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "An error occurred during userfetch",
            error: error.message,
        });
    }
}
const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token", {
            httpOnly: true, // Ensure cookie is secure and inaccessible via JavaScript
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "lax",
        });

        return res.status(200).send({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "An error occurred during logout",
            error: error.message,
        });
    }
};
module.exports = { registerUser, loginUser,registerUserweb,registerUserweb,loginUserweb,getalluser,getUser,logout,getAdmin}