import React, { useRef } from 'react';
import CheckField from '../../../../Components/Inputs/CheckField';
import './style.css';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import adminApi from '../../../../Api/adminApi';

function FormAddRole({dataArea = [],idUserNew = undefined,status,dataRoleApi}) {
    const { enqueueSnackbar} = useSnackbar();
    const arrayHave = [];
        if(dataRoleApi)
        {
            dataRoleApi.forEach(item => {
                arrayHave.push(item.idHouse)
            })
        }
    const arrayIndex = useRef([...arrayHave])
    const handleChangeValue = (value , index) =>
    {   
        if(arrayIndex.current.includes(index)){
            arrayIndex.current = arrayIndex.current.filter(item => {
                return item !== index
            })
        }
        else{
            arrayIndex.current.push(index)
        }
    }

    const handleSubmit = async () => {
        const stringArea = arrayIndex.current.join(",");
        const value = {
            id : idUserNew,
            area : stringArea
        }
        console.log(dataRoleApi);
        try {
            let data ;
            if(status === "update"){
                data = await adminApi.updateRoleStaff(value)
            }
            else{
                data = await adminApi.addRoleStaff(value)
            }
            enqueueSnackbar(data.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }
    }
    return (
        <div className='formAddRole-container'>
            <div className='formAddRole-content'>
                <div className='header'>
                    <p>Tên nhà</p>
                    <p>Cấp quyền</p>
                </div>
                <div className='content'>
                    <div className='areaList'>
                        {
                            dataArea.map(item => (
                               <div className='areaList-item' key={item.id}>
                                    <div className='item'>
                                        <p>{item.name_house}</p>
                                    </div>
                                    <div className='item'>
                                        {arrayIndex.current.includes(item.id) ? <CheckField id={item.id} onChangeValue={handleChangeValue} origin={true}/> : <CheckField id={item.id} onChangeValue={handleChangeValue}/>}
                                    </div>
                               </div> 
                            ))
                        }
                    </div>
                </div>
                <div className='buttons' onClick={handleSubmit}>
                    <Button variant="contained">Lưu khu vực</Button>
                </div>
            </div>
        </div>
    );
}

export default FormAddRole;