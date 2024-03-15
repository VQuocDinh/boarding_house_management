import React from 'react';
import './style.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import InputField from '../../../../Components/Inputs/InputField';
import { Button } from '@mui/material';
import DateField from '../../../../Components/Inputs/DateField';
import InputFieldMutiline from '../../../../Components/Inputs/InputFieldMutiline';
import { useSelector } from 'react-redux';
import normalApi from '../../../../Api/normalApi';
import { useSnackbar } from 'notistack';
import adminApi from '../../../../Api/adminApi';


function FormEditGuess({dataApi={},onCloseDiagram,reload}) {
    const { enqueueSnackbar} = useSnackbar();
    const schema = yup.object({
        name: yup.string().required("Vui lòng điền thông tin !"),
        phone_number: yup.string().required("Vui lòng điền thông tin !"),
        CMND: yup.string().required("Vui lòng điền thông tin !"),
        CMND_day: yup.string().required("Vui lòng điền thông tin !"),
        CMND_place: yup.string().required("Vui lòng điền thông tin !"),
        email: yup.string().required("Vui lòng điền thông tin !"),
        permanent_address: yup.string().required("Vui lòng điền thông tin !"),
        birth: yup.string().required("Vui lòng điền thông tin !"),
        birth_place: yup.string().required("Vui lòng điền thông tin !"),
      })


      let stringCMND_day = "",stringBirth = "",stringContract_day = "",stringContract_end = "";
      if(dataApi.CMND_day)
      {
          let date = new Date(dataApi.CMND_day);
          stringCMND_day = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          date = new Date(dataApi.birth)
          stringBirth = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          date = new Date(dataApi.contract_day)
          stringContract_day = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          date = new Date(dataApi.contract_end)
          stringContract_end = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      }
    const form = useForm({
        defaultValues : {
            name : dataApi.name || "",
            phone_number : dataApi.phone_number || "",
            CMND : dataApi.CMND || "",
            CMND_day : stringCMND_day || "",
            CMND_place : dataApi.CMND_place || "",
            email : dataApi.email || "",
            permanent_address : dataApi.permanent_address || "",
            birth : stringBirth || "",
            birth_place : dataApi.birth_place || "",
            note : dataApi.note || "",
        },
        resolver: yupResolver(schema)
    })




    const handleSubmitForm = async (value) => {
        try {
                value.id = dataApi.id
                const data = await adminApi.updateMemberInReport(value)
                reload(x => ({...x}));
                onCloseDiagram();
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    return (
        <div className='formAddGuess-container'>
            <p className='header'>Khách hàng</p>
             <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                    <div className='input'>
                        <InputField name='name' label="Họ và tên" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='phone_number' label="Số điện thoại" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='CMND' label="Số chứng minh nhân dân" form={form} />
                    </div>
                    <div className='input'>
                        <DateField name='CMND_day' label="Ngày cấp chứng minh nhân dân" form={form}/>
                    </div>
                    <div className='input'>
                        <InputField name='CMND_place' label="Nơi cấp chứng minh nhân dân" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='email' label="Địa chỉ email" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='permanent_address' label="Địa chỉ thường trú" form={form} />
                    </div>
                    <div className='input'>
                        <DateField name='birth' label="Ngày tháng năm sinh" form={form}/>
                    </div>
                    <div className='input'>
                        <InputField name='birth_place' label="Nơi sinh" form={form} />
                    </div>

                    <div className='input'>
                        <InputFieldMutiline name='note' label="Ghi chú" form={form} mutiline={true} row={10}/>
                    </div>
                    <div className='formChangePass-container-button'>
                        <Button variant="contained" type='submit'>Lưu</Button>
                    </div>
                </form>
        </div>
    );
}

export default FormEditGuess;