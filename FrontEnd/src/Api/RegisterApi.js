import axios from "axios";
import axiosClient from "./axiosClient";


const RegisterApi = {
    register(value){    
        return axiosClient.post("auth/register",value)
    },
    login(value){
        return axiosClient.post("auth/login",value)
    },
    getUser(){
        return axiosClient.get("getall")
    },
    refreshToken(){
        return axiosClient.get("auth/refreshtoken",{ 
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true 
        })
    },
    logOut(){
        return axiosClient.get("auth/logout",{
            withCredentials: true 
        })
    },
    updateUser(value){
        return axiosClient.post("auth/updateUser",value)
    },
    changePass(value){
        return axiosClient.post("auth/changepasswrod",value)
    },
    ChangeAvatar(value){
        var formData = new FormData();
        formData.append("avatar",value.avatar)
        formData.append("userId",value.idUser)
        return axiosClient.post("auth/changeAvatar",formData)
        
    },
    getLoginSuccess(){
        return axiosClient.get("auth/login/success")
    }
}

export default RegisterApi;