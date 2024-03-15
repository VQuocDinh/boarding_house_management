import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style.css'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormAddJob from './Components/FormAddJob';
import normalApi from '../../Api/normalApi';
import { useSnackbar } from 'notistack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import Moment from 'react-moment';
import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import adminApi from '../../Api/adminApi';
import Box from '@mui/material/Box';
import DateField from '../../Components/Inputs/DateField';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
import FormDelete from '../../Components/FormDelete';
function JobPage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const globalValue = useRef();
    const [statusForm,setStatusForm] = useState();
    const [statusJob,setStatusJob] = useState([])
    const [houseData,setHouseData] = useState([])
    const [statusSearch, setstatusSearch] = React.useState(1);
    const [dataJobApi,setDataJobApi] = useState([])
    const [valueTime, setValueTime] = React.useState();
    const date = new Date();
    const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const [filter,setFilter] = useState({
        limit : 10,
        page : 1,
        status : 1,
        time : StringValue
    })
    const [count,setCount] = useState();
    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
        setFilter(x => ({
            ...x,
            page : value
        }))
    };
    const numberPage = Math.ceil(count/filter.limit)

    const [open, setOpen] = React.useState(false);
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


    

    const handleChangeStatusSearch = (event) => {
        setstatusSearch(event.target.value);
        setFilter(x => ({
            ...x,
            status : event.target.value
        }))
    };

    const [name, setName] = React.useState('');
    const handleChangeNoteSearch = (e) => {
        setName(e.target.value);
    }
    const handleSearchNote = () => {
        setFilter(x => ({
            ...x,
            note : name
        }))
    }
    let arrayHouseData = useRef([])
    useEffect(() => {
        (async () => {
            try {
                const dataJob = await normalApi.getJobs(filter);
                setDataJobApi(dataJob.data)
                setCount(dataJob.count)
                const dataStatus = await normalApi.getJobStatus();
                setStatusJob(dataStatus.data)
                const houseData = await normalApi.getHouse();
                arrayHouseData.current = houseData.data.filter(item => {return item.status == 1})
                setHouseData(houseData.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])


    const handleDeleteJob = async () => {
        const value = {
            idJob : globalValue.current
        }
        try {
            const data = await adminApi.deleteJob(value);
            setFilter(x => ({...x}))
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }


    const TimeDoneGlobal = useRef(StringValue);
    const [doneStatus, setDoneStatus] = React.useState(1);
    const [valueDone,setValueDone] = useState()
    const handleChangeDoneStatus = (event) => {
        setDoneStatus(event.target.value);
    };
    const handleChangeTimeDone = (newValue) => {
        setValueDone(newValue);
        const StringValue = `${newValue?.$D}/${newValue?.$M + 1}/${newValue?.$y}`
        TimeDoneGlobal.current = StringValue;
    };

    const handleDoneTime = async (item) => {
        const value = {
            idJob : item.id,
            statusJob : doneStatus,
            timeDone : TimeDoneGlobal.current,
            room : item.room
        }
        try {
            const data = await normalApi.doneJob(value);
            setFilter(x => ({
                ...x
            }))
            handleClose()
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(dataJobApi,"Danh công việc tháng","ListJob")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
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
    return (
        <div className='jobPage-container'>
            <div className='jobPage-content'>
                <div className='header'>
                    <p>Công việc</p>
                    <div className='buttons'>
                        <div className='button'>
                            <Button variant="outlined">Lọc</Button>
                        </div>
                        <div className='button' onClick={() => handleShowForm(1)}>
                            <Button variant="contained">Thêm việc</Button>
                        </div>
                        <div className='button' onClick={handleToExcel}>
                                <Button variant="contained" color="success" endIcon={<DescriptionIcon />}>Xuất file Excel</Button>
                        </div>
                    </div>
                </div>

                <div className='searchs'>
                    <div className='lineOne'>
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
                    </div>
                    <div className='lineTwo'>
                        <div className='status'>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-standard-label">Trạng thái</InputLabel>
                                <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={statusSearch}
                                onChange={handleChangeStatusSearch}
                                label="Trạng thái"
                                >
                                {
                                    statusJob.map(item => (
                                        <MenuItem key={item.id} value={item.id}>{item.status}</MenuItem>
                                    ))
                                }
                                </Select>
                            </FormControl>
                        </div>
                        <div className='name'>
                            <TextField
                                id="outlined-controlled"
                                label="Công việc"
                                value={name}
                                onChange={handleChangeNoteSearch}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start" onClick={handleSearchNote}>
                                        <SearchIcon />
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        <p>Ngày</p>
                        <p>Phòng</p>
                        <p>Nội dung</p>
                        <p>Giải quyết</p>
                        <p>Trạng thái</p>
                        <p>Ngày hoàn thành</p>
                        <p>Thiết lập</p>
                    </div>
                    <div className='content-list'>
                        {
                            dataJobApi.map(item => (
                                <div className='content-item'>
                                    <div className='item'>
                                    <Moment format="DD/MM/YYYY">
                                        {item.time}
                                    </Moment>
                                    </div>
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
                                        <p>{item.describe}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.solution}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.todolist_status}</p>
                                    </div>
                                    <div className='item'>
                                        {
                                            item.done_time ? 
                                            (<Moment format="DD/MM/YYYY">
                                            {item.done_time}
                                            </Moment>)
                                            :
                                            <p>{""}</p>
                                        }
                                    </div>
                                    <div className='item'>
                                        <div className='buttons'>
                                            <div className='button' onClick={() => handleShowForm(2,item)}>
                                                <EditIcon/>
                                            </div>
                                            <div className='button' onClick={() => handleShowForm(4,item.id)}>
                                                <DeleteIcon />
                                            </div>
                                            <div className='button' onClick={() => handleShowForm(3,item)}>
                                                <EventAvailableIcon />
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
                    {statusForm == 1 && <FormAddJob dataStatusJob={statusJob} dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter}/>}
                    {statusForm == 2 && <FormAddJob dataStatusJob={statusJob} dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} dataApi={globalValue.current} status="update" reLoad={setFilter}/>}
                    {
                        statusForm == 3 && (
                            <div className='formDone-cotainer'>
                                <div className='content'>
                                    <p className='header'>Kết việc</p>
                                    <div className='done'>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={doneStatus}
                                            label="Trạng thái"
                                            onChange={handleChangeDoneStatus}
                                            >
                                                {
                                                    statusJob.map(item => (
                                                        <MenuItem value={item.id}>{item.status}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='DayDone'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                            label="Thời điểm hoàn thành"
                                            inputFormat="DD/MM/YYYY"
                                            value={valueDone}
                                            onChange={handleChangeTimeDone}
                                            renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className='button' onClick={() => handleDoneTime(globalValue.current)}>
                                            <Button variant="contained">Lưu</Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {statusForm == 4 && <FormDelete header="Xóa phiếu công việc" content="Xóa dữ liệu sẽ không thể khôi phục lại !"  onSubmit={handleDeleteJob} onCloseDiagram={handleClose}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default JobPage;