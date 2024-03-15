import React, { useRef, useState ,useEffect} from 'react';
import './style.css'
import Button from '@mui/material/Button';
import FormAddInfor from '../FormAddInfor';
import normalApi from '../../../../Api/normalApi';
import { useSnackbar } from 'notistack';
import FormAddRole from '../FormAddRole';
import adminApi from '../../../../Api/adminApi';
function FormAddStaff({status,item,getNewData}) {
    const { enqueueSnackbar} = useSnackbar();
    const [statusPage,setStatusPage] = useState(true)
    const handleChangeStatus = (value) => {
        setStatusPage(value)
    }
    const [userIdNew,setUserIdNew] = useState(item?.id);
    const [dataHouseRole,setDataHouseRole] = useState();
    const [dataRoleUser,setDataRoleUser] = useState();
    useEffect(() => {
        (async () => {
            try {
                const data = await normalApi.getHouse({status : 1})
                if(item?.id)
                {
                    const value = {
                        id : item.id
                    }
                    const dataRole = await adminApi.getRoleStaff(value)
                    setDataRoleUser(dataRole.data)
                }
                setDataHouseRole(data.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[])
    return (
        <div className='FormAffStaff-container'>
            <div className='FormAffStaff-content'>
                <p className='header'>Nhân viên</p>
                <div className='buttons'>
                    <div className='button' onClick={() => handleChangeStatus(true)}>
                        <Button variant={statusPage ? "contained" : "outlined"}>Thông tin</Button>
                    </div>
                    <div className='button' onClick={() => handleChangeStatus(false)}>
                        <Button variant={statusPage ? "outlined" : "contained"}>Khu vực</Button>
                    </div>
                </div>
                <div className='content'>
                    {statusPage ? <FormAddInfor status={status} item = {item} getNewId={setUserIdNew} getNewData={getNewData}/> : <FormAddRole dataArea={dataHouseRole} idUserNew={userIdNew} status={status} dataRoleApi={dataRoleUser} />}
                </div>
            </div>
        </div>
    );
}

export default FormAddStaff;