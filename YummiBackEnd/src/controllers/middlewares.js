const pool = require('../app/configDB')
var jwt = require('jsonwebtoken');
const formidable = require('formidable');
class middlewares{
    verifyUser(req,res,next){
        if(!req.headers['x-token']){
            return res.json({
                message : "You are not user in this web !"
            }).status(401)
        }
        const token = req.headers['x-token'];
        jwt.verify(token,process.env.SECRET_KEY,(err,data) => {
            if(err?.name == "TokenExpiredError"){
                return res.json({
                    message : err?.message
                }).status(401)
            }
            else if(err)
            {
                return res.json({
                    message : err
                }).status(500)
            }
            req.userNormal = data;
            next()
        })
        
    }

    async needLogin(req,res,next){
        const poolPromise = pool.promise()
        const idUser = req.userNormal.id
        try {
            const [records,fields] = await poolPromise.execute("select * from tokens where user_id = ?",[idUser])
            if(records.length === 0)
            {
                return res.status(200).json({
                    message : "need login"
                })
            }
            else{
                next()
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message : 'something wrong'
            })
        }
    }

    verifyAdmin(req,res,next){
            if(req.userNormal.isAdmin === 1){
                next();
            }
            else{
                res.status(403).json({
                    message : "You are not allowed to use this feture !"
                })
            }
    }
}
module.exports = new middlewares;