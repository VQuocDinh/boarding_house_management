import React, { useEffect, useState } from 'react';
import LoginForm from '../LoginForm';
import { useSnackbar } from 'notistack';
import './style.css'
import RegisterForm from '../RegisterForm';
import RegisterApi from '../../Api/RegisterApi';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './LoginSlice';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
Login.propTypes = {
    
};

function Login(props) {
    const [status,setStatus] = useState(true)
    const { enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmitFormLogin = async (value) => {
        try {
            const action = loginUser(value);
            const data = await dispatch(action);
            const user = unwrapResult(data);
            navigate('/')
            enqueueSnackbar("Đăng nhập thành công !",{variant : "success"})
            setStatus(true)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    const handleSubmitFormRegister = async (value) => {
        try {
            const data = await RegisterApi.register(value);
            enqueueSnackbar("Đăng ký thành công !",{variant : "success"})
            setStatus(true)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    const handleChangeForm = (value) => {
        setStatus(value)
    }
    return (
        <div className='Register-Container'>
            <div className='overlay'></div>
            <div className='register-form_container'>
                {status ? <LoginForm onSubmitForm={handleSubmitFormLogin} onChangeForm={handleChangeForm}/> : <RegisterForm onSubmitForm={handleSubmitFormRegister} onChangeForm={setStatus}/>}
            </div>
        </div>
    );
}

export default Login;