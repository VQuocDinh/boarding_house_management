import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import './style.css'
import ClearIcon from '@mui/icons-material/Clear';

function FormMutiFileImg({formMain,dataApi = [],isMuti = false,nameField = "",onlyChange = false}) {
    if(dataApi[0]?.galery == null)
    {
        dataApi = []
    }
    const isMutiForm = isMuti ? "multiple" : "";
    const form = useForm()
    const ArrayImg = useRef([]);
    const [ArrayImgApi,setArrayImgApi] = useState([...dataApi])
    const ArrayDeletedImgsApi = useRef([]);
    const onChangeInputFile = async (e) => {
        e.preventDefault();
        let tempArray = [];
        if(onlyChange){
            ArrayDeletedImgsApi.current = [...ArrayImgApi];
            setArrayImgApi([])
            formMain.setValue('deleteImgs',ArrayDeletedImgsApi.current)
            ArrayImg.current = []
        }
        const length = e.target.files.length;
            for(let i = 0 ; i<length; i++){
                ArrayImg.current.push(e.target.files[i]);
                tempArray[i] = e.target.files[i];
            }
        if(onlyChange){
            showFile(tempArray)
            setArrayImgApi([])
        }
        else{
            showFile(tempArray,"Plus")
        }
    }
    

    const handleSubmitForm = (values) => {

    }
    const dropAria = useRef();
    const tittle = useRef();
    const inputFile = useRef();
    const hanleClickChoose = (e) => {
        e.preventDefault()
        inputFile.current.click();
    }

    let [urlImgs,setUrlImgs] = useState([])
    const showFile = (files,status) => {
        let isValid = true;
        let TempArray = [];
        if(status == "Plus"){
            TempArray = [...urlImgs]
        }
        const validExtensions = ['image/jpeg' , 'image/jpg', 'image/png'];
        files.map(item => {
            if(!validExtensions.includes(item.type))
            {
                isValid = false;
            }
        })
        if(isValid){
            files.map((item,index) => {
                let fileReader = new FileReader();
                fileReader.onload = () => {
                    const fileUrl = fileReader.result;
                    TempArray.push(fileUrl);
                    if(index == files.length -1){
                        setTimeout(() => {
                            setUrlImgs([...TempArray])
                            formMain.setValue(nameField,ArrayImg.current)
                        },300)
                    }
                }
               fileReader.readAsDataURL(item);
            })
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
        let tempArray = [];
        if(onlyChange){
            ArrayImg.current = []
        }
        const length = e.dataTransfer.files.length;
        for(let i = 0 ; i<length; i++){
            ArrayImg.current.push(e.dataTransfer.files[i]);
            tempArray[i] = e.dataTransfer.files[i];
        }

        if(onlyChange){
            showFile(tempArray)
            setArrayImgApi([])
        }
        else{
            showFile(tempArray,"Plus")
        }
    }

    const handleDeleteImg = (index) => {
        const tempArray = [...urlImgs];
        tempArray.splice(index,1)
        ArrayImg.current.splice(index,1);
        setUrlImgs([...tempArray])
        formMain.setValue(nameField,ArrayImg.current)
    }

    const handleDeleteImgApi = (index) => {
        const tempArray = [...ArrayImgApi]
        const itemDelete = tempArray.splice(index,1);
        ArrayDeletedImgsApi.current.push(itemDelete[0]);
        setArrayImgApi([...tempArray])
        formMain.setValue('deleteImgs',ArrayDeletedImgsApi.current)
    }
    return (
    <form onSubmit={form.handleSubmit(handleSubmitForm)} className="Form-mutiFile" encType="multipart/form-data" >
        <p className='Form-mutiFile_header'>Hình ảnh phòng</p>
        <div className='dragItemForm' ref={dropAria} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={dropItem}>
            <p className='dragItem_header' ref={tittle}>Kéo và thả để tải file lên</p>
            <span>Hoặc</span>
            <button className='dragItemForm_button' onClick={hanleClickChoose}>Chọn File</button>
            <input hidden type="file" name="avatar" onChange={onChangeInputFile} ref={inputFile} multiple={isMutiForm}/>
        </div>
        <div className='Form-mutiFile_imgs'>
            {
                ArrayImgApi.map((item,index) => (
                    <div className='Form-mutiFile_imgs-item' key={item.id}>
                        <div className='icon-delete' onClick={() => handleDeleteImgApi(index)}>
                            <ClearIcon />
                        </div>
                        <img src={item.galery} alt="" />
                    </div>
                ))
            }
            {
                urlImgs.map((url,index) => (
                    <div className='Form-mutiFile_imgs-item' key={index*10}>
                        <div className='icon-delete' onClick={() => handleDeleteImg(index)}>
                            <ClearIcon />
                        </div>
                        <img src={url} alt="" />
                    </div>
                ))
            }
        </div>
    </form>
    );
}

export default FormMutiFileImg;