import axios from "axios";
import { useNavigate } from "react-router-dom";
import store from '../App/store'
import { changeJwt, logOutUser } from "../Components/Login/LoginSlice";
import RegisterApi from "./RegisterApi";

import history from "../App/history";
const axiosClient = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
      'Content-Type': 'application/json',
      
    },
    withCredentials: true,
})
axios.defaults.withCredentials = true;

// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
  
    if(config.url.indexOf('login') >=0 || config.url.indexOf('refreshToken') >= 0){
      return config;
    }
    const data = store.getState().user.jwt
    const token = data;
    config.headers['X-Token'] = token;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Add a response interceptor
axiosClient.interceptors.response.use(async function (response) {

    const config = response.config;
    if (config.data) {
      if(!config.data?.get){
        config.data = JSON.parse(config.data);  
      }
    }

    if(config.url.indexOf('login') >=0 || config.url.indexOf('refreshToken') >= 0){
      return response.data;
    }

    const {message} = response.data;
      if(message == "jwt expired")
      {
        try { 
          const data = await RegisterApi.refreshToken();
          if(data.refreshToken)
          {
            document.cookie = `refreshToken= ${data.refreshToken}`
            const action = changeJwt(data.accessToken)
            store.dispatch(action);
            config.headers['X-Token'] = data.accessToken;
            return axiosClient(config);
          }
        } catch (error) {
          if(error.message == "You did't login" || error.message == "Your refresh token is not valid !")
          {
            const action = logOutUser();
            store.dispatch(action);
            history.push({ pathname: '/login' });
          }
        }
      }
      if(message == "need login"){
        const action = logOutUser();
        store.dispatch(action);
        history.push({ pathname: '/login' });
      }
    return response.data;
  }, function (error) {

    // Do something with response error
    return Promise.reject(error.response.data);
  });


export default axiosClient;