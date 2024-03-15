import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@mui/material/Switch';
Switch.propTypes = {
    
};

function SwitchInput({onChangeSwitch,startValue,idUser}) {
    const [checked, setChecked] = React.useState(startValue);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        onChangeSwitch(event.target.checked,idUser,setChecked)
    };
    return (
        <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
        />
    );
}

export default SwitchInput;