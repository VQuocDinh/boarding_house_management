import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import RegisterApi from '../../Api/RegisterApi'


export const loginUser = createAsyncThunk(
    'user/login',
    async (payload) => {
        const data = await RegisterApi.login(payload);
        return data;
    }
)

const LoginSlice = createSlice({
    name: 'Login',
    initialState : {
        jwt : localStorage.getItem("jwt") == "undefined" ? "" : JSON.parse(localStorage.getItem("jwt")),
        user : localStorage.getItem("user") == "undefined" ? {} : JSON.parse(localStorage.getItem("user"))
    },
    reducers: {
        changeJwt(state,action){
            state.jwt = action.payload;
        },
        logOutUser(state,action){
            state.jwt = "";
            state.user = {};
            localStorage.setItem("user", JSON.stringify({}));
            localStorage.setItem("jwt", JSON.stringify(""));
            const cookies = document.cookie.split(";");

            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        },
        changeUser(state,action){
            state.user = action.payload.data;
            localStorage.setItem("user",JSON.stringify(state.user))
        },
        changeAvatar(state,action){
            state.user.user_img = action.payload
            localStorage.setItem("user",JSON.stringify(state.user))
        }
    },
    extraReducers : {
        [loginUser.fulfilled] : (state, action) => {
            state.jwt = action.payload.accessToken;
            state.user = action.payload.data;
            document.cookie = `refreshToken= ${action.payload.refreshToken}`
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("jwt", JSON.stringify(state.jwt))
        },
    }
  })
  
  export const {changeJwt,logOutUser,changeUser,changeAvatar} = LoginSlice.actions
  export default LoginSlice.reducer


