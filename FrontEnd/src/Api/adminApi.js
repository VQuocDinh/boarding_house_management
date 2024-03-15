
import axiosClient from "./axiosClient";


const adminApi = {
    getStaff(value){
        return axiosClient.get('/admin/getStaff',{params : value})
    },
    updateActive(data){
        return axiosClient.patch('/admin/updateActive',data)
    },
    updatePassStaff(data){
        return axiosClient.patch('/admin/updatePassStaff',data)
    },
    updateStaff(data){
        return axiosClient.patch('/admin/updateStaff',data)
    },
    addHouse(data){
        return axiosClient.post('/admin/addHouse',data)
    },
    changeStatusHouse(data){
        return axiosClient.patch('/admin/changeStatusHouse',data)
    },
    changeInfoHouse(data){
        return axiosClient.patch('/admin/changeInfoHouse',data)
    },
    addRoleStaff(data){
        return axiosClient.post('/admin/addRoleStaff',data)
    },
    getRoleStaff(params){
        return axiosClient.get('/admin/getRoleStaff',{params : params})
    },
    updateRoleStaff(data){
        return axiosClient.post('/admin/updateRoleStaff',data)
    },
    addRoom(value){
        var formData = new FormData();
        formData.append("house_id",value.house_id)
        formData.append("status_room",value.status_room)
        formData.append("room_number",value.room_number)
        formData.append("price",value.price)
        formData.append("length",value.length)
        formData.append("width",value.width)
        formData.append("people_number",value.people_number)
        formData.append("describe",value.describe)
        value.imgs.forEach(item => {
            formData.append("imgs",item)
        })
        return axiosClient.post("admin/addRoom",formData)
    },
    updateRoom(value){
        var formData = new FormData();
        formData.append("id",value.id)
        formData.append("house_id",value.house_id)
        formData.append("status_room",value.status_room)
        formData.append("room_number",value.room_number)
        formData.append("price",value.price)
        formData.append("length",value.length)
        formData.append("width",value.width)
        formData.append("people_number",value.people_number)
        formData.append("describe",value.describe)
        value.imgs.forEach(item => {
            formData.append("imgs",item)
        })
        formData.append("deleteImgs",JSON.stringify(value.deleteImgs))
        return axiosClient.patch("admin/updateRoom",formData)
    },
    lockRoom(value){
        return axiosClient.patch('admin/changeStatusRoom',value)
    },
    addService(value){
        return axiosClient.post('admin/addService',value)
    },
    updateService(value){
        return axiosClient.patch('admin/updateService',value)
    },
    changeService(value){
        return axiosClient.patch('admin/changeStatusService',value)
    },
    addJob(value){
        return axiosClient.post('admin/addJob',value)
    },
    deleteJob(data){
        return axiosClient.patch('admin/deleteJob',data)
    },
    updateJob(data){
        return axiosClient.patch('admin/updateJob',data)
    },
    deleteSpendBill(data){
        return axiosClient.post('admin/deleteSpendBill',data)
    },
    deleteRecieveBill(data){
        return axiosClient.post('admin/deleteRecieveBill',data)
    },
    deleteAsset(data){
        return axiosClient.post('admin/deleteAsset',data)
    },
    getReportMoney(data){
        return axiosClient.get('admin/getReportMoney',{params : data})
    },
    getGuessReport(data){
        return axiosClient.get('admin/getGuessReport',{params : data})
    },
    updateMemberInReport(data){
        return axiosClient.patch('admin/updateMemberInReport',data)
    },
    deleteMemberInReport(data){
        return axiosClient.patch('admin/deleteMemberInReport',data)
    },
    getContracts(data){
        return axiosClient.get('admin/getContracts',{params : data})
    }
}

export default adminApi;