import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import './style.css'
import InputField from '../../../../Components/Inputs/InputField';
import PasswordField from '../../../../Components/Inputs/PasswordField';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import RegisterApi from '../../../../Api/RegisterApi';
import adminApi from '../../../../Api/adminApi';
function FormAddInfor({status,item = {},getNewId,getNewData}) {
    const { enqueueSnackbar} = useSnackbar();
    const phoneRegExp = /^\d+$/
    let schema = status === "update" ? 
    yup.object({
        name: yup.string().required("Vui lòng điền thông tin !"),
        phone_number: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
        email : yup.string().required("Vui lòng điền thông tin !").email("Cú pháp không chính xác !").email("Cú pháp email không chính xác"),
        address : yup.string().required("Vui lòng điền thông tin !")
    }) 
      : 
    yup.object({
        name: yup.string().required("Vui lòng điền thông tin !"),
        phone_number: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
        email : yup.string().required("Vui lòng điền thông tin !").email("Cú pháp không chính xác !"),
        password: yup.string().required("Vui lòng điền thông tin !"),
        rePassword: yup.string().required("Vui lòng điền thông tin !").oneOf([yup.ref('password')],"Password ko khớp !"),
        address : yup.string().required("Vui lòng điền thông tin !")
    })

    const form = useForm({
        defaultValues : {
            name : item?.fullname || "",
            phone_number : item?.phone_number || "",
            password : "",
            rePassword : "",
            email : item?.email || "",
            address : item?.address || ""
        },
        resolver: yupResolver(schema)
    })

    const handleSubmitForm = async (value) => {
        try {
            if(status === "update")
            {
                value.id = item.id;
                const data = await adminApi.updateStaff(value)
                enqueueSnackbar("Thay đổi thông tin thành công !",{variant : "success"})
            }
            else{
                const data = await RegisterApi.register(value);
                getNewId(data.data)
                enqueueSnackbar("Đăng ký thành công !",{variant : "success"})
            }
            getNewData(x => ({...x}))
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    return (
        <div className='formAddInfor-container'>
            <form onSubmit={form.handleSubmit(handleSubmitForm)} className="formAddInfor-form">
                <div className='input'>
                    <InputField name="name" form={form} label="Họ và tên"/>
                </div>
                <div className='oneLine'>
                    <div className='input'>
                        <InputField name="phone_number" form={form} label="Số điện thoại"/>
                    </div>
                    <div className='input'>
                        <InputField name="email" form={form} label="Email"/>
                    </div> 
                </div>
                <div className='input'>
                    <InputField name="address" form={form} label="Địa chỉ"/>
                </div> 
                {status !== "update" && (
                    <>
                        <div className='input'>
                            <PasswordField name="password" form={form} label="Mật khẩu"/>
                        </div> 
                        <div className='input'>
                            <PasswordField name="rePassword" form={form} label="Nhập lại mật khẩu"/>
                        </div> 
                    </>
                )}
                <div className='buttons'>
                    <Button variant="contained" type='submit'>Lưu</Button>
                </div>
            </form>
        </div>
    );
}

export default FormAddInfor;