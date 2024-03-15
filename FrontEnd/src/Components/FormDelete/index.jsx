import React from 'react';
import './style.css';
import Button from '@mui/material/Button';
function FormDelete({header,content,onSubmit,onCloseDiagram}) {

    const hanleSubmit = () => {
        if(onSubmit)
        {
            onSubmit()
            onCloseDiagram()
        }
    }
    return (
        <div className='formDelete-container'>
            <p className='header'>{header}</p>
            <p className='content'>{content}</p>
            <p className='content'>Bạn có chắc chắn muốn thực hiện thao tác này ?</p>
            <div className='buttons'>
                <div className='button' onClick={onCloseDiagram}>
                    <Button variant="outlined">Hủy</Button>
                </div>
                <div className='button' onClick={hanleSubmit}>
                    <Button variant="contained">Thực hiện</Button>
                </div>
            </div>
        </div>
    );
}

export default FormDelete;