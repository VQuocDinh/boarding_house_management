import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style.css'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import normalApi from '../../Api/normalApi';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import Moment from 'react-moment';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import adminApi from '../../Api/adminApi';
import FormDelete from '../../Components/FormDelete';
import FormAddRecieveBill from './Components/FormAddRecieveBill';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShowDetailRecieve from './Components/ShowDetail';

function RecievePage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const [statusForm,setStatusForm] = useState()
    const [open, setOpen] = React.useState(false);
    const globalValue = useRef()
    const [houseData,setHouseData] = useState([])
    const [house, setHouse] = React.useState('');
    const [valueTime, setValueTime] = React.useState();
    const [dataRecieveBill,setDataRecieveBill] = useState([]);
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

    const [name, setName] = React.useState('');
    const handleSearchNote = () => {
        setFilter(x => ({
            ...x,
            note : name
        }))
    }
    const onChangeSearchNote = (e) =>{
        setName(e.target.value);
    }

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
    let arrayHouseData = useRef([])
    useEffect(() => {
        (async () => {
            try {
                const dataRecieveBill = await normalApi.getRecieveBill(filter)
                setDataRecieveBill(dataRecieveBill.data)
                console.log(dataRecieveBill.data);
                numberItem.current = (dataRecieveBill.count)
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
        setName("")
    }

    const handleDeleteRecieveBill = async () => {
        const value = {
            id : globalValue.current
        }
        try {
            const data = await adminApi.deleteRecieveBill(value);
            setFilter(x => ({...x}))
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(dataRecieveBill,"Danh sách phiếu thu","ListRecieveBill")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }

    return (
        <div className='spendPage-container'>
            <div className='spendPage-content'>
                <div className='header'>
                    <p>Phiếu thu</p>
                    <div className='buttons'>
                        <div className='button' onClick={() => handleShowForm(1)}>
                            <Button variant="contained" endIcon={<AddIcon />}>Thêm phiếu thu</Button>
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
                        <div className='searchNote'>
                            <TextField
                                id="outlined-controlled"
                                label="Tìm kiếm nội dung"
                                value={name}
                                onChange={onChangeSearchNote}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start" onClick={handleSearchNote}>
                                        <SearchIcon />
                                    </InputAdornment>
                                    ),
                                }}
                            />
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
                        <p>Người nộp tiền</p>
                        <p>Thời gian</p>
                        <p>Số tiền</p>
                        <p>Lý do</p>
                        <p>Thiết lập</p>
                    </div>
                    <div className='content-list'>
                        {
                            dataRecieveBill.map(item => (
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
                                        <p>{item.receiver}</p>
                                    </div><div className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.time}
                                        </Moment>
                                    </div>
                                    <div className='item'>
                                        <p>{item.price}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.reason}</p>
                                    </div>
                                    <div className='item'>
                                        <div className='buttons'>
                                            <div className='button' onClick={() => handleShowForm(2,item)}>
                                                <EditIcon />
                                            </div>
                                            {/* <div className='button' onClick={() => handleShowForm(3,item.id)}>
                                                <DeleteIcon />
                                            </div>   */}
                                            <div className='button' onClick={() => handleShowForm(4,item)}>
                                                <RemoveRedEyeIcon />
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
                    {statusForm == 1 && <FormAddRecieveBill dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter}/>}
                    {statusForm == 2 && <FormAddRecieveBill dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter} dataApi={globalValue.current} status="update"/>}
                    {statusForm == 3 && <FormDelete header="Xóa phiếu thu" content="Khi xóa sẽ không thể khôi phục, dữ liệu khi tính lại chi phí lời lỗ phòng sẽ thay đổi." onCloseDiagram={handleClose}  onSubmit={handleDeleteRecieveBill}/>}
                    {statusForm == 4 && <ShowDetailRecieve data={globalValue.current} onCloseDiagram={handleClose}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default RecievePage;