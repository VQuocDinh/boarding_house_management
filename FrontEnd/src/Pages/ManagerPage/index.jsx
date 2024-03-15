import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import RegisterApi from '../../Api/RegisterApi';
import { changeJwt,changeUser } from '../../Components/Login/LoginSlice';


function MagagerPage(props) {
    const token = document.cookie;
    const dispatch = useDispatch();
    const relative = useNavigate();
    let next = false;
    useMemo(() => {
        (async () => {
            try {
                const data = await RegisterApi.getLoginSuccess();
                if(data.data.id)
                {
                    // lưu accessToken vào redux
                    const action1 = changeJwt(data.accessToken)
                    const data1 = await dispatch(action1)
                    // Thay đổi giá trị user trong redux
                    const action2 = changeUser(data)
                    const data2 = await dispatch(action2)
                    localStorage.setItem("user", JSON.stringify(data.data));
                    localStorage.setItem("jwt", JSON.stringify(data.accessToken));
                    document.cookie = `refreshToken= ${data.refreshToken}`;
                    relative('/setting')
                }
            } catch (error) {
                console.log(error);
            }
        })();
    },[])
            if(token)
            {
                next = true;
            }
    return (
        <>
            {next ? <Outlet/> : <Navigate to='/login'/>}
        </>
    );
}

export default MagagerPage;