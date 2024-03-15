
import axiosClient from "./axiosClient";


const normalApi = {
   getHouse(value){
    return axiosClient.get('normal/getHouse',{params : value})
   },
   getStatusRoom(){
      return axiosClient.get('normal/getStatusRoom')
   },
   getRoom(data){
      return axiosClient.get('normal/getRooms',{params : data})
   },
   getRoomDetail(data){
      return axiosClient.get('normal/getRoomDetail',{params : data})
   },
   getService(data){
      return axiosClient.get('normal/getService',{params : data})
   },
   getJobStatus(data){
      return axiosClient.get('normal/getJobStatus')
   },
   getJobs(data){
      return axiosClient.get('normal/getJobs',{params : data})
   },
   doneJob(data){
      return axiosClient.patch('normal/doneJob',data)
   },
   addElectricBill(data){
      return axiosClient.post('normal/addElectricBill',data)
   },
   getBillElectric(data){
      return axiosClient.get('normal/getBillElectric',{params : data})
   },
   updateElectricBill(data){
      return axiosClient.patch('normal/updateElectricBill',data)
   },
   addWaterBill(data){
      return axiosClient.post('normal/addWaterBill',data)
   },
   getBillWater(data){
      return axiosClient.get('normal/getBillWarter',{params : data})
   },
   updateWaterBill(data){
      return axiosClient.patch('normal/updateWaterBill',data)
   },
   addArise(data){
      return axiosClient.post('normal/addArise',data)
   },
   getArise(data){
      return axiosClient.get('normal/getArise',{params : data})
   },
   updateArise(data){
      return axiosClient.patch('normal/updateArise',data)
   },
   deleteArise(data){
      return axiosClient.post('normal/deleteArise',data)
   },
   addDeposit(data){
      return axiosClient.post('normal/addDeposit',data)
   },
   getDeposit(param){
      return axiosClient.get('normal/getDeposit',{params : param})
   },
   getDepositStatus(param){
      return axiosClient.get('normal/getDepositStatus',{params : param})
   },
   updateDeposit(data){
      return axiosClient.patch('normal/updateDeposit',data)
   },
   deleteDeposit(data){
      return axiosClient.post('admin/deleteDeposit',data)
   },
   cancelDeposit(data){
      return axiosClient.patch('normal/cancelDeposit',data)
   },
   addSpendBill(data){
      return axiosClient.post('normal/addSpendBill',data)
   },
   getSpendBill(data){
      return axiosClient.get('normal/getSpendBill',{params : data})
   },
   updateSpendBill(data){
      return axiosClient.patch('normal/updateSpendBill',data)
   },
   addRecieveBill(data){
      return axiosClient.post('normal/addRecieveBill',data)
   },
   getRecieveBill(data){
      return axiosClient.get('normal/getRecieveBill',{params : data})
   },
   updateRecieveBill(data){
      return axiosClient.patch('normal/updateRecieveBill',data)
   },
   addAsset(data){
      return axiosClient.post('normal/addAsset',data)
   },
   getAsset(data){
      return axiosClient.get('normal/getAsset',{params : data})
   },
   updateAsset(data){
      return axiosClient.patch('normal/updateAsset',data)
   },
   addContract(data){
      return axiosClient.post('normal/addContract',data)
   },
   addServiceToHouse(data){
      return axiosClient.post('normal/addServiceToHouse',data)
   },
   addMemberToHouse(data){
      return axiosClient.post('normal/addMemberToHouse',data)
   },
   getContract(data){
      return axiosClient.get('normal/getContract',{params : data})
   },
   getServiceDetailRoom(data){
      return axiosClient.get('normal/getServiceDetailRoom',{params : data})
   },
   getMemberInHouse(data){
      return axiosClient.get('normal/getMemberInHouse',{params : data})
   },
   updateContract(data){
      return axiosClient.patch('normal/updateContract',data)
   },
   updateServiceToHouse(data){
      return axiosClient.patch('normal/updateServiceToHouse',data)
   },
   updateMemberToHouse(data){
      return axiosClient.patch('normal/updateMemberToHouse',data)
   },
   leaveRoom(data){
      return axiosClient.patch('normal/leaveRoom',data)
   },
   takeRoom(data){
      return axiosClient.patch('normal/takeRoom',data)
   },
   rentOne(data){
      return axiosClient.post('normal/rentOne',data)
   },
   getRent(data){

      return axiosClient.post("normal/getRent",data)
   },
   payMoneyMonth(data){
      return axiosClient.post("normal/payMoneyMonth",data)
   },
   discountPayMonth(data){
      return axiosClient.post("normal/discountPayMonth",data)
   },
   getDisCountMonth(data){
      return axiosClient.get("normal/getDisCountMonth",{params : data})
   },
   rentAll(data){
      return axiosClient.post('normal/rentAll',data)
   },
   getRoomNotDone(data){
      return axiosClient.get('normal/getRoomNotDone',{params : data})
   },
   getContractEndSoon(data){
      return axiosClient.get('normal/getContractEndSoon',{params : data})
   },
   getRentDetail(data){

      return axiosClient.post("normal/getRentDetail",data)
   },
}

export default normalApi;