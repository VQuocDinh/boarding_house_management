import React from 'react';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import PasswordField from '../../../../Components/Inputs/PasswordField';
import './style.css'
function FormChangePassStaff({idUser,onChangePass}) {
    const schema = yup.object({
        password: yup.string().required("Vui lòng điền thông tin !"),
        rePassword: yup.string().required("Vui lòng điền thông tin !").oneOf([yup.ref('password')],"Password ko khớp !"),
      })

    const form = useForm({
        defaultValues : {
            password : "",
            rePassword : ""
        },
        resolver: yupResolver(schema)
    })
    const handleSubmitForm = (values) => {
        values.id = idUser;
        if(onChangePass)
        {
            onChangePass(values)
        }
    } 
    return (
        <div className='formChangePass-container'>
            <p className='header'>Thay đổi mật khẩu</p>
            <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                <div className='input'>
                    <PasswordField name="password" form={form} label="Mật khẩu"/>
                </div>
                <div className='input'>
                <PasswordField name="rePassword" form={form} label="Nhập lại mật khẩu"/>
                </div>
                <div className='formChangePass-container-button'>
                    <Button variant="contained" type='submit'>Lưu</Button>
                </div>
            </form>
        </div>
    );
}

export default FormChangePassStaff;