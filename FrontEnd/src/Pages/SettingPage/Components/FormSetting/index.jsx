import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './style.css'
import avatarImg from '../../../../files/imgs/user-avatar.png'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormFile from '../../../../Components/FormFile';
import { changeAvatar, changeUser } from '../../../../Components/Login/LoginSlice';
import { useDispatch } from 'react-redux';
import RegisterApi from '../../../../Api/RegisterApi';
import { useSnackbar } from 'notistack';
import InputField from '../../../../Components/Inputs/InputField';
import FormChangePass from '../FormChangePass';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
function FormSetting({dataUser}) {
    const phoneRegExp = /^\d+$/
    const [statusForm, setStatusForm] = useState();
    const dispatch = useDispatch();
    const { enqueueSnackbar} = useSnackbar();
    const schema = yup.object({
        fullname: yup.string().required("Vui lòng điền thông tin !"),
        email: yup.string().required("Vui lòng điền thông tin !").email("Cú pháp email không chính xác"),
        phone_number: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
        address: yup.string().required("Vui lòng điền thông tin !"),
      })
    const form = useForm({
        defaultValues : {
            fullname : dataUser?.fullname || "",
            email : dataUser?.email || "",
            address : dataUser?.address || "",
            phone_number: dataUser?.phone_number || "",
        },
        resolver: yupResolver(schema)
    })

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleChangeForm = (item) => {
        switch(item) {
            case 1:
                  {
                    setStatusForm(1);
                    handleClickOpen()
                    break;
                  }
            case 2:
                  {
                    setStatusForm(2);
                    handleClickOpen()
                    break;
                  }
        }
    }

    const handleChangeAvatar = async (values, dataUser , dataAvatar) => {
        const dataSend = {
            avatar : dataAvatar.current,
            idUser : dataUser.id
        }
        try {
            const data = await RegisterApi.ChangeAvatar(dataSend);
            const linkAvatar = data.userAvatar;
            const action = changeAvatar(linkAvatar);
            dispatch(action);
            handleClose()
            enqueueSnackbar("Thay đổi thành công !",{variant:"success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant:"error"})
        }
    }

    const handleChangePass = async (value) => {
        if(value.password == value.new_password)
        {
            enqueueSnackbar("Mật khẩu mới trùng với mật khẩu cũ !",{variant:"info"})
        }
        else{
            value.id = dataUser.id;
            try {
                const data = await RegisterApi.changePass(value);
                handleClose()
                enqueueSnackbar("Thay đổi thành công !",{variant:"success"});
            } catch (error) {
                enqueueSnackbar(error.message,{variant:"error"})
            }
        }
    }

    const handleChangeInfor = async(value) => {
        value.id = dataUser.id
        try {
            const data = await RegisterApi.updateUser(value);
            const action = changeUser(data)
            dispatch(action)
            console.log(data);
            enqueueSnackbar("Thay đổi thông tin thành công !",{variant:"success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant:"error"})
        }
    }

    return (
        <>
            <div className='formSetting-container'>
            <div className='formSetting-content'>
                <p className='Header_page'>Thông tin user</p>
                <div className='avaterUser'>
                    <img src={dataUser?.user_img || avatarImg} alt="" />
                    <p onClick={() => handleChangeForm(1)}>Thay đổi ảnh đại diện</p>
                </div>
                <span className='changePass' onClick={() => handleChangeForm(2)}>Thay đổi password</span>
                <form className='changeInfoForm' onSubmit={form.handleSubmit(handleChangeInfor)}>
                    <div className='input'>
                        <InputField name="fullname" label="Họ và tên" form={form}/>
                    </div>
                    <div className='oneLine'>
                        <div className='input'>
                            <InputField name="phone_number" label="Số điện thoại" form={form}/>
                        </div>
                        <div className='input'>
                            <InputField name="email" label="Email" form={form}/>
                        </div>
                    </div>
                    <div className='input'>
                        <InputField name="address" label="Địa chỉ" form={form}/>
                    </div>
                    <div className='buttons'>   
                        <Button variant="contained" type='submit'>Lưu</Button>
                    </div>
                </form>
            </div>
        </div>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">

            </DialogTitle>
            <DialogContent>
                {statusForm == 1 && <FormFile onCloseDiagram={handleClose} dataUser={dataUser} onChangeAvatar={handleChangeAvatar}/>}
                {statusForm == 2 && <FormChangePass onCloseDiagram={handleClose} onSubmitFormChangePass={handleChangePass}/>}
            </DialogContent>
        </Dialog>
        </>
    );
}

export default FormSetting;