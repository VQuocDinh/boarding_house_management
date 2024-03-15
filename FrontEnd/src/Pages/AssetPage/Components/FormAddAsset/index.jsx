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
import SelectField from '../../../../Components/Inputs/SelectField';


function FormAddAsset({dataHouse,onCloseDiagram,dataApi = {},status,reLoad}) {
    console.log(dataApi);
    const { enqueueSnackbar} = useSnackbar();
    const [house, setHouse] = React.useState(() => {return dataApi.houseId ? dataApi.houseId : ''});
    const [room,setRoom] = useState([]);
    const [roomInput,setRoomInput] = useState(() => {return dataApi.room_id ? dataApi.room_id : ''});
    // const ItemCanAdd = useRef(false)
    const [statusIsEnd,setStatusIsEnd] = useState(1);

    const handleChange = async (valueInput) => {
        // if(dataApi.houseId && dataApi.houseId == valueInput)
        // {
        //     ItemCanAdd.current = true;
        // }
        // else
        // {
        //     ItemCanAdd.current = false;
        // }
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
        room_id : yup.string().required("Vui lòng điền thông tin !"),
        name : yup.string().required("Vui lòng điền thông tin !"),
        price : yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số tiền không hợp lệ'),
        number : yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số lượng không hợp lệ'),
        number_now : yup.string().required("Vui lòng điền thông tin !").matches(phoneRegExp, 'Số lượng không hợp lệ'),
        day_start : yup.string().required("Vui lòng điền thông tin !"),
      })

    let stringTime,stringDayEnd;
    if(dataApi.name)
    {
        let date = new Date(dataApi.day_start);
        stringTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        date = new Date(dataApi.day_end);
        stringDayEnd = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    const form = useForm({
        defaultValues : {
            room_id : dataApi.room_id || "",
            name : dataApi.name || "",
            price : dataApi.price || "",
            number : dataApi.number || "",
            number_now : dataApi.number_now || "",
            day_start : stringTime || "",
            note : dataApi.note || "",
            isEnd : dataApi.isEnd || 1,
            day_end : stringDayEnd || ""
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
                data = await normalApi.updateAsset(value);
            }
            else{
                data = await normalApi.addAsset(value);
            }
            reLoad(x => ({...x}))
            onCloseDiagram()
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    const handleChangeStatus = (event) => {
        setStatusIsEnd(event.target.value)
        form.setValue("isEnd",event.target.value)
        if(event.target.value)
        {
            const date = new Date();
            const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            form.setValue("day_end",StringValue)
        }
        else{
            form.setValue("day_end","")
        }
    }

    
    return (
        <div className='formAddJob-container'>
            <div className='formAddJob-content'>
                <p className='header'>Phiếu chi</p>
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
                                {/* {ItemCanAdd.current && <MenuItem key={dataApi.room_id} value={dataApi.room_id}>{dataApi.room_number}</MenuItem>} */}
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
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={statusIsEnd}
                                label="Trạng thái"
                                onChange={handleChangeStatus}
                                >
                                    <MenuItem value={1}>{"Đang sử dụng"}</MenuItem>
                                    <MenuItem value={0}>{"Ngưng sử dụng"}</MenuItem>
                                </Select>
                            </FormControl>
                    </div>
                    <div className='input'>
                        <DateField name="day_start" label="Ngày bắt đầu sử dụng" form={form}/>
                    </div>
                    <div className='input'>
                        <InputField name='name' label="Tên tài sản" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='price' label="Giá tiền 1 đơn vị" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='number' label="Số lượng" form={form} />
                    </div>
                    <div className='input'>
                        <InputField name='number_now' label="Số lượng hiện tại" form={form} />
                    </div>
                    <div className='input'>
                        <InputFieldMutiline name="note" form={form} label="Lưu ý" mutiline={true} row={10}/>
                    </div>
                    <div className='formChangePass-container-button'>
                        <Button variant="contained" type='submit'>Lưu</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormAddAsset;