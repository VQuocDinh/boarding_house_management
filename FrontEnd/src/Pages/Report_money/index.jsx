import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import { useSnackbar } from 'notistack';
import normalApi from '../../Api/normalApi';
import adminApi from '../../Api/adminApi';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import toExcel from '../../App/ToExcel/index'
import DescriptionIcon from '@mui/icons-material/Description';
function Report_money(props) {
    const { enqueueSnackbar} = useSnackbar();
    const [houseData,setHouseData] = useState([]);
    const [dataReport,setDataReport] = useState([]);
    const [valueTime, setValueTime] = React.useState();
    const date = new Date();
    const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const [filter,setFilter] = useState({
        time : StringValue,
    })

    let sumNumberRecieve = 0;
    let sumNumbersSpend = 0;
    let sumNumberStink = 0;

    dataReport.forEach(item => {
        sumNumberRecieve += item.recieve;
        sumNumbersSpend += item.spend;
        sumNumberStink += item.lost;
    })
    useEffect(() => {
        (async () => {
            try {
                const data = await adminApi.getReportMoney(filter)
                setDataReport(data.data)
                console.log(data);
                const houseData = await normalApi.getHouse();
                setHouseData(houseData.data)
            } catch (error) {
                enqueueSnackbar(error.message,{variant : "error"})
            }
        })()
    },[filter])
    const handleChangeTime = (newValue) => {
        setValueTime(newValue);
        const StringValue = `${newValue?.$D}/${newValue?.$M + 1}/${newValue?.$y}`
        setFilter(x => ({
          ...x,
          time : StringValue
        }))
      };
      const handleToExcel =async () => {
        try {
            await toExcel.exportExcel(dataReport,`Hóa đơn lời lỗ tháng ${filter.time.split("/")[1]} năm ${filter.time.split("/")[2]}`,"ListReportMoney")
        } catch (error) {
            enqueueSnackbar("Lỗi khi tạo file excel",{variant : "error"})
        }
    }
    return (
        <div className='report_money-container'>
            <div className='report_money-content'>
                <div className='header'>
                    <p>Báo cáo lời lỗ</p>
                    <div className='buttons'>
                        <div className='button' onClick={handleToExcel}>
                            <Button variant="contained" color="success" endIcon={<DescriptionIcon />}>Xuất file Excel</Button>
                        </div>
                    </div>
                </div>
                <div className='searchs'>
                    <div className='searchMonth'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                            label="Tháng/Năm"
                            inputFormat="MM/YYYY"
                            value={valueTime}
                            onChange={handleChangeTime}
                            renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        <p>Nhà</p>
                        <p></p>
                        <p>{`Doanh thu (VNĐ)`}</p>
                        <p>{`Chi phí (VNĐ)`}</p>
                        <p>{`Lãi (VNĐ)`}</p>
                    </div>
                    <div className='content-list'>
                        <div className='content-list_wrap'>
                        {
                            dataReport.map(item => (
                                <div className='content-item'>
                                    <div className='item'>
                                        <p>{item.nameHouse}</p>
                                    </div>
                                    <div></div>
                                    <div className='item'>
                                        <p>{item.recieve}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.spend}</p>
                                    </div>
                                    <div className='item'>
                                        <p>{item.lost}</p>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                        <div className='content-item special'>
                            <div className='item'>
                                <p>Tổng kết :</p>
                            </div>
                            <div></div>
                            <div className='item'>
                                <p>{sumNumberRecieve}</p>
                            </div>
                            <div className='item'>
                                <p>{sumNumbersSpend}</p>
                            </div>
                            <div className='item'>
                                <p>{sumNumberStink}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report_money;