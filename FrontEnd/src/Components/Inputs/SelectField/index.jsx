import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Controller } from 'react-hook-form';
import { FormHelperText } from '@mui/material';
import './style.css'

function SelectField({data = [],name,form,label}) {

    const {formState : {errors}} = form;
    const isError = errors[name];
    const keyArray = data.length == 0 ? {} : Object.keys(data[0]);
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth error={!!isError} variant="standard">
                <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
                <Controller
                    name={name}
                    control={form.control}
                    render={({ field}) => (
                        <Select
                        {...field}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label={label}
                        >
                            {
                                data.map(item => (
                                    <MenuItem key={item.id} value={item[keyArray[0]]}>{item[keyArray[1]]}</MenuItem>
                                ))
                            }
                        </Select>
                    )}
                />
            <FormHelperText id="outlined-weight-helper-text">{isError?.message}</FormHelperText>
            
            </FormControl>
        </Box>
    );
}

export default SelectField;