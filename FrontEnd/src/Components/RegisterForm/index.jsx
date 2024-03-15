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
RegisterForm.propTypes = {
    
};

function RegisterForm({onSubmitForm,onChangeForm}) {
    const phoneRegExp = /^\d+$/
    const schema = yup.object({
        name: yup.string().required("Vui lòng điền thông tin !"),
        phone_number: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
        password: yup.string().required("Vui lòng điền thông tin !"),
        rePassword: yup.string().required("Vui lòng điền thông tin !").oneOf([yup.ref('password')],"Password ko khớp !"),
      })

    const form = useForm({
        defaultValues : {
            name : "",
            phone_number : "",
            password : "",
            rePassword : ""
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
            onChangeForm(true)
        }
        return;
    }

    return (
        <div className='register-form_container-content'>
                    <div className='form_container-left'>
                        <div className='form_container-left_floor1'>
                            <p>Simple House</p>
                        </div>
                        <div className='form_container-left_floor2'>
                            <h1>Don't have an account?</h1>
                            <p>Register to access all the features of our services. Manage your business in one place. It's free</p>
                            <div className='floor2-icons'>
                                <i><FacebookOutlinedIcon /></i>
                                <i><GoogleIcon /></i>
                                <i><InstagramIcon /></i>
                                <i><GitHubIcon /></i>
                            </div>
                        </div>

                    </div>
                    <div className='form_container-right'>
                        <h1>Sign up</h1>
                        <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                            <InputField name="name" form={form} label="Họ và tên"/>
                            <InputField name="phone_number" form={form} label="Số điện thoại"/>
                            <PasswordField name="password" form={form} label="Mật khẩu"/>
                            <PasswordField name="rePassword" form={form} label="Nhập lại mật khẩu"/>
                            <div className='containerForm-button'>
                                <button type='submit'>Sign up</button>
                                <span onClick={handleChangeForm}>Have an account?</span>
                            </div>
                        </form>
                    </div>
                </div>
    );
}

export default RegisterForm;