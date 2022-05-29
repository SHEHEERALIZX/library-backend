const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




module.exports = {



    // Login Helper used to handle events in login activity
    // it decided who to login whether he/she is registered or not 

    LoginHelper: async(userData) => {
        try {

            const { email, password } = userData

            if (!(email && password)) {

                return { error:"All inputs required",statusCode:400}
            }

            // check user available in database

            const user = await User.findOne({
                email,
            });
            if (user) {
                if (email && (await bcrypt.compare(password, user.password))) {
                    const db_res = {
                        username: user.username,
                        uuid: user._id,
                    };
                    const token = jwt.sign(db_res, process.env.JWT_TOKEN, {
                        expiresIn: 36000,
                    });
                    return{ token: token,statusCode:200}
                } else {
                    return {error:"Password Mismatch",statusCode:401}
                }
            }
            return {error:"User not exists/Found",statusCode:404}
        } catch (err) {
            console.log(err.message);
            return {error:"interal server error",statusCode:500}
        }
    },

    doSignUp : async(userData)=>{
        try {
            const { username, email, password } = userData;
        
            if (!(email && password && username)) {
                return { error:"All inputs required",statusCode:400}
              // 404 bad request
            }
        
            const oldUser = await User.findOne({ email });
        
            if (oldUser) {
              return { error: "User already Exists", statusCode: 409 }
            }
        
            // Encrypt User password
            encryptedPassword = await bcrypt.hash(password, 10);
 
            // all validation is done then save to database
            const user = await User.create({
              username,
              email: email.toLowerCase(),
              password: encryptedPassword,
            });
        
            // user created and token generated
        
            const db_res = {
              username: user.username,
              uuid: user._id,
            };
        
            const token = jwt.sign(db_res, process.env.JWT_TOKEN, { expiresIn: 36000 });
            return{ token: token,statusCode:200}
        } catch (err) {
            console.log(err.message);
            return {error:"interal server error",statusCode:500}

          }
    }




}