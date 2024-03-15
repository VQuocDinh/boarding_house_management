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
import FormEditGuess from './Components/FormEditGuess';
import FormDelete from '../../Components/FormDelete';
import SearchIcon from '@mui/icons-material/Search';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
function Report_guess(props) {
    const { enqueueSnackbar} = useSnackbar();
    const [statusForm,setStatusForm] = useState();
    const [open, setOpen] = React.useState(false);
    const [room,setRoom] = useState([])
    const [house, setHouse] = React.useState('');
    const [statusUser,setStatusUser] = useState('');
    const [roomInput,setRoomInput] = useState('');
    const [dataGuess,setDataGuess] = useState([])
    const globalValue = useRef();
    const [filter,setFilter] = useState({
        page : 1,
        limit : 10,
    })

    const [nameService, setNameService] = React.useState('');
    const handleSearchService = () => {
        setFilter(x => ({
            ...x,
            name : nameService
        }))
    }
    const onChangeSearchService = (e) =>{
        setNameService(e.target.value);
    }

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


    const handleChangeStatusUser = async (event) => {
        const value = event.target.value;
        setStatusUser(value);
        setFilter(x => ({
            ...x,
            status : value
        }))
    }

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

    

    const [houseData,setHouseData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await adminApi.getGuessReport(filter);
                setDataGuess(data.data)
                numberItem.current = data.count;
                console.log(data);
                const houseData = await normalApi.getHouse();
                setHouseData(houseData.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])

    const handleClearFilter = () => {
        setFilter({
            page : 1,
            limit : 10
        })
        setStatusUser('')
        setRoomInput('')
        setHouse('')
    }

    const handleShowForm = async (value,item) => {
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteGuess =async () => {
        const value = {id : globalValue.current};
        try {
            const data = await adminApi.deleteMemberInReport(value);
            setFilter(x => ({...x}))
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(dataGuess,"Danh sách khách thuê","ListGuess")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <div className='report_guess-container'>
            <div className='report_guess-content'>
                <div className='header'>
                    <p>Danh sách khách thuê phòng</p>
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
                                    label="Phòng"
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
                    <div className='oneLine'>
                        <div className='searchStatus'>
                            <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={statusUser}
                                    label="Trạng thái"
                                    onChange={handleChangeStatusUser}
                                    >
                                        <MenuItem value={0}>{"Đã trả phòng"}</MenuItem>
                                        <MenuItem value={1}>{"Đang ở"}</MenuItem>
                                    </Select>
                            </FormControl>
                        </div>
                        <div className='search-name search'>
                            <TextField
                                id="outlined-controlled"
                                label="Tìm kiếm tên khách hàng"
                                value={nameService}
                                onChange={onChangeSearchService}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start" onClick={handleSearchService}>
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
                        <p>Họ tên khách</p>
                        <p>Địa chỉ</p>
                        <p>Số điện thoại</p>
                        <p>Nhà</p>
                        <p>Phòng</p>
                        <p>Từ ngày</p>
                        <p>Đến ngày</p>
                        <p>Trạng thái</p>
                        <p>Thiết lập</p>
                    </div>
                    <div className='content-list'>
                        {
                            dataGuess.map(item => (
                                <div className='content-item'>
                                    <div className='item'>
                                        <p>{item.name}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.permanent_address}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.phone_number}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.name_house}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.room_number}</p>
                                    </div>
                                    <div className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.time_start}
                                        </Moment>
                                    </div>
                                    <div className='item'>
                                        {
                                            item.time_end ?
                                            <Moment format="DD/MM/YYYY">
                                                {item.time_end}
                                            </Moment>
                                            : 'Chưa rời đi'
                                        }
                                    </div>
                                    <div className='item'>
                                        <p>{item.status ? "Đang ở" : "Đã trả phòng"}</p>
                                    </div>
                                    <div className='item'>
                                        <div className='buttons'>
                                            <div className='button' onClick={() => handleShowForm(1,item)}>
                                                <EditIcon />
                                            </div>
                                            {
                                                !item.contractId && (
                                                    <div className='button' onClick={() => handleShowForm(2,item.id)}>
                                                        <DeleteIcon />
                                                    </div>
                                                )
                                            }
                                        </div>
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    {statusForm == 1 && <FormEditGuess dataApi={globalValue.current} onCloseDiagram={handleClose} reload={setFilter}/>}
                    {statusForm == 2 && <FormDelete header="Xóa thông tin khách hàng" content="Sau khi xóa sẽ không thể khôi phục dữ liệu !!!" onSubmit={handleDeleteGuess} onCloseDiagram={handleClose}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Report_guess;