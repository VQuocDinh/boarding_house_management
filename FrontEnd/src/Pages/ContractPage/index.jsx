import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import normalApi from '../../Api/normalApi';
import { useSnackbar } from 'notistack';
import adminApi from '../../Api/adminApi';
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Pagination, Select, TextField } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Moment from 'react-moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';

function ContractPage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const [room,setRoom] = useState([])
    const [house, setHouse] = React.useState('');
    const [roomInput,setRoomInput] = useState('');
    const [houseData,setHouseData] = useState([]);
    const [statusInput,setStatusInput] = useState('');
    const [valueTime, setValueTime] = React.useState();
    const [dataContract,setDataContract] = useState([])
    const date = new Date();
    const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const [filter,setFilter] = useState({
        page : 1,
        limit : 10,
        time : StringValue
    })


    const handleChangeStatusInput = (value) => {
        setStatusInput(value);
        setFilter(x => ({
            ...x,
            status : value
          }))
    }

    const handleChangeTime = (newValue) => {
        setValueTime(newValue);
        const StringValue = `${newValue?.$D}/${newValue?.$M + 1}/${newValue?.$y}`
        setFilter(x => ({
          ...x,
          time : StringValue
        }))
      };
    const [page, setPage] = React.useState(1);
    const handleChangePage = (event, value) => {
        setPage(value);
        setFilter(x => ({
            ...x,
            page : value
        }))
    };
    const numberItem = useRef();
    const numbetPage = Math.ceil(numberItem.current/filter.limit)
    useEffect(() => {
        (async () => {
            try {
                const data = await adminApi.getContracts(filter);
                setDataContract(data.data);
                numberItem.current = data.count;
                console.log(data);
                const houseData = await normalApi.getHouse();
                setHouseData(houseData.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])

    const handleChange = async (value) => {
        setHouse(value);
        setFilter(x => ({
            ...x,
            house : value
        }))
        try {
            const valueSend = {
                idRoom :value
            }
            const dataRoom = await normalApi.getRoom(valueSend);
            console.log(dataRoom);
            setRoom(dataRoom.data)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    };
    const handleChangeRoom = async (value) => {
        setRoomInput(value);
        setFilter(x => ({
            ...x,
            room : value
        }))
    };
    const handleClearFilter = () => {
        setFilter({
            page : 1,
            limit : 10,
            time : StringValue
        })
        setRoomInput('')
        setHouse('')
        setValueTime()
        setStatusInput('')
    }
    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(dataContract,"Danh sách hợp đồng","ListElectricBill")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <div className='report_roomNotDone-container'>
            <div className='report_roomNotDone-content'>
                <div className='header'>
                    <p>Danh sách hợp đồng</p>
                    <div className='buttons'>
                        <div className='button-clear button' onClick={handleClearFilter}>
                                <Button variant="contained" color="success" endIcon={<FilterAltIcon />}>
                                    Xóa các filter
                                </Button>
                        </div>
                        <div className='button' onClick={handleToExcel}>
                                    <Button variant="contained" color="success" endIcon={<DescriptionIcon />}>Xuất file Excel</Button>
                            </div>
                    </div>
                </div>
                <div className='searchs'>
                    <div className='oneLine'>
                        <div className='searchMonth'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                label="Tháng/Năm"
                                inputFormat="MM/YYYY"
                                value={valueTime}
                                onChange={handleChangeTime}
                                renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className='searchStatus'>
                            <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={statusInput}
                                    label="Trạng thái"
                                    onChange={(event) => handleChangeStatusInput(event.target.value)}
                                    >
                                            <MenuItem value={0}>Đã hết hạn</MenuItem>
                                            <MenuItem value={1}>Chưa hết hạn</MenuItem>
                                    </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className='oneLine'>
                        <div className='searchHouse'>
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
                                        houseData.map(item => (
                                            <MenuItem value={item.id}>{item.status ? item.name_house : `${item.name_house} (Ngừng hoạt động)`}</MenuItem>
                                        ))
                                    }
                                    </Select>
                            </FormControl>
                        </div>
                        <div className='searchRoom'>
                            <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Phòng</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={roomInput}
                                    label="Phong"
                                    onChange={(event) => handleChangeRoom(event.target.value)}
                                    >
                                    {
                                        room.map(item => (
                                            <MenuItem value={item.id}>{item.room_number}</MenuItem>
                                        ))
                                    }
                                    </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className='content contract'>
                    <div className='header'>
                        <p>Nhà</p>
                        <p>Phòng</p>
                        <p>Ngày kí hợp đồng</p>
                        <p>Ngày kết thúc hợp đồng</p>
                        <p>{`Số tiền cọc (vnđ)`}</p>
                        <p>Nhân viên kí kết</p>
                        <p>Người thuê</p>
                        <p>Số điện thoại</p>
                        <p>Trạng thái</p>
                    </div>
                    <div className='content-list'>
                        {
                            dataContract.map(item => (
                                <div className='content-item'>
                                    <div className='item'>
                                        <p>{item.name_house}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.room_number}</p>
                                    </div>
                                    <div className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.contract_day}
                                        </Moment>
                                    </div>
                                    <div className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.contract_end}
                                        </Moment>
                                    </div>
                                    <div className='item'>
                                        <p>{item.deposit}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.nameUser}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.name}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.phone_number}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.isOnTime ? "Còn hiệu lực" : "Hết hạn"}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='pagination'>
                    <Pagination count={numbetPage} page={page} onChange={handleChangePage} color="primary"/>
                </div>
            </div>
        </div>
    );
}

export default ContractPage;