import React from 'react';
import './style.css'
import CheckField from '../../../../Components/Inputs/CheckField';
import InputFieldControll from '../../../../Components/Inputs/InputFieldControll';
import { Button } from '@mui/material';
import normalApi from '../../../../Api/normalApi';
import { useSnackbar } from 'notistack';
function FormAddServiceRoom({idRoom,services,dataApi = []}) {
    const { enqueueSnackbar} = useSnackbar();
    const arrayService = services.map(item => {
        item.number = 1;
        return item
    })
    let arrayChoose = [];
    if(dataApi.length !== 0){
        arrayService.forEach((item,index) => {
            dataApi.forEach(itemApi => {
                if(itemApi.service_id == item.id)
                {
                    item.number = itemApi.number;
                    arrayChoose.push(index)
                }
            })
        })
    }

    console.log(arrayService,"kkk",dataApi);
    const handleChangeNumber = (value,id) => {
        arrayService[id].number = value;
    }
    const handleChoose = (value,id) => {
        if(value){
            arrayChoose.push(id)
        }   
        else{
            const tempArray = arrayChoose.filter(item => {return item !== id})
            arrayChoose = tempArray;
        }
    }
    const handleSubmit =async () => {
        const arrayIndex = Array.from(new Set(arrayChoose));
        const value = arrayIndex.map(item => {return arrayService[item]})
        const data = {
            arrayService : JSON.stringify(value),
            roomId : idRoom
        }
        try {
            let dataSend;
            if(dataApi.length !== 0)
            {
                dataSend = await normalApi.updateServiceToHouse(data)
            }
            else{
                dataSend = await normalApi.addServiceToHouse(data);
            }
            enqueueSnackbar(dataSend.message,{variant : "success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant : "error"})
        }

    }
  return (
      <div className='formAddServiceRoom-container'>
           <div className='content'>
                <p className='header'>Dịch vụ</p>
                <div className='listCheck'>
                    <div className='list_header'>
                        <p>Chọn</p>
                        <p>Dịch vụ</p>
                        <p>Đơn giá</p>
                        <p>Số lượng</p>
                    </div>
                    <div className='list-content'>
                    {
                        arrayService.map((item,index) => (
                            <div className='item' key={item.id}>
                                <div className='item-item'>
                                    { arrayChoose.includes(index) ? <CheckField id={index} onChangeValue={handleChoose} origin={true}/> : <CheckField id={index} onChangeValue={handleChoose} origin={false}/>}
                                </div>
                                <div className='item-item'>
                                    <p>{item.name}</p>
                                </div>
                                <div className='item-item'>
                                    <p>{item.price}</p>
                                </div>
                                <div className='item-item'>
                                    <InputFieldControll label="Số lượng" origin={item.number} id={index} onChangeForm={handleChangeNumber}/>
                                </div>  
                            </div>
                        ))
                    }
                    </div>
                </div>
                <div className='buttons'>
                    <div className='button' onClick={handleSubmit}>
                        <Button variant="contained">Lưu</Button>
                    </div>
                </div>
           </div>
      </div>
  );
}

export default FormAddServiceRoom;