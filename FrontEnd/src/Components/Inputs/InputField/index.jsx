import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

InputField.propTypes = {
    
};

function InputField({name,form,label}) {
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
            variant="standard" 
            fullWidth
            />
        )}
      />
    );
}

export default InputField;

