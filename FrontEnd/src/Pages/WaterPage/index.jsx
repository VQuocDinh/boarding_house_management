import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AddIcon from '@mui/icons-material/Add';
import FormAddElectric from './Components/FormAddWater';
import { useSnackbar } from 'notistack';
import normalApi from '../../Api/normalApi';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import FormAddWater from './Components/FormAddWater';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
import Moment from 'react-moment';


function WaterPage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const globalValue = useRef();
    const [statusForm,setStatusForm] = useState();
    const [open, setOpen] = React.useState(false);
    const [statusRoom,setStatusRoom] = useState([]);
    const [dataBill,setDataBill] = useState([])
    const [valueTime, setValueTime] = React.useState();
    const date = new Date();
    const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const [filter,setFilter] = useState({
        page : 1,
        limit : 10,
        time : StringValue
    })
    let arrayHouseData = useRef([])
    const [page, setPage] = React.useState(filter.page);
    const numberItemBill = useRef();
    const numberPage = Math.ceil(numberItemBill.current / filter.limit)
    const handleChangePage = (event, value) => {
        setPage(value);
        setFilter(x => ({
            ...x,
            page : value
        }))
    };


    const [houseData,setHouseData] = useState([]);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleChangeTime = (newValue) => {
      setValueTime(newValue);
      const StringValue = `${newValue?.$D}/${newValue?.$M + 1}/${newValue?.$y}`
      setFilter(x => ({
        ...x,
        time : StringValue
      }))
    };

    const [house, setHouse] = React.useState('');

    const handleChangeHouse = (event) => {
        setHouse(event.target.value);
        setFilter(x => ({
            ...x,
            house : event.target.value
        }))
    };

    const [statusRoomSearch,setStatusRoomSearch] = useState('');
    const handleChangeStatusRoomSearch = (event) => {
        setStatusRoomSearch(event.target.value);
        setFilter(x => ({
            ...x,
            statusRoom : event.target.value
        }))
    };

    const handleShowForm = (value,item) => {
        globalValue.current = item;
        switch(value) {
            case 1: {
                setStatusForm(1)
                handleClickOpen()
                break;
            }
            case 2: {
                setStatusForm(2)
                handleClickOpen()
                break;
            }
          }
    }

    useEffect(() => {
        (async () => {
            try {
                const dataBill = await normalApi.getBillWater(filter);
                setDataBill(dataBill.data)
                numberItemBill.current = dataBill.count;
                const dataStatusRoom = await normalApi.getStatusRoom();
                setStatusRoom(dataStatusRoom.data)
                const houseData = await normalApi.getHouse();
                arrayHouseData.current = houseData.data.filter(item => {return item.status == 1})
                setHouseData(houseData.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])


    const handleClearFilter = () => {
        const date = new Date();
        const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        setFilter({
            page : 1,
            limit : 10,
            time : StringValue
        })
        setHouse("")
        setStatusRoomSearch('')
        setValueTime()
    }

    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(dataBill,"Danh sách hóa đơn nước tháng","ListWaterBill")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <div className='electricPage-container'>
            <div className='electricPage-content'>
                <div className='header'>
                    <p>Chỉ số nước</p>
                    <div className='buttons'>
                        <div className='button' onClick={() => handleShowForm(1)}>
                            <Button variant="contained" endIcon={<AddIcon />}>
                                Thêm phiếu nước
                            </Button>
                        </div>
                        <div className='button' onClick={handleToExcel}>
                                    <Button variant="contained" color="success" endIcon={<DescriptionIcon />}>Xuất file Excel</Button>
                        </div>
                    </div>
                </div>
                <div className='searchs'>
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

                    <div className='oneLine'>
                        <div className='searchHouse'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Nhà</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={house}
                                label="Nhà"
                                onChange={handleChangeHouse}
                                >
                                {
                                    houseData.map(item => (
                                        <MenuItem value={item.id}>{item.name_house}</MenuItem>
                                    ))
                                }
                                </Select>
                            </FormControl>
                        </div>
                        <div className='searchStatusRoom'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Trạng thái phòng</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={statusRoomSearch}
                                label="Trạng thái phòng"
                                onChange={handleChangeStatusRoomSearch}
                                >
                                {
                                    statusRoom.map(item => (
                                        <MenuItem value={item.id}>{item.status}</MenuItem>
                                    ))
                                }
                                </Select>
                            </FormControl>
                        </div>
                        <div className='button-clear' onClick={handleClearFilter}>
                            <Button variant="contained" color="success" endIcon={<FilterAltIcon />}>
                                Xóa các filter
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        <p>Tên nhà</p>
                        <p>Tên phòng</p>
                        <p>Id người thu</p>
                        <p>Tên người thu</p>
                        <p>Ngày bắt đầu</p>
                        <p>Ngày kết thúc</p>
                        <p>Số nước cũ</p>
                        <p>Số nước mới</p>
                        <p>Thành tiền</p>
                        <p>Thao tác</p>
                    </div>
                    <div className='content-list'>
                        {
                            dataBill.map(item => (
                                <div className='content-item'>
                                    <p className='item'>{item.name_house}</p>
                                    <p className='item'>{item.room_number}</p>
                                    <p className='item'>{item.idUser}</p>
                                    <p className='item'>{item.nameUser}</p>
                                    <p className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.from_time}
                                        </Moment>
                                    </p>
                                    <p className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.to_time}
                                        </Moment>
                                    </p>
                                    <p className='item'>{item.old}</p>
                                    <p className='item'>{item.new}</p>
                                    <p className='item'>{item.price}</p>
                                    <p className='item' onClick={() => handleShowForm(2,item)}>
                                        <div className='icon'>
                                            <EditIcon />
                                        </div>
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='pagination'>
                    <Pagination color="primary" count={numberPage} page={page} onChange={handleChangePage} />
                </div>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    {statusForm == 1 && <FormAddWater dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter}/>}
                    {statusForm == 2 && <FormAddWater dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} dataApi={globalValue.current} status="update" reLoad={setFilter}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default WaterPage;