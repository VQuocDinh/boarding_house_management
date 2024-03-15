import React, { useState } from 'react';
import './style.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import InputField from '../../../../Components/Inputs/InputField';
import SelectField from '../../../../Components/Inputs/SelectField';
import InputFieldMutiline from '../../../../Components/Inputs/InputFieldMutiline';
import FormMutiFileImg from '../../../../Components/Inputs/FormMutiFileImg';
import adminApi from '../../../../Api/adminApi';
function FormaddRoom({dataStatus = [],dataHouses = [],onCloseDiagram,dataApi = {},status,reLoad}) {
    const phoneRegExp = /^\d+$/;
    const { enqueueSnackbar} = useSnackbar();
    const schema = yup.object({
        house_id: yup.string().required("Vui lòng điền thông tin !"),
        status_room: yup.string().required("Vui lòng điền thông tin !"),
        room_number: yup.string().required("Vui lòng điền thông tin !"),
        price: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số tiền không hợp lệ'),
        length: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Chiều dài không hợp lệ'),
        width: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Chiều rộng không hợp lệ'),
        people_number: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số người nhập không hợp lệ'),
        describe: yup.string().required("Vui lòng điền thông tin !")
      })

    const newDataStatus = dataStatus.filter(item => {return item.id != 2 && item.id !=3})
    const form = useForm({
        defaultValues : {
            house_id : dataApi.House_id || "",
            status_room : dataApi.status_room || "",
            room_number : dataApi.room_number || "",
            price : dataApi.price || "",
            length : dataApi.length || "",
            width : dataApi.width || "",
            people_number : dataApi.people_number || "",
            describe : dataApi.describe || "",
            imgs : [],
            deleteImgs : []
        },
        resolver: yupResolver(schema)
    })

    const handleSubmitForm = async (value) => {
        let data;
        try {
            if(status === "update")
            {
                value.id = dataApi.id;
                data = await adminApi.updateRoom(value)
            }
            else{
                data = await adminApi.addRoom(value)
            }
            reLoad({})
            onCloseDiagram()
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
     return (
        <div className='formAddRoom-container'>
            <div className='formAddRoom-content'>
                <p className='header'>Thông tin phòng</p>
                <form form onSubmit={form.handleSubmit(handleSubmitForm)}>
                    <div className='oneLine'>
                        <div className='input'>
                            <SelectField data={dataHouses} name="house_id" label="Nhà" form={form}/>
                        </div>
                        <div className='input'>
                            <SelectField data={newDataStatus} name="status_room" label="Trạng thái phòng" form={form}/>
                        </div>
                    </div>
                    <div className='input'>
                        <InputField name='room_number' label="Mã số phòng" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='price' label="Giá phòng (vnd)" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='length' label="Chiều dài (m)" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='width' label="Chiều rộng (m)" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='people_number' label="Số người ở tối đa" form={form} />
                    </div>
                    <div className='input'>
                        <InputFieldMutiline form={form} name='describe' label="Mô tả thêm" mutiline={true} row={10}/>
                    </div>
                    <div className='input'>
                        <FormMutiFileImg formMain={form} isMuti={true} nameField="imgs" dataApi={dataApi.galery}/>   
                    </div>
                    <div className='formChangePass-container-button'>
                        <Button variant="contained" type='submit'>Lưu</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormaddRoom;