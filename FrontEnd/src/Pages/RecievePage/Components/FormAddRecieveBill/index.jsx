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
import InputFieldMutiline from '../../../../Components/Inputs/InputFieldMutiline';
import { useSelector } from 'react-redux';


function FormAddRecieveBill({dataHouse,onCloseDiagram,dataApi = {},status,reLoad}) {
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
            }
            const dataRoom = await normalApi.getRoom(value);
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
        form.setValue("room_id",event.target.value)
    }


    const phoneRegExp = /^\d+$/
    const schema = yup.object({
        room_id: yup.string().required("Vui lòng điền thông tin !"),
        time: yup.string().required("Vui lòng điền thông tin !"),
        price: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số tiền không hợp lệ'),
        receiver: yup.string().required("Vui lòng điền thông tin !"),
      })


    let stringTime;
    if(dataApi.time)
    {
        let date = new Date(dataApi.time);
        stringTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    const form = useForm({
        defaultValues : {
            room_id : dataApi.room_id || "",
            time : stringTime || "",
            price : dataApi.price || "",
            receiver : dataApi.receiver || "",
            reason : dataApi.reason || "",
        },
        resolver: yupResolver(schema)
    })

    const stateUser = useSelector(state => state.user.user)
    const handleSubmitForm = async (value) => {
        value.idUser = stateUser.id;
        value.nameUser = stateUser.fullname;
        let data;
        try {
            if(status == "update")
            {
                value.id = dataApi.id;
                data = await normalApi.updateRecieveBill(value);
            }
            else{
                data = await normalApi.addRecieveBill(value);
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
                <p className='header'>Phiếu thu</p>
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
                        <DateField name="time" label="Ngày thu" form={form}/>
                    </div>
                    <div className='input'>
                        <InputField name='price' label="Số tiền" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='receiver' label="Người đóng" form={form} />
                    </div>
                    <div className='input'>
                        <InputFieldMutiline name="reason" form={form} label="Lý do" mutiline={true} row={10}/>
                    </div>
                        {
                            status == "update" && (
                                <div className='input update-note-form'>
                                    <p>{`Thay đổi dữ liệu phiếu có thể gây ra những biến đổi với báo cáo lời lỗ. `}</p>
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

export default FormAddRecieveBill;