import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
import InputFieldMutiline from '../../../../Components/Inputs/InputFieldMutiline';
import Button from '@mui/material/Button';
import InputField from '../../../../Components/Inputs/InputField';
import './style.css'
import adminApi from '../../../../Api/adminApi';

function FormAddService({onCloseDiagram,dataApi,status,reLoadForm}) {
    const phoneRegExp = /^\d+$/
    const { enqueueSnackbar} = useSnackbar();
    const schema = yup.object({
        name: yup.string().required("Vui lòng điền thông tin !"),
        price: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Giá tiền không hợp lệ'),
      })

    const form = useForm({
        defaultValues : {
            name : dataApi?.name || "",
            price : dataApi?.price || "",
            note : dataApi?.note || ""
        },
        resolver: yupResolver(schema)
    })
    const handleSubmitForm = async (value) => {
        let data;
        try {
            if(status == "update")
            {
                value.id = dataApi.id;
                data = await adminApi.updateService(value)
            }
            else{
                data = await adminApi.addService(value)
            }
            reLoadForm(x => ({...x}))
            onCloseDiagram()
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    return (
        <div className='formAddService-container'>
            <div className='formAddService-content'>
                <p className='header'>Thông tin dịch vụ</p>
                <form form onSubmit={form.handleSubmit(handleSubmitForm)}>
                        <div className='input'>
                            <InputField name='name' label="Tên dịch vụ" form={form} />
                        </div>
                        <div className='input'>
                            <InputField name='price' label="Giá dịch vụ" form={form} />
                        </div>
                        <div className='input'>
                            <InputFieldMutiline name="note" label="Ghi chú" form={form} row={5} mutiline={true}/>
                        </div>
                        <div className='formChangePass-container-button'>
                            <Button variant="contained" type='submit'>Lưu</Button>
                        </div>
                </form>
            </div>
        </div>
    );
}

export default FormAddService;