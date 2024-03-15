import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style.css'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import normalApi from '../../Api/normalApi';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormAddAsset from './Components/FormAddAsset';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Moment from 'react-moment';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import adminApi from '../../Api/adminApi';
import FormDelete from '../../Components/FormDelete';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
function AssetPage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const [statusForm,setStatusForm] = useState()
    const [open, setOpen] = React.useState(false);
    const [houseData,setHouseData] = useState([])
    const [dataRoom,setDataRoom] = useState([]);
    const [room,setRoom] = useState("");
    const [house, setHouse] = React.useState('');
    const [status,setStatus] = useState(1);
    const [assetData,setAssetData] = useState([])
    const globalValue = useRef()
    const [filter,setFilter] = useState({
        limit : 10,
        page : 1,
        status : 1
    })
    const [name, setName] = React.useState('');
    const handleSearchNote = () => {
        setFilter(x => ({
            ...x,
            name : name
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
    let arrayHouseData = useRef([])
    useEffect(() => {
        (async () => {
            try {
                const assetData = await normalApi.getAsset(filter);
                setAssetData(assetData.data)
                numberItem.current = assetData.count
                const houseData = await normalApi.getHouse();
                arrayHouseData.current = houseData.data.filter(item => {return item.status == 1})
                setHouseData(houseData.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])

    const handleChangeHouse = async (event) => {
        setHouse(event.target.value);
        setFilter(x => ({
            ...x,
            house : event.target.value
        }))
        try {
            const value = {
                idRoom :  event.target.value,
            }
            const dataRoom = await normalApi.getRoom(value);
            setDataRoom(dataRoom.data)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
      };

    const handleChangeRoom = (event) => {
        setRoom(event.target.value);
        setFilter(x => ({
            ...x,
            room : event.target.value
        }))
    }

    const handleChangeStatus = (event) => {
        setStatus(event.target.value)
        setFilter(x => ({
            ...x,
            status : event.target.value
        }))
    }

    const handleClearFilter = () => {
        setFilter({
            limit : 10,
            page : 1,
            status : 1
        })
        setHouse("")
        setRoom('')
        setStatus(1)
        setName("")
    }

    const handleDeleteAsset = async () => {
        const value = {
            idAsset : globalValue.current
        }
        try {
            const data = await adminApi.deleteAsset(value);
            setFilter(x => ({...x}))
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(assetData,"Danh sách tài sản","ListAsset")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <div className='assetPage-container'>
            <div className='assetPage-content'>
                <div className='header'>
                    <p>Tài sản</p>
                    <div className='oneLine'>
                            <div className='button' onClick={() => handleShowForm(1)}>
                                <Button variant="contained" endIcon={<AddIcon />}>Thêm tài sản</Button>
                            </div>
                            <div className='button-clear' onClick={handleClearFilter}>
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
                        <div className='searchRoom'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Phòng</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={room}
                                label="Phòng"
                                onChange={handleChangeRoom}
                                >
                                    {
                                        dataRoom.map(item => (
                                            <MenuItem key={item.id} value={item.id}>{item.room_number}</MenuItem>
                                        ))
                                    }
                                
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className='oneLine'>
                        <div className='searchHouse'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Trạng thái"
                                onChange={handleChangeStatus}
                                >
                                    <MenuItem value={1}>{"Đang sử dụng"}</MenuItem>
                                    <MenuItem value={0}>{"Ngưng sử dụng"}</MenuItem>
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
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        <p>Nhà</p>
                        <p>Phòng</p>
                        <p>Nhân viên</p>
                        <p>Tên tài sản</p>
                        <p>Ngày bắt đầu</p>
                        <p>Ngày cập nhật</p>
                        <p>Số lượng</p>
                        <p>Số lượng còn lại</p>
                        <p>{`Giá(1 đơn vị) `}</p>
                        <p>Setting</p>
                    </div>
                    <div className='content-list'>
                        {
                            assetData.map(item => (
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
                                        <p>{item.name}</p>
                                    </div>
                                    <div className='item'>
                                        <Moment format="DD/MM/YYYY">
                                            {item.day_start}
                                        </Moment>
                                    </div>
                                    <div className='item'>
                                        {
                                            item.day_end ? 
                                            (<Moment format="DD/MM/YYYY">
                                            {item.day_end}
                                            </Moment>)
                                            : ""
                                        }   
                                    </div>
                                    <div className='item'>
                                        <p>{item.number}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.number_now}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.price}</p>
                                    </div>
                                    <div className='item'>
                                        <div className='buttons'>
                                            <div className='icon' onClick={() => handleShowForm(2,item)}>
                                                <EditIcon />
                                            </div>
                                            <div className='icon' onClick={() => handleShowForm(3,item.id)}>
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
                    {statusForm == 1 && <FormAddAsset dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter}/>}
                    {statusForm == 2 && <FormAddAsset dataHouse={arrayHouseData.current} onCloseDiagram={handleClose} reLoad={setFilter} dataApi={globalValue.current} status="update"/>}
                    {statusForm == 3 && <FormDelete header="Xóa tài sản" content="Sau khi xóa sẽ không thể khôi phục dữ liệu ?" onCloseDiagram={handleClose} onSubmit={handleDeleteAsset}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AssetPage;