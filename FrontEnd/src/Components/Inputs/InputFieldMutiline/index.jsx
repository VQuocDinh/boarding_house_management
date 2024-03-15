import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';


function InputFieldMutiline({name,form,label,mutiline,row}) {
    const {formState : {errors}} = form;
    const isError = errors[name];
    return (
        <Controller
        name={name}
        control={form.control}
        render={({ field}) => (
            <TextField 
            {...field} 
            error = {!!isError}
            helperText= {errors[name]?.message}
            id="outlined-basic" 
            label={label} 
            multiline = {!!mutiline}
            rows={row}
            fullWidth
            />
        )}
      />
    );
}

export default InputFieldMutiline;

