import React, { useState } from 'react';
import './style.css'
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';

FormFile.propTypes = {
    
};

function FormFile({onCloseDiagram,dataUser,onChangeAvatar}) {
    console.log(dataUser);
    const form = useForm()
    const handleSubmitForm = async (values) => {
        onChangeAvatar(values,dataUser,dataAvatar)  
    }
    let dataAvatar = useRef();
    const onChangeInputFile = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        dataAvatar.current = file; 
        showFile(file)
    }

    const dropAria = useRef();
    const tittle = useRef();
    const inputFile = useRef();
    const hanleClickChoose = (e) => {
        e.preventDefault()
        inputFile.current.click();
    }

    const [formMode,setFormMode] = useState(0)
    let UrlImgAvatar = useRef()
    const showFile = (file) => {
        const fileType = file.type;
        const validExtensions = ['image/jpeg' , 'image/jpg', 'image/png'];
        if(validExtensions.includes(fileType)){
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const fileUrl = fileReader.result;
                UrlImgAvatar.current = fileUrl;
                setFormMode(1)
            }
            fileReader.readAsDataURL(file);
        }else{
            alert("Đây không phải là file ảnh");
            tittle.current.textContent = "Kéo và thả để tải ảnh"
        }
    }

    const dragOver = (e) => {
        e.preventDefault();
        tittle.current.textContent ="Thả để tải ảnh lên"
    }
    const dragLeave = (e) => {
        e.preventDefault();
        tittle.current.textContent ="Kéo và thả để tải ảnh"
    }
    const dropItem = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        dataAvatar.current = file; 
        showFile(file)
    }
    const onCancelButton = (e) => {
        e.preventDefault();
        setFormMode(0)
    }
    return (
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="Form-change_avatar" encType="multipart/form-data">
            {
                !formMode ? 
                <div className='dragItemForm' ref={dropAria} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={dropItem}>
                    <p className='dragItem_header' ref={tittle}>Kéo và thả để tải file lên</p>
                    <span>Hoặc</span>
                    <button className='dragItemForm_button' onClick={hanleClickChoose}>Chọn File</button>
                    <input hidden type="file" name="avatar" onChange={onChangeInputFile} ref={inputFile}/>
                </div>
                :
                <div className='avatar-img_container'>
                    <h1>Avatar</h1>
                    <img src={UrlImgAvatar.current} alt="" />   
                    <div className='buttonChange'>
                        <button onClick={onCancelButton}>Cancel</button>
                        <button type='submit'>Save</button>
                     </div>
                </div>
            }
            
        </form>
    );

    
}

export default FormFile;