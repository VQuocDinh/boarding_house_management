import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

InputFile.propTypes = {
    
};

function InputFile({name,form,label}) {
    const {formState : {errors}} = form;
    const isError = errors[name];
    return (
        <>  
            {/* <label htmlFor={name}>Click vao` day ne`</label> */}
            <Controller
            name={name}
            control={form.control}
            render={({ field}) => (
                <input
                id={name}
                {...field}
                type="file" 
                name={name}
                />
            )}
             />
        </>
    );
}

export default InputFile;