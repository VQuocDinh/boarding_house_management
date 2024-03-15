import React, { useMemo, useState } from 'react';
import './style.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
import InputField from '../../../../Components/Inputs/InputField';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import normalApi from '../../../../Api/normalApi';
import DateField from '../../../../Components/Inputs/DateField';
import DateNoDayField from '../../../../Components/Inputs/DateNoDayField';
import { useSelector } from 'react-redux';


function FormAddElectric({dataHouse=[],onCloseDiagram,dataApi = {},status,reLoad}) {
    const phoneRegExp = /^\d+$/
    const { enqueueSnackbar} = useSnackbar();
    const [house, setHouse] = React.useState('');
    const [room,setRoom] = useState([]);
    const [roomInput,setRoomInput] = useState(() => {
        if(dataApi.room_id)
        {
            return dataApi.room_id;
        }
        return ''
    });
    const schema = yup.object({
        room_id: yup.string().required("Vui lòng điền thông tin !"),
        oldNumber: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số điện không hợp lệ'),
        newNumber: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số điện không hợp lệ'),
        from_time: yup.string().required("Vui lòng điền thông tin !"),
        to_time : yup.string().required("Vui lòng điền thông tin !"),
        current_time: yup.string().required("Vui lòng điền thông tin !"),
        price: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số tiền không hợp lệ'),
      })

    let stringTimeFrom,stringCurrentTime,stringTimeTo;
    if(dataApi.from_time)
    {
        let date = new Date(dataApi.from_time);
        stringTimeFrom = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        date = new Date(dataApi.current_time)
        stringCurrentTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        date = new Date(dataApi.to_time)
        stringTimeTo = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    console.log(dataApi.from_time,dataApi.to_time);
    const form = useForm({
        defaultValues : {
            room_id : dataApi.room_id || "",
            oldNumber : dataApi.old || "",
            newNumber : dataApi.new || "",
            from_time : stringTimeFrom || "",
            to_time : stringTimeTo || "",
            current_time : stringCurrentTime || "",
            price : dataApi.price || ""
        },
        resolver: yupResolver(schema)
    })

    const dataUser = useSelector(state => state.user.user)
    const handleSubmitForm = async (value) => {
        value.idUser = dataUser.id;
        value.nameUser = dataUser.fullname
        try {
            let data;
            if(status == "update")
            {
                value.id = dataApi.billId;
                data = await normalApi.updateElectricBill(value)
            }
            else{
                data = await normalApi.addElectricBill(value);
            }
            reLoad(x => ({...x}))
            onCloseDiagram()
            enqueueSnackbar(data.message,{variant : "success"}) 
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"}) 
        }
    }

    const handleChange = async (value) => {
        setHouse(value);
        try {
            const valueSend = {
                idRoom :value
            }
            const dataRoom = await normalApi.getRoom(valueSend);
            setRoom(dataRoom.data)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    };

    useMemo(()=>{
        if(dataApi.house_id)
        {
            handleChange(dataApi.house_id)
        }
    },[])
    
    const handleChangeRoomInput = (e) => {
        setRoomInput(e.target.value)
        form.setValue("room_id",e.target.value)
    }
    return (
        <div className='formAddElectric-container'>
            <div className='formAddElectric-content'>
                <p className='header'>Hóa đơn điện tháng</p>
                <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                        <div className='input'>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Nhà</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={house}
                                    label="Nhà"
                                    onChange={(event) => handleChange(event.target.value)}
                                    >
                                    {
                                        dataHouse.map(item => (
                                            <MenuItem value={item.id}>{item.status ? item.name_house : `${item.name_house} (Ngừng hoạt động)`}</MenuItem>
                                        ))
                                    }
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                        <div className='input'>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Phòng</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={roomInput}
                                    label="Phòng"
                                    onChange={handleChangeRoomInput}
                                    >
                                    {
                                        room.map(item => {
                                            if(item.status_room !== 5) 
                                            {
                                                return <MenuItem value={item.id}>{item.room_number}</MenuItem>
                                            }
                                        })
                                    }
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                        <div className='input'>
                            <DateField name='from_time' label="Từ ngày" form={form}/>
                        </div>
                        <div className='input'>
                            <DateField name='to_time' label="Đến ngày" form={form}/>
                        </div>
                        <div className='oneLine'>
                            <div className='input'>
                                <InputField name='oldNumber' label="Số điện cũ" form={form} />
                            </div>
                            <div className='input'>
                                <InputField name='newNumber' label="Số điện mới" form={form} />
                            </div>
                        </div>
                        <div className='input'>
                            <DateField name='current_time' label="Thời gian đóng" form={form}/>
                        </div>
                        <div className='input'>
                            <InputField name='price' label="Thành tiền" form={form} />
                        </div>
                        {
                            status == "update" && (
                                <div className='input update-note-form'>
                                    <p>{`Thay đổi dữ liệu phiếu có thể gây ra những biến đổi với phiếu tháng và báo cáo lời lỗ. 
                                    Khi thay đổi phiếu điện, bạn cần tính toán lại hóa đơn tháng liên quan đến phiếu điện đó!`}</p>
                                </div>
                            )
                        }
                        <div className='formChangePass-container-button'>
                            <Button variant="contained" type='submit'>Lưu</Button>
                        </div>
                </form>
            </div>
        </div>
    );
}

export default FormAddElectric;