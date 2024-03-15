import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from '../Components/Login/LoginSlice'


const rootReducer = {
    user : LoginReducer
}

const store = configureStore({
    reducer : rootReducer
})

export default store;