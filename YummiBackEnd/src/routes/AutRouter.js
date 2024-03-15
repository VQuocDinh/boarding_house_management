const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();
const passport = require('passport');
const middlewares = require('../controllers/middlewares');
const pool = require('../app/configDB');

router.post('/register',loginController.RegisterUser)
router.post('/login',loginController.LoginUser)

router.get('/refreshtoken',loginController.refreshToken)

router.get('/logout',middlewares.verifyUser,loginController.logOut)
router.post('/updateUser',middlewares.verifyUser,middlewares.needLogin,loginController.UpdateUser)
router.post('/changepasswrod',middlewares.verifyUser,middlewares.needLogin,loginController.ChangePassword)
router.post('/changeAvatar',middlewares.verifyUser,middlewares.needLogin,loginController.ChangeAvatar)


router.get('/login/success',loginController.LoginUserOauth2)
router.get('/login/failed',(req,res) => {
    return res.status(401).json({
        message : "false to login by google !"
    })
})


router.get('/google',passport.authenticate("google", {scope: ["profile",'email'], prompt: "consent"}))
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login/failed' }),
  function(req, res) {
    console.log("Xác thực thành công chuyển trang bên client");
    res.redirect('http://localhost:3000');
});



router.get('/github',passport.authenticate("github", {scope: ["profile"], prompt: "consent"}))
router.get('/github/callback',passport.authenticate("github",{
    successRedirect : "http://localhost:3000",
    failureRedirect : "/login/failed"
}))
module.exports = router;


