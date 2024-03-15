import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import './style.css'
import InputField from '../Inputs/InputField';
import PasswordField from '../Inputs/PasswordField';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import InstagramIcon from '@mui/icons-material/Instagram';
import {Link } from "react-router-dom";
import TwitterIcon from '@mui/icons-material/Twitter';

function LoginForm({onSubmitForm,onChangeForm}) {
    const phoneRegExp = /^\d+$/
    const schema = yup.object({
        phone_number: yup.string().required("Vui lòng điền thông tin").matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
        password: yup.string().required("Vui lòng điền thông tin"),
      })

    const form = useForm({
        defaultValues : {
            phone_number : "",
            password : ""
        },
        resolver: yupResolver(schema)
    })

    const handleSubmitForm = (values) => {
        if(onSubmitForm)
        {
            onSubmitForm(values)
        }
        return;
    } 

    const handleChangeForm = () => {
        if(onChangeForm)
        {
            onChangeForm(false)
        }
        return;
    }

    const handleSignGoogle = () => {
        window.open("http://localhost:3001/auth/google","_self")
    }

    const handleSignGitHub = () => {
        window.open("http://localhost:3001/auth/github","_self")
    }
    return (
        <div className='register-form_container-content'>
                    <div className='form_container-left'>
                        <div className='form_container-left_floor1'>
                            <p>Simple House</p>
                        </div>
                        <div className='form_container-left_floor2'>
                            <h1>You want to manage your apartments in the best way?</h1>
                            <p>Login to access all the features of our services. Manage your business in one place. It's free</p>
                            <div className='floor2-icons'>
                                <div onClick={handleSignGoogle} className="icon-sign">
                                    <i><GoogleIcon /></i>
                                </div>
                                {/* <div className="icon-sign">
                                    <i><TwitterIcon /></i>
                                </div> */}
                                <div className="icon-sign" onClick={handleSignGitHub}>
                                    <i><GitHubIcon /></i>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='form_container-right'>
                        <h1>Log in</h1>
                        <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                            <InputField name="phone_number" label="Tài khoản" form={form}/>
                            <PasswordField name="password" label="Mật khẩu" form={form}/>
                            <div className='containerForm-button'>
                                <button type='submit'>Sign up</button>
                                <span onClick={handleChangeForm}> Don't have an account?</span>
                            </div>
                        </form>
                    </div>
                </div>
    );
}

export default LoginForm;