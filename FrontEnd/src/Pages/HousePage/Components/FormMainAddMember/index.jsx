import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';
import FormAddGuess from '../FormAddGuess';
import FormAddMemberInHouse from '../FormAddMemberInHouse';
import FormAddServiceRoom from '../FormAddServiceRoom';
import './style.css'

function FormMainAddMember({idRoom,services,ContractApi,ServiceDetailApi,MemberInHouseApi,status,reLoad}) {
    const [statusForm,setStatusForm] = useState(1); 
    const globalValue = useRef();
    const handleChangeStatus = (value,item) => {
        globalValue.current = item;
        switch(value) {
            case 1: {
                setStatusForm(1)
                break;
            }
            case 2 : {
                setStatusForm(2)
                break;
            }
            case 3 : {
                setStatusForm(3)
                break;
            }
        }
    }
    return (
        <div className='formMainAddMember'>
            <div className='header'>
                <div className='button' onClick={() => handleChangeStatus(1)}>
                    <Button variant={statusForm == 1 ? "contained" : "outlined"}>Hợp đồng</Button>
                </div>
                <div className='button' onClick={() => handleChangeStatus(2)}>
                    <Button variant={statusForm == 2 ? "contained" : "outlined"}>Dịch vụ</Button>
                </div>
                <div className='button' onClick={() => handleChangeStatus(3)}>
                    <Button variant={statusForm == 3 ? "contained" : "outlined"}>Thành viên ở cùng</Button>
                </div>
            </div>
            <div className='content'>
                {statusForm == 1 && <FormAddGuess idRoom={idRoom} dataApi={ContractApi} reload={reLoad}/>}
                {statusForm == 2 && <FormAddServiceRoom idRoom={idRoom} services={services} dataApi={ServiceDetailApi}/>}
                {statusForm == 3 && <FormAddMemberInHouse idRoom={idRoom} dataApi={MemberInHouseApi}/>}
            </div>
        </div>
    );
}

export default FormMainAddMember;