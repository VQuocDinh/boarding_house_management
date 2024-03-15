import React, { useEffect, useMemo, useRef } from 'react';
import './style.css'
import Checkbox from '@mui/material/Checkbox';


function CheckField({onChangeValue,origin = false,id}) {
    const [checked, setChecked] = React.useState(origin);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      if(onChangeValue){
            onChangeValue(event.target.checked,id)
      }
    };

    return (
        <div className='checkField'>
            <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </div>
    );
}

export default CheckField;

