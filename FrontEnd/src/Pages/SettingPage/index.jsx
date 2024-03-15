import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FormSetting from './Components/FormSetting';
import './style.css'



function SettingPage(props) {
    const dataUser = useSelector(state => state.user.user)

    return (
        <FormSetting dataUser = {dataUser} />
    );
}

export default SettingPage;