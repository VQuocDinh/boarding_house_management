import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormAddStaff from './Components/FormAddStaff';
import adminApi from '../../Api/adminApi';
import { useSnackbar } from 'notistack';
import avatarImg from '../../files/imgs/user-avatar.png'
import SettingsIcon from '@mui/icons-material/Settings';
import SwitchInput from '../../Components/Inputs/Switch';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import DeleteIcon from '@mui/icons-material/Delete';
import FormChangePassStaff from './Components/FormChangePassStaff';
import Pagination from '@mui/material/Pagination';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
function StafPage(props) {
    const globalValue = useRef();
    const { enqueueSnackbar} = useSnackbar();
    const [statusForm,setStatusForm] = useState();
    const [open, setOpen] = React.useState(false);
    const [data,setData] = useState([])
    const [filter,setFilter] = useState({
        page : 1,
        limit : 5
    })

    const handleChange = (event, value) => {
        setFilter(x => ({
            ...x,
            page : value
        }))
    };
    let numberPage = useRef();

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
            case 2 : {
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
    

    useEffect(() => {
        (async () => {
            try {
                const data = await adminApi.getStaff(filter);
                setData(data.data)
                numberPage.current = Math.ceil(data.count/filter.limit);
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }

        })()
    },[filter])


    const handleChangeSwitch = async (value,idUser,rollBack) => {
        const active = value ? 1 : 0;
        const dataSend = {
            id : idUser,
            isActive : active
        }
        try {
            const data = await adminApi.updateActive(dataSend);
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
            rollBack(!value)
        }
    }

    const showMenu = (e) => {
        e.currentTarget.classList.toggle("active")
    }

    const handleChangePass = async (value) => {
        try {
            const data = await adminApi.updatePassStaff(value);
            handleClose()
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(data,"Danh sách nhân viên","ListStaff")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <>
            <div className='StafPage-container'>
                <div className='StafPage-content'>
                    <div className='header'>
                        <p>Danh sách nhân viên</p>
                        <div className='buttons'>
                            <div className='button' onClick={() => handleShowForm(1)}>
                                <Button variant="contained" endIcon={<AddIcon />}>
                                    Them nhan vien 
                                </Button>
                            </div>
                            <div className='button' onClick={handleToExcel}>
                                    <Button variant="contained" color="success" endIcon={<DescriptionIcon />}>Xuất file Excel</Button>
                            </div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='staf-search'>

                        </div>
                        <div className='staf-show'>
                            <div className='staf-header'>
                                <p>Id</p>
                                <p>Hình ảnh</p>
                                <p>Họ tên</p>
                                <p>Địa chỉ</p>
                                <p>Số điện thoại</p>
                                <p>Kích hoạt</p>
                                <p>Setting</p>
                            </div>
                            <div className='staf-list'>
                                {
                                    data.map(item => (
                                        <div className='staf-item' key={item.id}>
                                            <p className='item'>{item.id}</p>
                                            <div className='item'>
                                                <img src={item.user_img || avatarImg } alt="" />
                                            </div>
                                            <p className='item'>{item.fullname}</p>
                                            <p className='item'>{item.address}</p>
                                            <p className='item'>{item.phone_number}</p>
                                            <div className='item active-switch'>
                                                <SwitchInput onChangeSwitch={handleChangeSwitch} startValue={item.isActive ? true : false} idUser={item.id}/>
                                            </div>
                                            <div className='icon item' onClick={showMenu}>
                                                <SettingsIcon />
                                                <div className='icon1 iconBelong' onClick={() => handleShowForm(2,item)}>
                                                    <EditIcon />
                                                </div>
                                                <div className='icon2 iconBelong' onClick={() => handleShowForm(3,item.id)}>
                                                    <KeyIcon />
                                                </div>
                                                <div className='icon3 iconBelong'>
                                                    <DeleteIcon />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='pagination'>
                                <Pagination count={numberPage.current} page={filter.page} onChange={handleChange} color="primary"/>
                            </div>
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
                    {statusForm == 1 && <FormAddStaff getNewData={setFilter}/>}
                    {statusForm == 2 && <FormAddStaff getNewData={setFilter} status={"update"} item = {globalValue.current}/>}
                    {statusForm == 3 && <FormChangePassStaff idUser={globalValue.current} onChangePass={handleChangePass}/>}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default StafPage;