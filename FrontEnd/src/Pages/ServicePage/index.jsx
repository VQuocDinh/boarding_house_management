import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormAddService from './Components/FormAddService';
import { useSnackbar } from 'notistack';
import normalApi from '../../Api/normalApi';
import EditIcon from '@mui/icons-material/Edit';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import FormDelete from '../../Components/FormDelete';
import adminApi from '../../Api/adminApi';
import AddIcon from '@mui/icons-material/Add';
import toExcel from '../../App/ToExcel/index'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DescriptionIcon from '@mui/icons-material/Description';

function ServicePage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const globalValue = useRef()
    const [statusForm,setStatusForm] = useState()
    const [dataService,SetDataService] = useState([]) 
    const [open, setOpen] = React.useState(false);
    const [filter,setFilter] = useState({})


    const [statusSearch,setStatusSearch] = useState('');
    const handleChangeStatusSearch = (event) => {
        setStatusSearch(event.target.value);
        if(event.target.value == 2){
            setFilter(x => ({}))
        }
        else{
            setFilter(x => ({
                ...x,
                status : event.target.value
            }))
        }
    };

    const [nameService, setNameService] = React.useState('');
    const handleSearchService = () => {
        setFilter(x => ({
            ...x,
            nameService : nameService
        }))
    }
    const onChangeSearchService = (e) =>{
        setNameService(e.target.value);
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
            case 4: {
                setStatusForm(4)
                handleClickOpen()
                break;
            } 
        }
    }

    useEffect(() => {
        (async () =>{
            try {
                const data = await normalApi.getService(filter);
                SetDataService(data.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])

    const handleChangeStatus = async () => {
        const value = {
            idService : globalValue.current.id,
            status : globalValue.current.status ? 0 : 1
        }
        try {
            const data = await adminApi.changeService(value)
            setFilter(x => ({...x}))
            handleClose()
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }

    const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(dataService,"Danh sách dịch vụ","ListServices")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <div className='servicePage-container'>
           <div className='servicePage-content'>
               <div className='header'>
                    <p >Dịch vụ</p>
                    <div className='buttons'>
                        <div className='button' onClick={() => handleShowForm(1)}>
                            <Button variant="contained" endIcon={<AddIcon />}>Thêm dịch vụ</Button>
                        </div>
                        <div className='button' onClick={handleToExcel}>
                            <Button variant="contained" color="success" endIcon={<DescriptionIcon />}>Xuất file Excel</Button>
                        </div>
                    </div>
               </div>
               <div className='searchs'>
                         <div className='searchStatus'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Trạng thái dịch vụ</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={statusSearch}
                                label="Trạng thái phòng"
                                onChange={handleChangeStatusSearch}
                                >
                                        <MenuItem value={2}>Tất cả</MenuItem>
                                        <MenuItem value={0}>Ngưng cung cấp</MenuItem>
                                        <MenuItem value={1}>Đang được sử dụng</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='search-name search'>
                            <TextField
                                id="outlined-controlled"
                                label="Tên dịch vụ"
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
               <div className='content'>
                    <div className='content-header'>
                        <p>Tên dịch vụ</p>
                        <p>{`Giá(vnđ)`}</p>
                        <p>Ghi chú</p>
                        <p>Trạng thái</p>
                        <p>Thiết lập</p>
                    </div>
                    <div className='content-list'>
                        {
                            dataService.map(item => (
                                <div className='cotent-item'>
                                    <div className='item'>
                                        <p>{item.name}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.price}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.note}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.status ? "Đang được sử dụng" : "Ngưng cung cấp dịch vụ"}</p>
                                    </div>
                                    <div className='item buttons'>
                                        <div className='button' onClick={() => handleShowForm(2,item)}>
                                            <EditIcon />
                                        </div>
                                        {
                                            item.status ? 
                                            <div className='button' onClick={() => handleShowForm(3,item)}>
                                                <BackspaceIcon />
                                            </div>
                                            :
                                            <div className='button' onClick={() => handleShowForm(4,item)}>
                                                <AutorenewIcon />
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))
                        }
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
                    {statusForm == 1 && <FormAddService onCloseDiagram={handleClose} reLoadForm={setFilter}/>}
                    {statusForm == 2 && <FormAddService onCloseDiagram={handleClose} reLoadForm={setFilter} dataApi={globalValue.current} status="update"/>}
                    {statusForm == 3 && <FormDelete header="Ngưng cung cấp dịch vụ dịch vụ" content="Lưu ý : Dịch vụ sẽ không thể được chọn sau khi ngừng cung cấp !" onCloseDiagram={handleClose} onSubmit={handleChangeStatus}/>}
                    {statusForm == 4 && <FormDelete header="Tái cung cấp dịch vụ dịch vụ" content="Lưu ý : Dịch vụ sẽ có thể được chọn sau khi tái cung cấp !" onCloseDiagram={handleClose} onSubmit={handleChangeStatus}/>}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ServicePage;