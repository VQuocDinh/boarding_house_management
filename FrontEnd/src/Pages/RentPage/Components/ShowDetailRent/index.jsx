import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import normalApi from '../../../../Api/normalApi';
import './style.css'
import ReactToPrint from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
function ShowDetailRent({data = {},onCloseDiagram}) {
    console.log(data);


    let date = new Date(data.from_time);
    let stringTimeFrom = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    date = new Date(data.to_time);
    let stringTimeTo = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const stringMonth = stringTimeFrom.split("/").slice(1,3).join("/")

    const [dataApi,setDataApi] = useState({});


    
    useEffect(() => {
        (async () => {
            const dataRentDetail = await normalApi.getRentDetail({id : data.id});
            setDataApi(dataRentDetail.data)
        })()
    },[])

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
                <p className='header'>Hóa đơn tháng</p>
                <div className='content'>
                    <div className='center'>
                        <p>{`Nhà : ${data.name_house}`}</p>
                        <p>{`Phòng : ${data.room_number}`}</p>
                        <p>{`Tháng : ${stringMonth}`}</p>  
                        <p>{`(Từ ngày ${stringTimeFrom} đến ${stringTimeTo})`}</p>
                    </div>    
                    <div className='money'>
                        <p>{`- Tiền nhà : ${dataApi.roomPrice}`}</p> 
                        <p>{`- Tiền điện : `}</p>
                        <div className='list'>
                            {
                                dataApi?.electric?.map(item => (
                                    <div className='item'>
                                        <div>
                                            <p>{`   + Từ ngày : `}</p>
                                            <Moment format="DD/MM/YYYY">
                                            {item.from_time}
                                            </Moment>
                                        </div>
                                        <div className='marginRight'>
                                            <p>{`Đến ngày : `}</p>
                                            <Moment format="DD/MM/YYYY">
                                            {item.to_time}
                                            </Moment>
                                        </div>
                                        <div className='marginRight'>
                                            <p>{`Giá tiền : ${item.price}`}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <p>{`- Tiền nước : `}</p>
                        <div className='list'>
                            {
                                dataApi?.water?.map(item => (
                                    <div className='item'>
                                        <div>
                                            <p>{`   + Từ ngày : `}</p>
                                            <Moment format="DD/MM/YYYY">
                                            {item.from_time}
                                            </Moment>
                                        </div>
                                        <div className='marginRight'>
                                            <p>{`Đến ngày : `}</p>
                                            <Moment format="DD/MM/YYYY">
                                            {item.to_time}
                                            </Moment>
                                        </div>
                                        <div className='marginRight'>
                                            <p>{`Giá tiền : ${item.price}`}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <p>{`- Dịch vụ :`}</p>
                        <div className='list'>
                            {
                                dataApi?.service?.map(item => (
                                    <p>{`   + Tên dịch vụ : ${item.name} | Giá tiền : ${item.price} | Số lượng : ${item.number} | Thành tiền : ${item.price * item.number}`}</p>
                                ))
                            }
                        </div>
                        <p>{`- Phát sinh :`}</p>
                        <div className='list'>
                            {
                                dataApi?.arise?.map(item => (
                                    <div className='item'>
                                        <div>
                                            <p>{`+ Thời gian : `}</p>
                                            <Moment format="DD/MM/YYYY">
                                                {item.time}
                                            </Moment>
                                        </div>
                                        <div className='marginRight'>
                                            <p>{`Nội dung : ${item.note}`}</p>
                                        </div>
                                        <div className='marginRight'>
                                            <p>{`Giá tiền : ${item.price}`}</p>
                                        </div>
                                    </div> 
                                ))
                            }
                        </div>
                        <p className='maginBottom'>{`-Số tiền tăng giảm : ${data.arise}vnđ`}</p>  
                        <p>{`-Lý do :`}</p>
                        <p className='reason'>{`+ ${data.discount_reason ? data.discount_reason : ""}`}</p>   
                    </div>
                <p className='finalMoney'>{`TỔNG TIỀN : ${data.money_need}vnđ`}</p>
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

export default ShowDetailRent;