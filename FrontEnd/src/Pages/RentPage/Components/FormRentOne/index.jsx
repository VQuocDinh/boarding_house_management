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

function FormRentOne({dataHouse=[],onCloseDiagram,reLoad}) {
    const { enqueueSnackbar} = useSnackbar();
    const [house, setHouse] = React.useState('');
    const [room,setRoom] = useState([]);
    const [roomInput,setRoomInput] = useState('');
    const schema = yup.object({
        room_id : yup.string().required("Vui lòng điền thông tin !"),
       from_time : yup.string().required("Vui lòng điền thông tin !"),
       to_time : yup.string().required("Vui lòng điền thông tin !"),
      })

    
    const form = useForm({
        defaultValues : {
            room_id : "",
            from_time : "",
            to_time : ""
        },
        resolver: yupResolver(schema)
    })

    const dataUser = useSelector(state => state.user.user)
    const handleSubmitForm = async (value) => {
        value.idUser = dataUser.id;
        value.nameUser = dataUser.fullname
        try {
            const data = await normalApi.rentOne(value);
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

    
    const handleChangeRoomInput = (e) => {
        setRoomInput(e.target.value)
        form.setValue("room_id",e.target.value)
    }
    return (
        <div className='FormRentOne-container'>
            <div className='FormRentOne-content'>
                <p className='header'>Tính tiền phòng</p>
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
                        <div className='FormRentOne-container-button'>
                            <div className='button' onClick={onCloseDiagram}>
                                <Button variant="outlined" type='submit'>Hủy</Button>
                            </div>
                            <div className='button'>
                                <Button variant="contained" type='submit'>Tính tiền</Button>
                            </div>
                        </div>
                </form>
            </div>
        </div>
    );
}

export default FormRentOne;