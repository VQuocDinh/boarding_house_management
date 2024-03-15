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
import SelectField from '../../../../Components/Inputs/SelectField';
import adminApi from '../../../../Api/adminApi';
import { useSelector } from 'react-redux';


function FormAddArise({dataHouse,onCloseDiagram,dataApi = {},status,reLoad}) {
    const phoneRegExp = /^\d+$/
    const { enqueueSnackbar} = useSnackbar();
    const [house, setHouse] = React.useState('');
    const [room,setRoom] = useState([]);
    const arrayRoomCheck = useRef([]);
    useMemo(() => {
        if(dataApi?.room){
            const tempArray = dataApi.room.map(item => {return item.room_id});
            arrayRoomCheck.current = [...tempArray]
        }
    },[])
   
    const handleChange = async (event) => {
        setHouse(event.target.value);
        try {
            const value = {
                idRoom : event.target.value
            }
            const dataRoom = await normalApi.getRoom(value);
            const tempArray = dataRoom.data.filter(item => {return item.status_room !== 5})
            setRoom(tempArray)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    };



    const schema = yup.object({
        price: yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số tiền không hợp lệ'),
        time: yup.string().required("Vui lòng điền thông tin !"),
      })


      let stringTime;
      if(dataApi.time)
      {
          let date = new Date(dataApi.time);
          stringTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      }
    const form = useForm({
        defaultValues : {
            price : dataApi.price || "",
            time : stringTime || "",
            note : dataApi.note || ""
        },
        resolver: yupResolver(schema)
    })

    const stateUser = useSelector(state => state.user.user)
    const handleSubmitForm = async (value) => {
        value.room_id = arrayRoomCheck.current;
        value.idUser = stateUser.id;
        value.nameUser = stateUser.fullname;
        let data;
        try {
            if(status == "update")
            {
                value.id = dataApi.id;
                data = await normalApi.updateArise(value);
            }
            else{
                data = await normalApi.addArise(value);
            }
            reLoad(x => ({...x}))
            onCloseDiagram()
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

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
    return (
        <div className='formAddJob-container'>
            <div className='formAddJob-content'>
                <p className='header'>Công việc phát sinh</p>
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
                                onChange={handleChange}
                                >
                                {
                                    dataHouse.map(item => (
                                        <MenuItem value={item.id}>{item.name_house}</MenuItem>
                                    ))
                                }
                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                    <div className='input'>
                        <div className='rooms-list'>
                            <p >Phòng : </p>
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
                        <DateField name="time" label="Thời gian" form={form}/>
                    </div>

                    <div className='input'>
                        <InputField name='price' label="Số tiền" form={form} />
                    </div>
                    <div className='input'>
                        <InputFieldMutiline name="note" form={form} label="Nội dung" mutiline={true} row={10}/>
                    </div>
                    {
                            status == "update" && (
                                <div className='input update-note-form'>
                                    <p>{`Thay đổi dữ liệu phiếu có thể gây ra những biến đổi với phiếu tháng và báo cáo lời lỗ. 
                                    Khi thay đổi phiếu phát sinh, bạn cần tính toán lại hóa đơn tháng liên quan đến phiếu phát sinh đó!`}</p>
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

export default FormAddArise;