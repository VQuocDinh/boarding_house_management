import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import noImg from '../../../../files/imgs/noImg.jpg'

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import "./style.css";

// import required modules
import { EffectCoverflow, Pagination } from "swiper";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
function FormShowRoom({dataApi,statusRoom}) {
    console.log(dataApi,statusRoom);
    const statusRoomApi = statusRoom.filter(item => {return item.id == dataApi.status_room})[0].status;
    console.log(statusRoomApi);
    return (
        <div className="formShowRoom-conatiner">
            <div className="information">
                <p className="header">Thông tin phòng</p>
                <div className="content">
                    <div className="content-header">
                        <p>{`Phòng số : ${dataApi.room_number}`}</p>
                        <p>{`Trạng thái : ${statusRoomApi}`}</p>
                        <p>{`Giá phòng : ${dataApi.price}`}</p>
                        <p>{`Chiều dài : ${dataApi.length}`}</p>
                        <p>{`Chiều rộng : ${dataApi.width}`}</p>
                        <p className="mutiline">{`Miêu tả chi tiết : ${dataApi.describe}`}</p>
                    </div>
                </div>
            </div>
            <div className="imgs">
                <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={"auto"}
                    coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                    }}
                    pagination={true}
                    modules={[EffectCoverflow, Pagination]}
                    className="mySwiper"
                >
                    {
                        dataApi.galery.map(item => (
                            <SwiperSlide>
                                <img src={item.galery} />
                            </SwiperSlide>
                        ))
                    }
                    {
                        dataApi.galery.length == 0 && <img src={noImg} />
                    }
                </Swiper>
            </div>
        </div>
    );
}

export default FormShowRoom;