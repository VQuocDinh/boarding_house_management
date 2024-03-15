import React, { useEffect, useState } from 'react';
import './style.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import InputField from '../../../../Components/Inputs/InputField';
import DateField from '../../../../Components/Inputs/DateField';
import { Button } from '@mui/material';
import normalApi from '../../../../Api/normalApi';
import InputFieldMutiline from '../../../../Components/Inputs/InputFieldMutiline';
function FormAddDiscount({onCloseDiagram,dataApi = {},reLoad}) {
    const phoneRegExp = /^\d+$/
    const { enqueueSnackbar} = useSnackbar();
    const schema = yup.object({
        money: yup.string().required("Vui lòng điền thông tin !"),
        reason: yup.string().required("Vui lòng điền thông tin !")
      })
      const form = useForm({
        defaultValues : {
            money : "",
            reason : ""
        },
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        (async () => {
            try {
                const data = await normalApi.getDisCountMonth({id : dataApi.id})
                form.setValue("money",data.data.arise)
                form.setValue("reason",data.data.discount_reason)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"}) 
            }
        })()
    },[])

    const dataUser = useSelector(state => state.user.user)
    const handleSubmitForm = async (value) => {
        value.idUser = dataUser.id;
        value.nameUser = dataUser.fullname
        value.id = dataApi.id;
        try {
            const data = await normalApi.discountPayMonth(value);
            reLoad(x => ({...x}))
            onCloseDiagram()
            enqueueSnackbar(data.message,{variant : "success"}) 
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"}) 
        }
    }
    return (
        <div className='formAddElectric-container'>
            <div className='formAddElectric-content'>
                <p className='header'>Hóa đơn điện tháng</p>
                <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                        <div className='input'>
                            <InputField name='money' label="Số tiền giảm (vnđ)" form={form} />
                        </div>
                        <div className='input'>
                            <InputFieldMutiline name='reason' form={form} label="Lý do" row={10} mutiline={true}/>
                        </div>
                        <div className='formChangePass-container-button'>
                            <Button variant="contained" type='submit'>Lưu</Button>
                        </div>
                </form>
            </div>
        </div>
    );
}

export default FormAddDiscount;