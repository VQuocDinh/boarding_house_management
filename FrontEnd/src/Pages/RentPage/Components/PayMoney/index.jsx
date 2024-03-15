import React from 'react';
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

function PayMoney({onCloseDiagram,dataApi = {},reLoad}) {
    const phoneRegExp = /^\d+$/
    const { enqueueSnackbar} = useSnackbar();
    const schema = yup.object({
        money: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số tiền không hợp lệ'),
        day_do: yup.string().required("Vui lòng điền thông tin !")
      })
      const form = useForm({
        defaultValues : {
            money : "",
            day_do : ""
        },
        resolver: yupResolver(schema)
    })

    const dataUser = useSelector(state => state.user.user)
    const handleSubmitForm = async (value) => {
        value.idUser = dataUser.id;
        value.nameUser = dataUser.fullname
        value.id = dataApi.id;
        try {
            const data = await normalApi.payMoneyMonth(value);
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
                <p className='header'>Đóng tiền tháng</p>
                <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                        <div className='input'>
                            <DateField name='day_do' label="Thời gian đóng" form={form}/>
                        </div>
                        <div className='input'>
                            <InputField name='money' label="Số tiền đóng" form={form} />
                        </div>
                        <div className='formChangePass-container-button'>
                            <Button variant="contained" type='submit'>Lưu</Button>
                        </div>
                </form>
            </div>
        </div>
    );
}

export default PayMoney;