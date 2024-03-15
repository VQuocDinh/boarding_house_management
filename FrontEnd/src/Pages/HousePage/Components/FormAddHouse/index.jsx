import React from 'react';
import './style.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import InputField from '../../../../Components/Inputs/InputField';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import adminApi from '../../../../Api/adminApi';
function FormAddHouse({onCloseDiagram,dataItem,statusForm,onReload}) {
    const { enqueueSnackbar} = useSnackbar();
    const schema = yup.object({
        name_house: yup.string().required("Vui lòng điền thông tin !"),
        address: yup.string().required("Vui lòng điền thông tin !")
      })

    const form = useForm({
        defaultValues : {
            name_house : dataItem?.name_house || "",
            address : dataItem?.address || ""
        },
        resolver: yupResolver(schema)
    })
    const handleSubmitForm = async (values) => {
       try {
            if(statusForm === "update")
            {
                values.id = dataItem.id;
                const data = await adminApi.changeInfoHouse(values);
            }
            else{
                const data = await adminApi.addHouse(values);
            }
                onReload(x => ({...x}))
                onCloseDiagram()
                enqueueSnackbar("Tạo nhà thành công !",{variant : "success"})
       } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
       }
    } 
    return (
        <div className='formAddHouse-container'>
            <div className='formAddHouse-content'>
                <p className='header'>Thông tin nhà</p>
                <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                    <div className='input'>
                        <InputField name='name_house' label="Tên nhà" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='address' label="Địa chỉ" form={form} />
                    </div>
                    <div className='formChangePass-container-button'>
                        <Button variant="contained" type='submit'>Lưu</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormAddHouse;