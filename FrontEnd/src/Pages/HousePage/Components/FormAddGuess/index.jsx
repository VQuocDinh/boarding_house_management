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


function FormAddGuess({idRoom,dataApi={},reload}) {
    const phoneRegExp = /^\d+$/
    const { enqueueSnackbar} = useSnackbar();
    const schema = yup.object({
        name: yup.string().required("Vui lòng điền thông tin !"),
        phone_number: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
        CMND: yup.string().required("Vui lòng điền thông tin !").min(9,"Độ dài chứng minh nhân dân không chính xác"),
        CMND_day: yup.string().required("Vui lòng điền thông tin !"),
        CMND_place: yup.string().required("Vui lòng điền thông tin !"),
        email: yup.string().required("Vui lòng điền thông tin !").email("Cú pháp email không chính xác"),
        permanent_address: yup.string().required("Vui lòng điền thông tin !"),
        birth: yup.string().required("Vui lòng điền thông tin !"),
        birth_place: yup.string().required("Vui lòng điền thông tin !"),
        contract_day : yup.string().required("Vui lòng điền thông tin !"),
        contract_time : yup.string().required("Vui lòng điền thông tin !"),
        contract_end : yup.string().required("Vui lòng điền thông tin !"),
        deposit : yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số tiền cọc không đúng hợp lệ') 

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
            room_id : idRoom,
            phone_number : dataApi.phone_number || "",
            CMND : dataApi.CMND || "",
            CMND_day : stringCMND_day || "",
            CMND_place : dataApi.CMND_place || "",
            email : dataApi.email || "",
            permanent_address : dataApi.permanent_address || "",
            birth : stringBirth || "",
            birth_place : dataApi.birth_place || "",
            note : dataApi.note || "",
            contract_day : stringContract_day || "",
            contract_time : dataApi.contract_time || "",
            contract_end : stringContract_end || "",
            deposit : dataApi.deposit || "" ,
        },
        resolver: yupResolver(schema)
    })



    const stateUser = useSelector(state => state.user.user)

    const handleSubmitForm = async (value) => {
        value.idUser = stateUser.id;
        value.nameUser = stateUser.fullname;
        let data;
        try {
            if(dataApi.name)
            {
                value.id = dataApi.id;
                value.member_id = dataApi.member_id
                data = await normalApi.updateContract(value)
            }
            else{
                data = await normalApi.addContract(value);
            }
            reload({})
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    return (
        <div className='formAddGuess-container'>
            <p className='header'>Hợp đồng</p>
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
                        <DateField name='contract_day' label="Ngày ký kết hợp đồng" form={form}/>
                    </div>
                    <div className='input'>
                        <InputField name='contract_time' label="Thời gian hợp đồng (tháng)" form={form} />
                    </div>
                    <div className='input'>
                        <DateField name='contract_end' label="Ngày ký kết thúc hợp đồng" form={form}/>
                    </div>
                    <div className='input'>
                        <InputField name='deposit' label="Số tiền cọc" form={form} />
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

export default FormAddGuess;