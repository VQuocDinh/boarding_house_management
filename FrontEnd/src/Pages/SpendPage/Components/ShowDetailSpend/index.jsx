import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import normalApi from '../../../../Api/normalApi';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
function ShowDetailSpend({data = {},onCloseDiagram}) {
    console.log(data);


    let date = new Date(data.time);
    let stringTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    date = new Date();
    let stringTimeCurrent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;


    const componentRef = useRef();
    
    return (
        <div className='showDetailRent'>
            <ReactToPrint
                trigger={() => 
                (
                    <div className='button-print'>
                        <Button variant="contained" endIcon={<PrintIcon />}>
                            In hóa đơn
                        </Button>
                    </div>
                )
                }
                content={() => componentRef.current}
                pageStyle = "print"
            />
            <div className='showDetailRent-container' ref={componentRef}>
                <p className='header'>Phiếu chi</p>
                <div className='content'>
                    <div className='center'>
                        <p>{`Ngày ${stringTime.split("/")[0]} tháng ${stringTime.split("/")[1]} năm ${stringTime.split("/")[2]}`}</p>
                    </div>    
                    <div className='money'>
                        <p>{`Họ tên người nộp tiền : ${data.receiver}`}</p> 
                        <p>{`Lý do : ${data.reason}`}</p>
                        <p>{`Số Tiền : ${data.price} (vnđ)`}</p>
                    </div>
                <div className='currentDay'>
                    <p>{`Ngày ${stringTimeCurrent.split("/")[0]} tháng ${stringTimeCurrent.split("/")[1]} năm ${stringTimeCurrent.split("/")[2]}`}</p>
                </div>
                <div className='sign'>
                    <div className='person'>
                        <p>Người thanh toán</p>
                        <p>{`(Ký rõ họ tên)`}</p>
                    </div>
                    <div className='person'>
                        <p>Người nhận</p>
                        <p>{`(Ký rõ họ tên)`}</p>
                    </div>
                </div>
                </div>
            </div>
            <div className='button' onClick={onCloseDiagram}>
                    <Button variant="contained">OK</Button>
            </div>
        </div>
    );
}

export default ShowDetailSpend;