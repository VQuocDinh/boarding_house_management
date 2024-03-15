import React, { useRef } from 'react';
import './style.css'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import HomeIcon from '@mui/icons-material/Home';
import HouseIcon from '@mui/icons-material/House';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import OpacityIcon from '@mui/icons-material/Opacity';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import RegisterApi from '../../Api/RegisterApi';
import { useSnackbar } from 'notistack';
import { logOutUser } from '../../Components/Login/LoginSlice';
import { useDispatch } from 'react-redux';
import ArticleIcon from '@mui/icons-material/Article';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import BadgeIcon from '@mui/icons-material/Badge';
function MainPage(props) {
    const { enqueueSnackbar} = useSnackbar();
    const leftContent = useRef();
    const relative = useNavigate();
    const dispatch = useDispatch()
    const handleButtonChange = (e) => {
        leftContent.current.classList.toggle("close")

    } 

    const hanldeRelativePage = (item) => {
        switch(item) {
        case 2: 
            {
                relative('/house')
                break;
            }
        case 3: 
            {
                relative('/service')
                break;
            } 
        case 4: 
            {
                relative('/electric')
                break;
            }   
        case 5: 
            {
                relative('/water')
                break;
            }   
        case 6: 
            {
                relative('/arise')
                break;
            } 
        case 7: 
            {
                relative('/rent')
                break;
            } 
        case 8: 
            {
                relative('/spend')
                break;
            }
        case 9: 
            {
                relative('/recieve')
                break;
            }
        case 10: 
            {
                relative('/job')
                break;
            } 
        case 11: 
            {
                relative('/staff')
                break;
            }
        case 12: 
            {
                relative('/asset')
                break;
            }
        case 13:
            {
                relative('/deposit')
                break;
            }    
        case 14:
            {
                relative('/setting')
                break;
            }
        case 15:
            {
                relative('/report_money')
                break;
            }
        case 16:
                {
                    relative('/report_guess')
                    break;
                }
        case 17:
                {
                    relative('/report_roomNotDone')
                    break;
                }   
        case 18:
                {
                    relative('/report_contractEndSoon')
                    break;
                }   
        case 19:
                {
                    relative('/contract')
                    break;
                }
        }
    }

    const handleLogOut = async() => {
        const action = logOutUser();
        try {
            const data = await RegisterApi.logOut();
            dispatch(action)
            relative('/login')
            enqueueSnackbar(data.message,{variant:"success"})
        } catch (error) {
            enqueueSnackbar(error.message,{variant:"error"})
        }
    }
    return (
        <div className='Admin-container'>
            <div className='AdminPage-left' ref={leftContent}>
                <div className='AdminPage-left_header'>
                    <p className='item-param'>Quản lý nhà trọ</p>
                    <p className='item-param'>Simple House</p>
                </div>
                <div className='AdminPage-left_content'>
                    {/* <div className='item'>
                        <div className='icon'>
                            <HomeIcon />
                        </div>
                        <p className='item-param' >Trang chủ</p>
                    </div> */}
                    <div className='item'>
                        <div className='icon'>
                            <HouseIcon />
                        </div>
                        <p className='item-param' onClick={() => hanldeRelativePage(2)}>Phòng</p>
                    </div>

                    <div className='item' onClick={() => hanldeRelativePage(3)}>
                        <div className='icon'>
                            <WidgetsIcon />
                        </div>
                        <p className='item-param' >Dịch vụ</p>
                    </div>

                    <div className='item' onClick={() => hanldeRelativePage(4)}>
                        <div className='icon'>
                            <ElectricBoltIcon />
                        </div>
                        <p className='item-param' >Chỉ số điện</p>
                    </div>

                    <div className='item' onClick={() => hanldeRelativePage(5)}>
                        <div className='icon'>
                            <OpacityIcon />
                        </div>
                        <p className='item-param' >Chỉ số nước</p>
                    </div>

                    <div className='item' onClick={() => hanldeRelativePage(6)}>
                        <div className='icon'>
                            <AddBusinessIcon />
                        </div>
                        <p className='item-param' >Phát sinh</p>
                    </div>

                    <div className='item' onClick={() => hanldeRelativePage(7)}>
                        <div className='icon'>
                            <AttachMoneyIcon />
                        </div>
                        <p className='item-param' >Tính tiền</p>
                    </div>

                    <div className='item' onClick={() => hanldeRelativePage(9)}>
                        <div className='icon'>
                            <PaymentIcon />
                        </div>
                        <p className='item-param' >Phiếu thu</p>
                    </div>

                    <div className='item' onClick={() => hanldeRelativePage(8)}>
                        <div className='icon'>
                            <DescriptionIcon />
                        </div>
                        <p className='item-param' >Phiếu chi</p>
                    </div>

                    <div className='item' onClick={() => hanldeRelativePage(10)}>
                        <div className='icon'>
                            <WorkIcon />
                        </div>
                        <p className='item-param' >Công việc</p>
                    </div>
                    <div className='item' onClick={() => hanldeRelativePage(11)}>
                        <div className='icon'>
                            <PeopleIcon />
                        </div>
                        <p className='item-param' >Nhân viên</p>
                    </div>
                    <div className='item' onClick={() => hanldeRelativePage(12)}>
                        <div className='icon'>
                            <BusinessIcon />
                        </div>
                        <p className='item-param' >Tài sản</p>
                    </div>
                    <div className='item' onClick={() => hanldeRelativePage(13)}>
                        <div className='icon'>
                            <PriceCheckIcon />
                        </div>
                        <p className='item-param' >Cọc giữ phòng</p>
                    </div>
                    <div className='item' onClick={() => hanldeRelativePage(15)}>
                        <div className='icon'>
                            <ArticleIcon />
                        </div>
                        <p className='item-param' >Báo cáo lời lỗ</p>
                    </div>
                    <div className='item' onClick={() => hanldeRelativePage(16)}>
                        <div className='icon'>
                            <RecentActorsIcon />
                        </div>
                        <p className='item-param' >Khách thuê phòng</p>
                    </div>
                    <div className='item' onClick={() => hanldeRelativePage(17)}>
                        <div className='icon'>
                            <CreditCardOffIcon />
                        </div>
                        <p className='item-param' >Phòng nợ tiền</p>
                    </div>
                    <div className='item' onClick={() => hanldeRelativePage(18)}>
                        <div className='icon'>
                            <AssignmentLateIcon />
                        </div>
                        <p className='item-param' >Hợp đồng sắp hết hạn</p>
                    </div>
                    <div className='item' onClick={() => hanldeRelativePage(19)}>
                        <div className='icon'>
                            <BadgeIcon />
                        </div>
                        <p className='item-param' >Hợp đồng</p>
                    </div>




                    <div className='item' onClick={() => hanldeRelativePage(14)}>
                        <div className='icon'>
                            <SettingsIcon />
                        </div>
                        <p className='item-param' >Thiết lập</p>
                    </div>
                    <div className='item' onClick={handleLogOut}>
                        <div className='icon'>
                            <LogoutIcon />
                        </div>
                        <p className='item-param' >Đăng xuất</p>
                    </div>
                </div>

                <div className='icon-change' onClick={handleButtonChange}>
                    <MenuIcon />
                </div>
            </div>
            <div className='AdminPage-right'>
                <Outlet />
            </div>
        </div>
    );
}

export default MainPage;