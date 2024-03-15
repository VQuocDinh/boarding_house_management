import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style.css'
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import FormAddDeposit from './Components/FormAddDeposit';
import normalApi from '../../Api/normalApi';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Moment from 'react-moment';
import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/CalendarMonth';
import FormDelete from '../../Components/FormDelete';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
function DepositPage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const globalValue = useRef()
    const [statusForm,setStatusForm] = useState()
    const [open, setOpen] = React.useState(false);
    const [houseData,setHouseData] = useState([])
    const [house, setHouse] = React.useState('');
    const [depositData,setDepositData] = useState([])
    const [statusDepo,setStatusDepo] = useState([])

    const [valueTime, setValueTime] = React.useState();
    const date = new Date();
    const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const [filter,setFilter] = useState({
        limit : 10,
        page : 1,
        time : StringValue,
        status : 1
    })


    const [depo,setDepo] = useState(1);
    const handleChangeDepo = (event) => {
        setDepo(event.target.value);
        setFilter(x => ({
            ...x,
            status : event.target.value
        }))
    }

    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
        setFilter(x => ({
            ...x,
            page : value
        }))
    };
    const numberItem = useRef();
    const numbetPage = Math.ceil(numberItem.current/filter.limit)


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
            case 3: {
                setStatusForm(3)
                handleClickOpen()
                break;
            } 
            case 4: {
                setStatusForm(4)
                handleClickOpen()
                break;
            } 
        }
    }

    const handleChangeTime = (newValue) => {
        setValueTime(newValue);
        const StringValue = `${newValue?.$D}/${newValue?.$M + 1}/${newValue?.$y}`
        setFilter(x => ({
          ...x,
          time : StringValue
        }))
      };

    const handleChangeHouse = (event) => {
        setHouse(event.target.value);
        setFilter(x => ({
            ...x,
            house : event.target.value
        }))
      };

      

    const handleClearFilter = () => {
        setFilter({
            limit : 10,
            page : 1,
            time : StringValue,
            status : 1
        })
        setHouse("")
        setValueTime()
    }


    let arrayHouseData = useRef([])
    useEffect(() => {
        (async () => {
            try {
                const dataDeposit = await normalApi.getDeposit(filter);
                setDepositData(dataDeposit.data)
                numberItem.current = dataDeposit.count;
                console.log(dataDeposit);
                const dataStatusDepo = await normalApi.getDepositStatus();
                setStatusDepo(dataStatusDepo.data)
                const houseData = await normalApi.getHouse();
                arrayHouseData.current = houseData.data.filter(item => {return item.status == 1})
                setHouseData(houseData.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])

    const handleDeleteDeposit = async () => {
        const value = {
            id : globalValue.current.id,
            idRoom : globalValue.current.room_id
        }
        try {
            const data = await normalApi.deleteDeposit(value);
            setFilter(x => ({...x}))
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

    const handleCancelDeposit = async (item) => {
        const value = {
            id : globalValue.current.id,
            idRoom : globalValue.current.room_id
        }
        try {
            const data = await normalApi.cancelDeposit(value);
            setFilter(x => ({...x}))
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(depositData,"Danh sách phiếu cọc nhà","ListDepositBill")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <div className='depositPage-container'>
            <div className='depositPage-content'>
                <div className='header'>
                    <p>Cọc giữ phòng</p>
                    <div className='buttons'>
                        <div className='button' onClick={() => handleShowForm(1)}>
                            <Button variant="contained" endIcon={<AddIcon />}>Thêm phiếu đặt cọc</Button>
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
                        <div className='searchStatus'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={depo}
                                label="Trạng thái"
                                onChange={handleChangeDepo}
                                >
                                    {
                                        statusDepo.map(item => (
                                            <MenuItem value={item.id}>{item.status}</MenuItem>
                                        ))
                                    }
                                
                                </Select>
                            </FormControl>
                        </div>
                        <div className='clearFilter' onClick={handleClearFilter}>
                            <Button variant="contained" color="success">
                                Xóa các filter
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        <p>Ngày đặt</p>
                        <p>Nhà</p>
                        <p>Phòng</p>
                        <p>Id nhân viên</p>
                        <p>Tên nhân viên</p>
                        <p>Người đặt cọc</p>
                        <p>Số điện thoại</p>
                        <p>Tiền cọc</p>
                        <p>Ngày nhận phòng</p>
                        <p>Thiết lập</p>
                    </div>
                    <div className='content-list'>
                        {
                            depositData.map(item => (
                                <div className='content-item'>
                                    <div className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.time}
                                        </Moment>
                                    </div>
                                    <div className='item'>
                                        <p>{item.name_house}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.room_number}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.idUser}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.nameUser}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.name_person}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.phone_number}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.money_deposit}</p>
                                    </div>
                                    <div className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.day_come}
                                        </Moment>
                                    </div>
                                    <div className='item'>
                                        <div className='buttons'>
                                            {
                                                item.status == 1 && (
                                                    <>
                                                        <div className='icon' onClick={() => handleShowForm(2,item)}>
                                                            <EditIcon />
                                                        </div>
                                                        <div className='icon' onClick={() => handleShowForm(4,item)}>
                                                            <CancelPresentationIcon />
                                                        </div>
                                                    </>
                                                )
                                            }
                                            <div className='icon' onClick={() => handleShowForm(3,item)}>
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='pagination'>
                    <Pagination count={numbetPage} page={page} onChange={handleChange} color="primary"/>
                </div>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                   {statusForm == 1 && <FormAddDeposit dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter}/>}
                   {statusForm == 2 && <FormAddDeposit dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter} dataApi={globalValue.current} status="update"/>}
                   {statusForm == 3 && <FormDelete header="Xóa phiếu đặt cọc" content="Bạn có chắc chắn muốn xóa phiếu đặt cọc này ?" onCloseDiagram={handleClose} onSubmit={handleDeleteDeposit}/>}
                   {statusForm == 4 && <FormDelete header="Hủy phiếu đặt cọc" content="Bạn có chắc chắn muốn hủy phiếu đặt cọc này ?" onCloseDiagram={handleClose} onSubmit={handleCancelDeposit}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DepositPage;