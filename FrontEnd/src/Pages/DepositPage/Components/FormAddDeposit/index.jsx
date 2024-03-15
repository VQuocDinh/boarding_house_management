import React, { useMemo, useRef, useState } from 'react';
import './style.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import InputField from '../../../../Components/Inputs/InputField';
import DateField from '../../../../Components/Inputs/DateField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import normalApi from '../../../../Api/normalApi';
import CheckField from '../../../../Components/Inputs/CheckField';
import InputFieldMutiline from '../../../../Components/Inputs/InputFieldMutiline';
import { useSelector } from 'react-redux';


function FormAddDeposit({dataHouse,onCloseDiagram,dataApi = {},status,reLoad}) {
    const { enqueueSnackbar} = useSnackbar();
    const [house, setHouse] = React.useState(() => {return dataApi.houseId ? dataApi.houseId : ''});
    const [room,setRoom] = useState([]);
    const [roomInput,setRoomInput] = useState(() => {return dataApi.room_id ? dataApi.room_id : ''});
    const ItemCanAdd = useRef(false)


    const handleChange = async (valueInput) => {
        if(dataApi.houseId && dataApi.houseId == valueInput)
        {
            ItemCanAdd.current = true;
        }
        else
        {
            ItemCanAdd.current = false;
        }
        setHouse(valueInput);
        try {
            const value = {
                idRoom : valueInput,
                status : 1
            }
            const dataRoom = await normalApi.getRoom(value);
            console.log(dataRoom);
            setRoom(dataRoom.data)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    };
    useMemo(() => {
        if(dataApi.houseId)
        {
            handleChange(dataApi.houseId)
        }
    },[])

    const handleChangeInputRoom = (event) => {
        setRoomInput(event.target.value)
    }


    const phoneRegExp = /^\d+$/
    const schema = yup.object({
        name_person: yup.string().required("Vui lòng điền thông tin !"),
        phone_number: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số điện thoại không hợp lệ').min(10,"Độ dài thông tin không chính xác"),
        money_deposit: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số tiền không hợp lệ'),
        day_come: yup.string().required("Vui lòng điền thông tin !"),
      })


    let stringTime;
    if(dataApi.time)
    {
        let date = new Date(dataApi.day_come);
        stringTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    const form = useForm({
        defaultValues : {
            name_person : dataApi.name_person || "",
            phone_number : dataApi.phone_number || "",
            money_deposit : dataApi.money_deposit || "",
            day_come : stringTime || "",
            note : dataApi.note || ""
        },
        resolver: yupResolver(schema)
    })

    const stateUser = useSelector(state => state.user.user)
    const handleSubmitForm = async (value) => {
        value.room_id = roomInput;
        value.idUser = stateUser.id;
        value.nameUser = stateUser.fullname;
        let data;
        try {
            if(status == "update")
            {
                value.id = dataApi.id;
                value.oldRoomId = dataApi.room_id;
                data = await normalApi.updateDeposit(value);
            }
            else{
                data = await normalApi.addDeposit(value);
            }
            reLoad(x => ({...x}))
            onCloseDiagram()
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

    
    return (
        <div className='formAddJob-container'>
            <div className='formAddJob-content'>
                <p className='header'>Đặt cọc phòng</p>
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
                                        <MenuItem key={item.id} value={item.id}>{item.name_house}</MenuItem>
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
                                onChange={handleChangeInputRoom}
                                >
                                {ItemCanAdd.current && <MenuItem key={dataApi.room_id} value={dataApi.room_id}>{dataApi.room_number}</MenuItem>}
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
                        <InputField name='name_person' label="Người đặt cọc" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='phone_number' label="Số điện thoại" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='money_deposit' label="Số tiền cọc" form={form} />
                    </div>
                    <div className='input'>
                        <DateField name="day_come" label="Thời gian nhận phòng dự kiến" form={form}/>
                    </div>
                    <div className='input'>
                        <InputFieldMutiline name="note" form={form} label="Nội dung" mutiline={true} row={10}/>
                    </div>
                    <div className='formChangePass-container-button'>
                        <Button variant="contained" type='submit'>Lưu</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormAddDeposit;