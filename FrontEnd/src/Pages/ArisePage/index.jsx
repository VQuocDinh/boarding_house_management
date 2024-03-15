import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style.css'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useSnackbar } from 'notistack';
import FormAddArise from './Components/FormAddArise';
import normalApi from '../../Api/normalApi';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import Moment from 'react-moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDelete from '../../Components/FormDelete';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
function ArisePage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const globalValue = useRef()
    const [statusForm,setStatusForm] = useState()
    const [open, setOpen] = React.useState(false);
    const [houseData,setHouseData] = useState([])
    const [valueTime, setValueTime] = React.useState();
    const [house, setHouse] = React.useState('');
    const [ariseData,setAriseData] = useState([]);
    const date = new Date();
    const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const [filter,setFilter] = useState({
        limit : 10,
        page : 1,
        time : StringValue
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
    let arrayHouseData = useRef([])
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

    useEffect(() => {
        (async () => {
            try {
                const dataArise = await normalApi.getArise(filter);
                setAriseData(dataArise.data)
                numberItem.current = dataArise.count;
                console.log(dataArise);
                const houseData = await normalApi.getHouse();
                arrayHouseData.current = houseData.data.filter(item => {return item.status == 1})
                setHouseData(houseData.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])

    const handleClearFilter = () => {
        setFilter({
            limit : 10,
            page : 1,
            time : StringValue
        })
        setName('')
        setHouse("")
        setValueTime()
    }

    const handleDeleteArise = async () => {
        const value = {
            id : globalValue.current
        }

        try {
            const data = await normalApi.deleteArise(value);
            setFilter(x => ({...x}))
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(ariseData,"Danh sách phiếu phát sinh","ListAriseBill")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <div className='arisePage-container'>
            <div className='arisePage-content'>
                <div className='header'>
                    <p>Danh sách phát sinh</p>
                    <div className='buttons'>
                        <div className='button' onClick={() => handleShowForm(1)}>
                            <Button variant="contained" endIcon={<AddIcon />}>Thêm phát sinh</Button>
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
                        <div className='noteSearch'>
                            <TextField
                                id="outlined-controlled"
                                label="Tên dịch vụ"
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
                        <p>Phòng</p>
                        <p>Mã nhân viên</p>
                        <p>Tên nhân viên</p>
                        <p>Diễn giải</p>
                        <p>Số tiền</p>
                        <p>Thời gian</p>
                        <p>Thiết lập</p>
                    </div>
                    <div className='content-list'>
                        {
                            ariseData.map(item =>(
                                <div className='content-item'>
                                    <div className='item'>
                                        <p>
                                            {
                                                item.room.map(item => (
                                                    <p>{`${item.name_house} : ${item.room_number}`}</p>
                                                ))
                                            }
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.idUser}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.nameUser}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.note}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.price}</p>
                                    </div>
                                    <div className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.time}
                                        </Moment>
                                    </div>
                                    <div className='item'>
                                        <div className='buttons'>
                                            <div className='icon' onClick={() => handleShowForm(2,item)}>
                                                <EditIcon />
                                            </div>
                                            {/* <div className='icon' onClick={() => handleShowForm(3,item.id)}>
                                                <DeleteIcon />
                                            </div> */}
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
                    {statusForm == 1 && <FormAddArise  dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter} />}
                    {statusForm == 2 && <FormAddArise  dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter} dataApi={globalValue.current} status="update"/>}
                    {statusForm == 3 && <FormDelete header="Xóa phiếu phát sinh" content="Xóa phiếu phát sinh sẽ ảnh hưởng đến tiền thu tháng khi tính toán lại phiếu !"  onSubmit={handleDeleteArise} onCloseDiagram={handleClose}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ArisePage;