import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormAddHouse from './Components/FormAddHouse';
import { useSnackbar } from 'notistack';
import normalApi from '../../Api/normalApi';
import EditIcon from '@mui/icons-material/Edit';
import SwitchInput from '../../Components/Inputs/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import adminApi from '../../Api/adminApi';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import FormaddRoom from './Components/FormAddRoom';
import FormShowRoom from './Components/FormShowRoom';
import FormAddGuess from './Components/FormAddGuess';
import FormAddServiceRoom from './Components/FormAddServiceRoom';
import FormAddMemberInHouse from './Components/FormAddMemberInHouse';
import FormMainAddMember from './Components/FormMainAddMember';
import { useSelector } from 'react-redux';
function HousePage(props) { 
    const { enqueueSnackbar} = useSnackbar();
    const [statusForm,setStatusForm] = useState();
    const [dataHouse,setDataHouse] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [statusRoom,SetStatusRoom] = useState([])
    const [dataRooms,setDataRooms] = useState([])
    const [dataService,setDataService] = useState([])
    const currentHouse = useRef();

    const temp = useSelector(state => state)
    console.log(temp,"ashdajd");
    const globalValueHouses = useRef([])
    const [filter,setFilter] = useState({
        status : 1
    })
    const filterRoom = useRef({
        idRoom : 1,
        status : 1
    })
    
    const globalValue = useRef();
    const [statusHouse, setStatusHouse] = React.useState(1);
    const [statusRoomCheck, SetStatusRoomCheck] = useState(1)
    const handleChange = (event) => {
        setStatusHouse(event.target.value);
        setFilter(x => ({
            ...x,
            status : event.target.value
        }))
    };


    const [nameHouse, setNameHouse] = React.useState('');
    const [nameRoom, setNameRoom] = React.useState('');
    const onChangeSearchHouseName = (e) =>{
        setNameHouse(e.target.value);
    }
    const handleSearcgNameHouse = () => {
        setFilter(x => ({
            ...x,
            name : nameHouse
        }))
    }


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        (async () => {
            try {
                const data = await normalApi.getHouse(filter);
                if(filter.status == 1){
                    globalValueHouses.current = data.data
                }
                const dataStatusRoom = await normalApi.getStatusRoom();
                const dataService = await normalApi.getService();
                setDataHouse(data.data)
                SetStatusRoom(dataStatusRoom.data)
                setDataService(dataService.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])

    const handleChangeSwitch = async (value,idUser,rollBack) => {
        const active = value ? 1 : 0;
        const dataSend = {
            id : idUser,
            status : active
        }
        try {
            const data = await adminApi.changeStatusHouse(dataSend);
            setFilter(x => ({...x}))
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            rollBack(!value)
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

    const Contract = useRef();
    const ServiceDetail = useRef();
    const MemberInHouse = useRef();
    const handleShowForm = async (value,item) => {
        globalValue.current = item;
        switch(value) {
            case 1: {
                setStatusForm(1)
                handleClickOpen()
                break;
            }
            case 2 : {
                setStatusForm(2)
                handleClickOpen()
                break;
            }
            case 3 : {
                setStatusForm(3)
                handleClickOpen()
                break;
            }
            case 4 : {
                setStatusForm(4)
                handleClickOpen()
                break;
            }
            case 5 : {
                setStatusForm(5)
                handleClickOpen()
                break;
            }
            case 6 : {
                setStatusForm(6)
                handleClickOpen()
                break;
            }
            case 7 : {
                try {
                    const dataConstract = await normalApi.getContract({roomId : globalValue.current});
                    Contract.current = dataConstract.data;
                    const dataServiceDetail = await normalApi.getServiceDetailRoom({roomId : globalValue.current});
                    ServiceDetail.current = dataServiceDetail.data
                    const dataMemberInHouse = await normalApi.getMemberInHouse({roomId : globalValue.current})
                    MemberInHouse.current = dataMemberInHouse.data;
                } catch (error) {
                    enqueueSnackbar(error.message,{variant : "error"})
                }
                setStatusForm(7)
                handleClickOpen()
                break;
            }
          }
    }
    // ------------------------------------------------------------------------

    const handleShowRooms = async (filter) => {
        currentHouse.current = filter;
        const tempObject = {...filterRoom.current,...filter}
        filterRoom.current = tempObject;
        try {
            const dataRoom = await normalApi.getRoom(filterRoom.current);
            setDataRooms(dataRoom.data)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

    const handleUpdateRoom = async (id) => {
        const value = {id : id}
        try {
            const data = await normalApi.getRoomDetail(value);
            handleShowForm(4,data.data[0])
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }


    const handleChangeRoomStatus = (event) => {
        SetStatusRoomCheck(event.target.value);
        handleShowRooms({
            status : event.target.value
        })
    };
    const onChangeSearchRoomName = (e) =>{
        setNameRoom(e.target.value);
    }
    const handleSearchRoomHouse = () => {
        handleShowRooms({
            name : nameRoom
        })
    }

    const handleShowRoom = async (id) => {
        const value = {id : id}
        try {
            const data = await normalApi.getRoomDetail(value);
            handleShowForm(5,data.data[0])
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

    const handChangeStatusRoom = async (idRoom,status) => {
        const value = {
            idRoom,
            status : status
        };
        try {
            const data = await adminApi.lockRoom(value);
            handleShowRooms({})
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

    const handleLeaveRoom = async (idRoom) => {
        const value = {
            idRoom
        };
        try {
            const data = await normalApi.leaveRoom(value);
            handleShowRooms({})
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

    const handleTakeRoom = async (idRoom) => {
        const value = {
            idRoom
        };
        try {
            const data = await normalApi.takeRoom(value);
            handleShowRooms({})
            handleShowForm(6,idRoom)
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    return (
        <div className='housePage-container'>
            <div className='housePage-content'>
                <div className='houses'>
                    <div className='lineOne'>
                        <p className="header">Danh sách nhà</p>
                        <div className='buttons'>
                            <div className='button-addHouse' onClick={() => handleShowForm(1)}>
                                <Button variant="contained" endIcon={<AddIcon />}>
                                    Thêm nhà
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='searchs'>
                        <div className='search-status search'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={statusHouse}
                                label="Trạng thái"
                                onChange={handleChange}
                                >
                                    <MenuItem value={0}>Ngưng hoạt động</MenuItem>
                                    <MenuItem value={1}>Hoạt động</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='search-name search'>
                            <TextField
                                id="outlined-controlled"
                                label="Tìm kiếm nhà theo tên"
                                value={nameHouse}
                                onChange={onChangeSearchHouseName}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start" onClick={handleSearcgNameHouse}>
                                        <SearchIcon />
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                    <div className='content'>
                        <div className='header-content'>
                            <p>Tên nhà</p>
                            <p>Địa chỉ</p>
                            <p>Hoạt động</p>
                            <p>Setting</p>
                            <p>Thông tin phòng</p>
                        </div>
                        <div className='content-list'>
                            {
                                dataHouse.map(item => (
                                    <div className='content-item' key={item.id}>
                                        <div className='item'>
                                            <p>{item.name_house}</p>
                                        </div>
                                        <div className='item'>
                                            <p>{item.address}</p>
                                        </div>
                                        <div className='item'>
                                            <SwitchInput onChangeSwitch={handleChangeSwitch} startValue={item.status ? true : false} idUser={item.id}/>
                                        </div>
                                        <div className='item item-icons'>
                                            <div className='icon' onClick={() => handleShowForm(2,item)}>
                                                <EditIcon />
                                            </div>
                                        </div>   
                                        <div className='item' onClick={() => handleShowRooms({idRoom : item.id})}>
                                            <Button variant="contained" size="small">Phòng</Button>
                                        </div>                    
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className='rooms'>
                    <div className='lineOne'>
                        <p className="header">Danh sách phòng</p>
                        <div className='buttons'>
                            <div className='button-addHouse' onClick={() => handleShowForm(3)}>
                                <Button variant="contained" endIcon={<AddIcon />}>
                                    Thêm phòng
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='searchs'>
                        <div className='search-status search'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={statusRoomCheck}
                                label="Trạng thái"
                                onChange={handleChangeRoomStatus}
                                >
                                    {
                                        statusRoom.map(item => (
                                            <MenuItem value={item.id} key={item.id}>{item.status}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className='search-name search'>
                            <TextField
                                id="outlined-controlled"
                                label="Tìm kiếm phòng theo tên"
                                value={nameRoom}
                                onChange={onChangeSearchRoomName}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start" onClick={handleSearchRoomHouse}>
                                        <SearchIcon />
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                    <div className='content'>
                        <div className='header'>
                            <p>Tên phòng</p>
                            <p>Giá tiền</p>
                            <p>Thao tác</p>
                            <p>Setting</p>
                        </div>
                        <div className='content-list'>
                            {dataRooms.map(item => (
                                <div className='content-item' key={item.id}>
                                    <div className='item'>
                                        <p>{item.room_number}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.price}</p>
                                    </div>
                                    <div className='item'>
                                        {item.status_room == 1 && <div onClick={() => handleShowForm(6,item.id)}><Button variant="contained">Thêm khách</Button></div>}
                                        {item.status_room == 2 && <div onClick={() => handleLeaveRoom(item.id)}><Button variant="contained" color="success">Trả phòng</Button></div>}
                                        {item.status_room == 3 && <div onClick={() => handleTakeRoom(item.id)}><Button variant="contained" color="secondary">Khách đạt cọc nhận phòng</Button></div>}
                                        {item.status_room == 4 && <div onClick={() => handChangeStatusRoom(item.id,1)}><Button variant="contained" color="error">Hoàn thành sửa chữa</Button></div>}
                                        {item.status_room == 5 && <div onClick={() => handChangeStatusRoom(item.id,1)}><Button variant="contained" color="error">Mở khóa phòng</Button></div>}
                                    </div>
                                    <div className='item buttons'>
                                        <div className='button' onClick={() => handleUpdateRoom(item.id)}>
                                            <Button variant="contained" size='small'>Chỉnh sửa</Button>
                                        </div>
                                        <div className='button' onClick={() => handleShowRoom(item.id)}>
                                            <Button variant="contained" size='small'>Xem</Button>
                                        </div>
                                        {
                                            item.status_room == 1 && 
                                            <div className='button' onClick={() => handChangeStatusRoom(item.id,5)}>
                                                <Button variant="contained" color="error" size='small'>Khóa phòng</Button>
                                            </div>
                                        }

                                        {
                                            item.status_room == 2 && 
                                            <div className='button' onClick={() => handleShowForm(7,item.id)}>
                                                <Button variant="contained" size='small'>Hợp đồng</Button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>  
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    {statusForm == 1 && <FormAddHouse onCloseDiagram={handleClose} onReload={setFilter}/>}
                    {statusForm == 2 && <FormAddHouse onCloseDiagram={handleClose} dataItem={globalValue.current} statusForm="update" onReload={setFilter}/>}
                    {statusForm == 3 && <FormaddRoom dataStatus={statusRoom} dataHouses={globalValueHouses.current} onCloseDiagram={handleClose} reLoad={handleShowRooms}/>}
                    {statusForm == 4 && <FormaddRoom dataStatus={statusRoom} dataHouses={globalValueHouses.current} onCloseDiagram={handleClose} dataApi={globalValue.current} status="update" reLoad={handleShowRooms}/>}
                    {statusForm == 5 && <FormShowRoom dataApi={globalValue.current} statusRoom={statusRoom}/>}
                    {statusForm == 6 && <FormMainAddMember  idRoom={globalValue.current} services={dataService} reLoad={handleShowRooms}/>}
                    {statusForm == 7 && <FormMainAddMember  idRoom={globalValue.current} services={dataService} ContractApi={Contract.current[0]} ServiceDetailApi={ServiceDetail.current} MemberInHouseApi={MemberInHouse.current} status="update" reLoad={handleShowRooms}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default HousePage;