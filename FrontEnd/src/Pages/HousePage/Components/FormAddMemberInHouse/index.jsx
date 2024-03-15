import React, { useRef, useState } from 'react';
import './style.css'
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import InputField from '../../../../Components/Inputs/InputField';
import DateField from '../../../../Components/Inputs/DateField';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import normalApi from '../../../../Api/normalApi';
import Moment from 'react-moment';

function FormAddMemberInHouse({dataApi = [],idRoom}) {
    const { enqueueSnackbar} = useSnackbar();
    const [data,setData] = useState([])
    const [arrayDataApi,setArrayDataApi] = useState([...dataApi])
    const ArrayDeleteApi = useRef([]);
    const ArrayChangeApi = useRef([]);

    const types = useRef();
    const changeTypes = useRef();
    const phoneRegExp = /^\d+$/
    const schema = yup.object({
        name: yup.string().required("Vui lòng điền thông tin !"),
        phone_number: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
        CMND: yup.string().required("Vui lòng điền thông tin !").min(9,"Độ dài chứng minh nhân dân không chính xác"),
        email: yup.string().required("Vui lòng điền thông tin !").email("Cú pháp email không chính xác"),
        permanent_address: yup.string().required("Vui lòng điền thông tin !"),
        birth: yup.string().required("Vui lòng điền thông tin !"),
      })
    const form = useForm({
        defaultValues : {
            name : "",
            phone_number : "",
            CMND : "",
            email : "",
            permanent_address : "",
            birth : ""
        },
        resolver : yupResolver(schema)
    })

    const handleSubmitForm = (values) => {
            const tempArray = [...data,values];
            setData(tempArray)
            types.current = tempArray
            form.setValue("name","")
            form.setValue("phone_number","")
            form.setValue("CMND","")
            form.setValue("email","")
            form.setValue("permanent_address","")
            form.setValue("birth","")
    }

    const currentID = useRef(0)
    const buttonAdd = useRef()
    const buttonChange = useRef()
    const typeAdd = useRef();
    const handleShowChangeTypeProduct = (index,type) => {
        typeAdd.current = type;
        let value;
        if(type == 1){
            value = arrayDataApi[index]
        }
        else if(type == 2){
            value = data[index];
        }
        buttonAdd.current.hidden = true;
        buttonChange.current.hidden = false
        currentID.current = index;
        form.setValue("name",value.name)
        form.setValue("phone_number",value.phone_number)
        form.setValue("CMND",value.CMND)
        form.setValue("email",value.email)
        form.setValue("permanent_address",value.permanent_address)
        form.setValue("birth",value.birth)

    }

    const hadleChangeType = () => {
        const newData = form.getValues()
            if(typeAdd.current == 1){
                const tempArray = [...arrayDataApi];
                let ChangeItem = {...arrayDataApi[currentID.current],...newData}
                tempArray.splice(currentID.current,1,ChangeItem)
                let indexAlreadyHave = -100;
                ArrayChangeApi.current.forEach((item,index) => {
                    if(item.id == ChangeItem.id){
                        indexAlreadyHave = index
                    }
                })
                if(indexAlreadyHave != -100){
                    ArrayChangeApi.current.splice(indexAlreadyHave,1)
                }
                ArrayChangeApi.current.push(ChangeItem)
                setArrayDataApi([...tempArray])
            }
           else if(typeAdd.current == 2){
                const tempArray = [...data];
                tempArray.splice(currentID.current,1,newData);
                setData([...tempArray])
                types.current = tempArray
           }
           form.setValue("name","")
           form.setValue("phone_number","")
           form.setValue("CMND","")
           form.setValue("email","")
           form.setValue("permanent_address","")
           form.setValue("birth","")
            buttonAdd.current.hidden = false;
            buttonChange.current.hidden = true
       
    }

    const handleDeleteType = (index) => {
        const tempArray = [...data];
        tempArray.splice(index,1);
        setData([...tempArray])
        types.current = tempArray;
    }

    const handleDeleteTypeApi = (index) => {
        const tempArray = [...arrayDataApi];
        const itemDeleted = tempArray.splice(index,1);
        let tempArray2 = []
        ArrayChangeApi.current.forEach(item => {
            if(item.id != itemDeleted[0].id)
            {
               tempArray2.push(item);
            }
        })
        ArrayChangeApi.current = tempArray2;
        ArrayDeleteApi.current.push(itemDeleted[0]);
        setArrayDataApi([...tempArray])
    }

    const handleSendFormMemberIn = async () => {
        const value = {
            idRoom : idRoom,
            items : JSON.stringify(types.current) 
        }
        try {
            let data;
            if(dataApi.length !== 0)
            {
                value.itemChange = JSON.stringify(ArrayChangeApi.current);
                value.itemDelete = JSON.stringify(ArrayDeleteApi.current);
                data = await normalApi.updateMemberToHouse(value)
            }
            else{
                data = await normalApi.addMemberToHouse(value);
            }
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    return (
        <>
            <form className='FormAddTypeProduct' onSubmit={form.handleSubmit(handleSubmitForm)}>
                <p className='FormAddTypeProduct-header'>Thành viên chung phòng</p>
                <div className='FormAddTypeProduct-colors'>
                    <div className='FormAddTypeProduct-colors_header'>
                        <p className='item'>Họ tên</p>
                        <p className='item'>Số điện thoại</p>
                        <p className='item'>Số chứng minh</p>
                        <p className='item'>Email</p>
                        <p className='item'>Địa chỉ thường chú</p>
                        <p className='item'>Ngày tháng năm sinh</p>
                        <p className='item'>Thiết lập</p>
                    </div>
                    <div className='FormAddTypeProduct-colors_content'>
                        {
                            arrayDataApi.map((item,index) => (
                                <div className='item' key={index}>
                                    <p>{item.name}</p>
                                    <p>{item.phone_number}</p>
                                    <p>{item.CMND}</p>
                                    <p>{item.email}</p>
                                    <p>
                                        {
                                            item.permanent_address.length > 10 
                                            ? 
                                            (<Moment format="DD/MM/YYYY">
                                            {item.permanent_address}
                                            </Moment>) 
                                            : 
                                            item.permanent_address
                                        }
                                        
                                    </p>
                                    <p>
                                        {
                                            item.birth.length > 10 
                                            ? 
                                            (<Moment format="DD/MM/YYYY">
                                            {item.birth}
                                            </Moment>) 
                                            : 
                                            item.birth
                                        }
                                    </p>
                                    <div className='item-icons'>
                                        <div onClick={() => handleShowChangeTypeProduct(index,1)}><SettingsIcon /></div>
                                        <div onClick={() => handleDeleteTypeApi(index)}><DeleteIcon /></div>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            data.map((item,index) => (
                                <div className='item' key={index*10}>
                                    <p>{item.name}</p>
                                    <p>{item.phone_number}</p>
                                    <p>{item.CMND}</p>
                                    <p>{item.email}</p>
                                    <p>{item.permanent_address}</p>
                                    <p>{item.birth}</p>
                                    <div className='item-icons'>
                                        <div onClick={() => handleShowChangeTypeProduct(index,2)}><SettingsIcon /></div>
                                        <div onClick={() => handleDeleteType(index)}><DeleteIcon /></div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='FormAddTypeProduct-fields'>     
                    <div className='item field-color'>
                        <InputField form={form} name="name" label="Họ tên"/>
                    </div>
                    <div className='item field-size'>
                        <InputField form={form} name="phone_number" label="Số điện thoại"/>
                    </div>
                    <div className='item field-count'>
                        <InputField form={form} name="CMND" label="Số chứng minh thư"/>
                    </div>
                    <div className='item field-price'>
                        <InputField form={form} name="email" label="Email"/>
                    </div>
                    <div className='item field-price'>
                        <InputField form={form} name="permanent_address" label="Địa chỉ thường chú"/>
                    </div>
                    <div className='item field-price'>
                        <DateField form={form} name="birth" label="Ngày tháng năm sinh"/>
                    </div>
                </div>
                <div className='FormAddTypeProduct-button'>
                    <button type='submit' ref={buttonAdd}>Thêm</button>
                    <div onClick={hadleChangeType} className='button-Change' ref={buttonChange} hidden={true}>Lưu</div>
                </div>
            </form>
            <div className='buttonSubmitMemberIn' onClick={handleSendFormMemberIn}>
                <Button variant="contained">Gửi form</Button>
            </div>
        </>
    );
}

export default FormAddMemberInHouse;