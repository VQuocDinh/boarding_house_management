import React from 'react';
import { useForm } from 'react-hook-form';
import PasswordField from '../../../../Components/Inputs/PasswordField';
import './style.css'
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
function FormChangePass({onSubmitFormChangePass,onCloseDiagram}) {
    const schema = yup.object({
        password: yup.string().required("Vui lòng điền thông tin !"),
        new_password : yup.string().required("Vui lòng điền thông tin !"),
        reNew_password: yup.string().required("Vui lòng điền thông tin !").oneOf([yup.ref('new_password')],"Password ko khớp !"),
      })
    const form = useForm({
        defaultValues : {
            password : "",
            new_password : "",
            reNew_password : ""
        },
        resolver: yupResolver(schema)
    })

    const handleSubmitForm = (value) => {
        if(onSubmitFormChangePass)
        {
            onSubmitFormChangePass(value)
        }
    }

    return (
        <div className='FormChangePass'>
            <p className='formChangePass-header'>Form thay đổi mật khẩu</p>
            <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                <div className='input'>
                    <PasswordField name="password" label="Mật khẩu cũ" form={form}/>
                </div>
                <div className='input'>
                    <PasswordField name="new_password" label="Mật khẩu mới" form={form}/>
                </div>
                <div className='input'>
                    <PasswordField name="reNew_password" label="Nhập lại mật khẩu mới" form={form}/>
                </div>

                <div className='buttons'>
                    <div className='buttons-cancel' onClick={onCloseDiagram}>
                        <Button variant="outlined">Cancel</Button>
                    </div>
                    <div className='buttons-ok'>
                        <Button variant="contained" type='submit'>Ok</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default FormChangePass;