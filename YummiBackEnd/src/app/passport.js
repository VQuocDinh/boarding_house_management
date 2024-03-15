const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const passport = require('passport');
const pool = require("../app/configDB");





const GOOGLE_CLIENT_ID = "64516644677-3jlalvebeibgdptcprc3e9fe6kbjqqdc.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log("Đã lấy được dữ liệu",profile);
    if(!profile.id)
    {
      done(null,false)
    }
    const poolPromise = pool.promise();
    try {
      const [records,fields] = await poolPromise.execute("select * from user where googleId = ?",[profile.id]);
      if(records.length == 0)
      {
        const [recordsInsert,fieldsInsert] = await poolPromise.execute("insert into user (fullname,email,isActive,googleId,user_img) values (?,?,?,?,?)",[profile.displayName,profile.emails[0].value,1,profile.id,profile.photos[0].value])
        console.log("Đã thêm user vào dataBase");
      }
      done(null,profile)
    } catch (error) {
        console.log(error);
        done(error)
    }
  }
));


const GITHUB_CLIENT_ID = "95a64bb436ba0ea4bd4d"
const GITHUB_CLIENT_SECRET = "567e70a5337e016fa2a15a4f7213934908cf3270"
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/github/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log("Đã lấy được dữ liệu",profile);
    if(!profile.id)
    {
      done(null,false)
    }
    const poolPromise = pool.promise();
    try {
      const [records,fields] = await poolPromise.execute("select * from user where githubId = ?",[profile.id]);
      if(records.length == 0)
      {
        const [recordsInsert,fieldsInsert] = await poolPromise.execute("insert into user (fullname,isActive,githubId,user_img) values (?,?,?,?)",[profile.username,1,profile.id,profile.photos[0].value])
        console.log("Đã thêm user vào dataBase");
      }
      done(null,profile)
    } catch (error) {
        console.log(error);
        done(error)
    }
  }
));




passport.serializeUser((user,done) => {
    console.log("Hàm passport.serializeUser chạy");
    done(null,user)
})

passport.deserializeUser((user,done) => {
    console.log("Hàm passport.deserializeUser chạy");
    done(null,user)
})