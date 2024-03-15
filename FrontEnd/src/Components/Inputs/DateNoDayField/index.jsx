import React, { useState } from 'react';


import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


import { FormHelperText } from '@mui/material';
import { useMemo } from 'react';



function DateNoDayField({name,form,label}) {
    const {formState : {errors}} = form;
    const isError = errors[name];
    
    const [value, setValue] = useState(() => {

      if(form.getValues(name) == "")
      {
        return Date.now()
      }
      else
      {
        const stringDate = form.getValues(name);
        const stringArray = stringDate.split("/");
        return `${stringArray[1]}/${stringArray[0]}/${stringArray[2]}`
      }
    });
    useMemo(() => {
      if(form.getValues(name) == "")
      {
        const date = new Date();
        const StringValue = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        form.setValue(name,StringValue);  
      }
    },[])
    const handleChange = (newValue,stringValue) => {
        setValue(newValue);
        const StringValue = `${newValue?.$D}/${newValue?.$M + 1}/${newValue?.$y}`
        form.setValue(name,StringValue)
    };

    return (
    <LocalizationProvider dateAdapter={AdapterDayjs} error={!!isError}>
         <DesktopDatePicker
          label={label}
          inputFormat="MM/YYYY"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} fullWidth/>}
        />
      <FormHelperText id="outlined-weight-helper-text">{isError?.message}</FormHelperText>
    </LocalizationProvider>
    );
}

export default DateNoDayField;

