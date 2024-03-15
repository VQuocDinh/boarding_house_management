const pool = require("../app/configDB");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require("fs");
const { nextTick } = require("process");

class loginController{

    async RegisterUser(req,res){
        const {name,phone_number,password,email,address} = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
            const hashed =  await bcrypt.hash(password,salt);
            let stringSQL = "INSERT INTO user (fullname,phone_number,password) VALUES " + `("${name}","${phone_number}","${hashed}")`;
            if(email || address){
                stringSQL = "INSERT INTO user (fullname,phone_number,password,email,address) VALUES " + `("${name}","${phone_number}","${hashed}","${email}","${address}")`;
            }
            const promisePool = pool.promise();
        try {
            const [rows,fields] = await promisePool.query(stringSQL);
            return res.status(201).json({
                data : rows.insertId,
                message : "Succesfully to register !!"
            })
        } catch (error) {
            if(error.code == 'ER_DUP_ENTRY')
            {
                return res.status(400).json({
                    message : "Số điện thoại đã được đăng kí trước !!!"
                })
            }
            return res.status(400).json({
                message : "Đăng ký thất bại !"
            })
        }
    }


    async LoginUser(req,res){

        const {phone_number,password} = req.body;
        const promisePool = pool.promise();
        try {
            const [rowsUser,fieldsUser] = await promisePool.query("select * from user where phone_number = ?",[phone_number]);
            if(rowsUser.length !==1){
                return res.status(400).json({
                    message : "Số điện thoại hoặc mật khẩu không chính xác !!!"
                })
            }
            const validPassword = await bcrypt.compare(password , rowsUser[0].password)
            if(!validPassword){
                return res.status(400).json({
                    message : "Số điện thoại hoặc mật khẩu không chính xác !!"
                })
            }
            if(validPassword){
                if(rowsUser[0].isActive == 0){
                    return res.status(400).json({
                        message : "Tài khoản của bạn đã bị khóa !!"
                    })
                }
                const [area,Areafields] = await promisePool.execute("SELECT idHouse FROM `area` WHERE idUser = ?",[rowsUser[0].id])
                let ArrayArea = [];
                area.forEach(item => {
                    ArrayArea.push(item.idHouse)
                })
                const stringArea = ArrayArea.join(",")
                const accessToken = jwt.sign(
                    {
                        id : rowsUser[0].id,
                        user : rowsUser[0].phone_number,
                        isAdmin : rowsUser[0].role_id,
                        area : stringArea 
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn : '3600s'
                    }
                )
                const refreshToken = jwt.sign(
                    {
                        id : rowsUser[0].id,
                        user : rowsUser[0].phone_number,
                        isAdmin : rowsUser[0].role_id
                    },
                    process.env.REFRESH_KEY
                )
                const {password, ...rest} = rowsUser[0];
                const data = {...rest}
                const [rowsDelete,fieldsDelete] = await promisePool.query('DELETE FROM `tokens` WHERE user_id = ?',[rowsUser[0].id])
                const [rows,fields] = await promisePool.query("INSERT INTO tokens (user_id,token) VALUES (?,?)",[rowsUser[0].id,refreshToken])
                return res.status(200).json({
                    data,
                    accessToken,
                    refreshToken
                })
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                code : 400,
                message : "false to login"
            })
        }
    }

    async LoginUserOauth2(req,res){
        console.log("Dữ liệu sau khi đi qua hàm passport.deserializeUser ta có req.user : ",req.user);
        const promisePool = pool.promise();
        if(!req.isAuthenticated()){
            return res.status(400).json({
                message : "Không tồn tại người dùng này !!!"
            })
        }
        let stringSql;
        if(req.user.provider == "google")
        {
            stringSql = `select * from user where googleId = ?`
        }
        else if(req.user.provider == "github")
        {
            stringSql = `select * from user where githubId = ?`
        }
        try {
            const [rowsUser,fieldsUser] = await promisePool.query(stringSql,[req.user.id]);
                const [area,Areafields] = await promisePool.execute("SELECT idHouse FROM `area` WHERE idUser = ?",[rowsUser[0].id])
                let ArrayArea = [];
                area.forEach(item => {
                    ArrayArea.push(item.idHouse)
                })
                const stringArea = ArrayArea.join(",")
                const accessToken = jwt.sign(
                    {
                        id : rowsUser[0].id,
                        user : rowsUser[0].phone_number,
                        isAdmin : rowsUser[0].role_id,
                        area : stringArea 
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn : '30s'
                    }
                )
                const refreshToken = jwt.sign(
                    {
                        id : rowsUser[0].id,
                        user : rowsUser[0].phone_number,
                        isAdmin : rowsUser[0].role_id
                    },
                    process.env.REFRESH_KEY
                )
                const {password, ...rest} = rowsUser[0];
                const data = {...rest}
                const [rowsDelete,fieldsDelete] = await promisePool.query('DELETE FROM `tokens` WHERE user_id = ?',[rowsUser[0].id])
                const [rows,fields] = await promisePool.query("INSERT INTO tokens (user_id,token) VALUES (?,?)",[rowsUser[0].id,refreshToken])
                console.log("Trả dữ liệu về cho user");
                return res.status(200).json({
                    data,
                    accessToken,
                    refreshToken
                })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                code : 400,
                message : "false to login"
            })
        }
    }

    async refreshToken(req,res){
        const refreshToken = req.cookies.refreshToken;
        const poolPromise = pool.promise();
        if(!refreshToken)
        {
            return res.status(401).json({
                message : "You did't login"
            })
        }
        try {
            const [records,fields] = await poolPromise.execute("SELECT * FROM `user` LEFT join `tokens` on user.id = tokens.user_id where token = ?",[refreshToken])
            if(records.length == 0)
            {
                return res.status(401).json({
                    message : "Your refresh token is not valid !!!!"
                })
            }
            const [area,Areafields] = await poolPromise.execute("SELECT idHouse FROM `area` WHERE idUser = ?",[records[0].id])
            let ArrayArea = [];
                area.forEach(item => {
                    ArrayArea.push(item.idHouse)
                })
            const stringArea = ArrayArea.join(",")
            const NewaccessToken = jwt.sign(
                {
                    id : records[0].id,
                    user : records[0].phone_number,
                    isAdmin : records[0].role_id,
                    area : stringArea
                },
                process.env.SECRET_KEY,
                {
                    expiresIn : '3600s'
                }
            )
            const NewrefreshToken = jwt.sign(
                {
                    id : records[0].id,
                    user : records[0].phone_number,
                    isAdmin : records[0].role_id
                },
                process.env.REFRESH_KEY
            )
            const [recordsReToken,fieldsReToken] = await poolPromise.execute("update tokens set token = ? where token = ?",[NewrefreshToken,refreshToken])
            return res.status(200).json({
                records,
                accessToken : NewaccessToken,
                refreshToken : NewrefreshToken
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Error to refresh token"
            })
        }
    }

    logOut(req,res){
        const idUser = req.userNormal.id;
        const refreshToken = req.cookies.refreshToken;
        pool.execute("SELECT * FROM tokens where user_id = ? and token = ?",[idUser,refreshToken],(err,records,fields) => {
            if(err){
                return res.status(401).json({
                    message : "Đăng xuất thất bại !"
                })
            }

            if(records.length !== 1)
            {
                return res.status(401).json({
                    message : "Your refreshToken not valid!"
                })
            }

            pool.execute("DELETE FROM tokens WHERE user_id = ? and token = ?",[idUser,refreshToken],(err) => {
                if(err){
                    return res.status(401).json({
                        message : "Đăng xuất thất bại !"
                    })
                }
                return res.status(200).json({
                    message : "Đăng xuất thành công !"
                })
            })
        })
    }

    UpdateUser(req,res){ 
        const {id,email,fullname,address,phone_number} = req.body;
        console.log(id,email,fullname,address,phone_number);
        console.log(req.body);
        pool.execute("update user set email = ?, fullname = ?, address= ?, phone_number = ? where id = ?",[email,fullname,address,phone_number,id],(err,records,fields) => {
            if(err){
                return res.status(401).json({
                    message : "Cập nhật thông tin thất bại !"
                })
            }
           
            pool.execute("select * from user where id = ?",[id],(err,records) => {
                if(err){
                    return res.status(401).json({
                        message : "Cập nhật thông tin thất bại !"
                    })
                }
                const {password, ...rest} = records[0];
                const data = {...rest}
                return res.status(200).json({
                    code : 200,
                    data : data
                })
            })
        })
    }

    ChangePassword(req,res){
        const{id,password,new_password} = req.body;
        console.log(id,password,new_password);
        pool.execute("select password from user where id = ?",[id],async (err,records) => {
            if(err)
            {
                return res.status(401).json({
                    message : "Thay đổi mật khẩu thất bại !"
                })
            }
            const validPassword = await bcrypt.compare(password , records[0].password)
            if(!validPassword){
                return res.status(401).json({
                    message : "Mật khẩu cũ không chính xác !"
                })
            }
            const salt = await bcrypt.genSalt(saltRounds);
            const hashed =  await bcrypt.hash(new_password,salt);
            pool.execute("update user set password = ? where id = ?",[hashed,id],(err,records) => {
                if(err){
                    return res.status(401).json({
                        message : "Thay đổi mật khẩu thất bại !"
                    })
                }
                res.status(200).json({
                    message : "Mật khẩu đã được thay đổi thành công !"
                })
            })
        })
    }

    ChangeAvatar(req,res){
        const form = formidable({ 
            multiples: true,
        });
        form.on('fileBegin',(name , file) => {
            const typeFile = file.originalFilename.split(".")[file.originalFilename.split(".").length - 1];
            file.filepath = "src/public/img/avatars/" + file.newFilename + `.${typeFile}`;
            file.newFilename = file.newFilename + `.${typeFile}`;
        })
        form.parse(req, (err, fields, files) => {
            if(err){
                return res.status(401).json({
                    message : "False to upload file !"
                })
            }
            pool.execute("SELECT * FROM `user` WHERE id = ?",[fields.userId],(err,records) =>{
                if(err){
                    return res.status(401).json({
                        message : "False to upload file !"
                    })
                }
                if(records.length !== 1){
                    return res.status(401).json({
                        message : "False to upload file !"
                    })
                }
                if(!!records[0].user_img)
                {
                    const urlDelete = `src/public/img/avatars/${records[0].user_img.split("/")[records[0].user_img.split("/").length - 1]}`
                    fs.unlink(urlDelete, function (err) {
                        if (err) throw err;
                        
                    });
                }
                const urlImg = `http://localhost:3001/img/avatars/${files.avatar.newFilename}`;
                pool.execute("update user set user_img = ? where id = ?",[urlImg,fields.userId],(err) => {
                    if(err){
                        return res.status(401).json({
                            message : "False to upload file !"
                        })
                    }
                    return res.status(200).json({
                        userAvatar : `http://localhost:3001/img/avatars/${files.avatar.newFilename}`,
                        message : "Changed user avatar !"
                    })
                })
            })
        });
    }

};


module.exports = new loginController;