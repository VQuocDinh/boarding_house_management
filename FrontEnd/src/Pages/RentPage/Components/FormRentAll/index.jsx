import React, { useMemo, useRef, useState } from 'react';
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
import CheckField from '../../../../Components/Inputs/CheckField';

function FormRentAll({dataHouse=[],onCloseDiagram,reLoad}) {
    const { enqueueSnackbar} = useSnackbar();
    const [room,setRoom] = useState([]);
    const arrayRoomCheck = useRef([]);
    const [house, setHouse] = React.useState('');
    const schema = yup.object({
        house_id : yup.string().required("Vui lòng điền thông tin !"),
        month : yup.string().required("Vui lòng điền thông tin !")
      })

    
    const form = useForm({
        defaultValues : {
            house_id : "",
            month : "",
            special : false
        },
        resolver: yupResolver(schema)
    })

    const dataUser = useSelector(state => state.user.user)
    const handleSubmitForm = async (value) => {
        value.idUser = dataUser.id;
        value.nameUser = dataUser.fullname
        value.room_id = arrayRoomCheck.current;
        console.log(value);
        try {
            const data = await normalApi.rentAll(value);
            reLoad(x => ({...x}))
            onCloseDiagram()
            enqueueSnackbar(data.message,{variant : "success"}) 
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"}) 
        }
    }

    const handleChange = async (value) => {
        setHouse(value);
        form.setValue("house_id",value)
        arrayRoomCheck.current = []
        try {
            const valueSend = {
                idRoom : value
            }
            const dataRoom = await normalApi.getRoom(valueSend);
            const tempArray = dataRoom.data.filter(item => {return item.status_room !== 5})
            setRoom(tempArray)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    };

    const handleCheckRoom = (value,id) => {
        if(value)
        {
            if(!arrayRoomCheck.current.includes(id))
            {
                arrayRoomCheck.current.push(id)
            }
        }
        else
        {
            const tempArray = arrayRoomCheck.current.filter(item => {return item !== id});
            arrayRoomCheck.current = tempArray;
        }
    }

    const handleCheckSpecial = (value,id) => {   
            form.setValue("special",value)
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
                        <div className='rooms-list'>
                            <p>Trừ những nhà :</p>
                                {room?.map(item => (
                                    <div className='item'>
                                        {
                                            arrayRoomCheck.current.includes(item.id) ? <div key={item.id}><CheckField id={item.id} onChangeValue={handleCheckRoom} origin={true}/></div> : <div key={item.id}><CheckField id={item.id} onChangeValue={handleCheckRoom}/></div>
                                        }
                                        <p>{item.room_number}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='input'>
                            <div className='inputSpecial'>
                                <p>Trừ những phòng có tiền phát sinh :</p>
                                <CheckField onChangeValue={handleCheckSpecial} origin={false}/>
                            </div>
                        </div>
                        <div className='input'>
                            <DateNoDayField name='month' label="Tháng tính" form={form}/>
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

export default FormRentAll;