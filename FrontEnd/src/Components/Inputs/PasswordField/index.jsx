import React, { useState } from 'react';
import { FormControl, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './style.css'

function PasswordField({name,form,label}) {
    const {formState : {errors}} = form;
    const isError = errors[name];
    const [showPass, setShowPass] = useState(false)
    const handleClickShowPassword = () => {
        setShowPass(i => !i)
      };

    return (
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard" error={!!isError}>
          <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>


                <Controller
                name={name}
                control={form.control}
                render={({ field}) => (
                    <Input
                        {...field}
                        id="standard-adornment-password"
                        type={showPass ? 'text' : 'password'}
                        
                        
                        endAdornment={
                        <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        >
                        {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                        }
                    />
                )}
            />
        <FormHelperText id="outlined-weight-helper-text">{isError?.message}</FormHelperText>
        </FormControl>
    );
}

export default PasswordField;

