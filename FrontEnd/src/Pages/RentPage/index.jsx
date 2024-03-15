import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import normalApi from '../../Api/normalApi';
import { Button, Pagination } from '@mui/material';
import FormRentOne from './Components/FormRentOne';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PaidIcon from '@mui/icons-material/Paid';
import DiscountIcon from '@mui/icons-material/Discount';
import Moment from 'react-moment';
import ShowDetailRent from './Components/ShowDetailRent';
import PayMoney from './Components/PayMoney';
import FormAddDiscount from './Components/FormAddDiscount';
import FormRentAll from './Components/FormRentAll';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
function RentPage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const [statusForm,setStatusForm] = useState()
    const [open, setOpen] = React.useState(false);
    const [houseData,setHouseData] = useState([])
    const [house, setHouse] = React.useState('');
    const [valueTime, setValueTime] = React.useState();
    const [dataRentApi,setDataRentApi] = useState([])
    const globalValue = useRef()
    const date = new Date();
    const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const [filter,setFilter] = useState({
        limit : 10,
        page : 1,
        time : StringValue,
    })

    const numberItem = useRef();
    const numberPage = Math.ceil(numberItem.current/filter.limit)

    const [page, setPage] = React.useState(filter.page);
    const handleChange = (event, value) => {
        setPage(value);
        setFilter(x => ({
            ...x,
            page : value
        }))
    };

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
            case 5: {
                setStatusForm(5)
                handleClickOpen()
                break;
            } 
        }
    }
    let arrayHouseData = useRef([])
    useEffect(() => {
        (async () => {
            try {
                const dataRent = await normalApi.getRent(filter);
                setDataRentApi(dataRent.data)
                numberItem.current = dataRent.count
                console.log(dataRent);
                const houseData = await normalApi.getHouse();
                arrayHouseData.current = houseData.data.filter(item => {return item.status == 1})
                setHouseData(houseData.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])

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
            time : StringValue
        })
        setHouse("")
        setValueTime()
    }
    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(dataRentApi,"Danh sách hóa đơn tháng","ListRent")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <div className='rentPage-container'>
            <div className='rentPage-content'>
                <div className='header'>
                    <p>Tính tiền tháng</p>
                    <div className='buttons'>
                        <div className='button' onClick={() => handleShowForm(1)}> 
                            <Button variant="contained" endIcon={<AddIcon />}>Tạo hóa đơn tháng</Button>
                        </div>
                        {/* <div className='button' onClick={() => handleShowForm(5)}> 
                            <Button variant="contained" endIcon={<AddIcon />}>Tính tiền tháng theo nhà</Button>
                        </div> */}
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
                        <div className='clearFilter' onClick={handleClearFilter}>
                            <Button variant="contained" color="success">
                                Xóa các filter
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='content'>
                            <div className='header'>
                                <p>Nhà</p>
                                <p>Phòng</p>
                                <p>Tên nhân viên</p>
                                <p>{`Số tiền tháng(vnđ)`}</p>
                                <p>{`Số tiền đã giảm(vnđ)`}</p>
                                <p>{`Số tiền đã trả(vnđ)`}</p>
                                <p>{`Số tiền cần đóng(vnđ)`}</p>
                                <p>Ngày đóng</p>
                                <p>Thiếp lập</p>
                            </div>
                        <div className='content-list'>
                                {
                                    dataRentApi.map(item => (
                                        <div className='content-item'>
                                            <div className='item'>
                                                <p>{item.name_house}</p>
                                            </div>
                                            <div className='item'>
                                                <p>{item.room_number}</p>
                                            </div>
                                            <div className='item'>
                                                <p>{item.nameUser}</p>
                                            </div>
                                            <div className='item'>
                                                <p>{item.money_need}</p>
                                            </div>
                                            <div className='item'>
                                                <p>{item.arise}</p>
                                            </div>
                                            <div className='item'>
                                                <p>{item.money_do ? item.money_do : 0}</p>
                                            </div>
                                            <div className='item'>
                                                <p>{item.money_do ? item.money_need - item.money_do : item.money_need}</p>
                                            </div>
                                            <div className='item'>
                                                {
                                                    item.current_time ? 
                                                    <Moment format="DD/MM/YYYY">
                                                        {item.current_time}
                                                    </Moment>
                                                    : ""
                                                
                                                }
                                            </div>
                                            <div className='item'>
                                                <div className='buttons'>
                                                    <div className='icon' onClick={() => handleShowForm(2,item)}>
                                                        <RemoveRedEyeIcon />
                                                    </div>
                                                    <div className='icon' onClick={() => handleShowForm(3,item)}>
                                                        <PaidIcon />
                                                    </div>
                                                    <div className='icon' onClick={() => handleShowForm(4,item)}>
                                                        <DiscountIcon />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                        </div>
                    </div>
                    <div className='pagination'>
                        <Pagination count={numberPage} page={page} onChange={handleChange} color="primary"/>
                    </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    {statusForm == 1 && <FormRentOne dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter}/>}
                    {statusForm == 2 && <ShowDetailRent data = {globalValue.current} onCloseDiagram={handleClose}/>}
                    {statusForm == 3 && <PayMoney dataApi = {globalValue.current} onCloseDiagram={handleClose} reLoad={setFilter}/>}
                    {statusForm == 4 && <FormAddDiscount dataApi = {globalValue.current} onCloseDiagram={handleClose} reLoad={setFilter}/>}
                    {statusForm == 5 && <FormRentAll dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default RentPage;