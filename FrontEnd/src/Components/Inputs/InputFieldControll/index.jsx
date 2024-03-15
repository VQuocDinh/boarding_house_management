
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function InputFieldControll({origin = 1,label,onChangeForm,id}) {
    const [name, setName] = React.useState(origin);
    const handleChangeForm = (event) => {
        setName(event.target.value);
        if(onChangeForm)
        {
            onChangeForm(event.target.value,id)
        }
    }
    return (
        <TextField
        id="outlined-controlled"
        label= {label}
        value={name}
        onChange={handleChangeForm}
      />
    );
}

export default InputFieldControll;