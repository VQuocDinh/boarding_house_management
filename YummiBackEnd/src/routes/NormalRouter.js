const express = require('express');
const normalController = require('../controllers/normalController');
const router = express.Router();
const middlewares = require('../controllers/middlewares');

router.get('/getHouse',middlewares.verifyUser,middlewares.needLogin,normalController.getHouses)
router.get('/getStatusRoom',middlewares.verifyUser,middlewares.needLogin,normalController.getStatusRoom)
router.get('/getRooms',middlewares.verifyUser,middlewares.needLogin,normalController.getRooms)
router.get('/getRoomDetail',middlewares.verifyUser,middlewares.needLogin,normalController.getRoomDetail)
router.get('/getService',middlewares.verifyUser,middlewares.needLogin,normalController.getService)
router.get('/getJobStatus',middlewares.verifyUser,middlewares.needLogin,normalController.getJobStatus)
router.get('/getJobs',middlewares.verifyUser,middlewares.needLogin,normalController.getJobs)
router.patch('/doneJob',middlewares.verifyUser,middlewares.needLogin,normalController.DoneJob)
router.post('/addElectricBill',middlewares.verifyUser,middlewares.needLogin,normalController.addElectricBill)
router.get('/getBillElectric',middlewares.verifyUser,middlewares.needLogin,normalController.getElectricBill)
router.patch('/updateElectricBill',middlewares.verifyUser,middlewares.needLogin,normalController.updateElectricBill)

router.post('/addWaterBill',middlewares.verifyUser,middlewares.needLogin,normalController.addWaterBill)
router.get('/getBillWarter',middlewares.verifyUser,middlewares.needLogin,normalController.getWaterBill)
router.patch('/updateWaterBill',middlewares.verifyUser,middlewares.needLogin,normalController.updateWaterBill)

router.post('/addArise',middlewares.verifyUser,middlewares.needLogin,normalController.addArise)
router.get('/getArise',middlewares.verifyUser,middlewares.needLogin,normalController.getArise)
router.patch('/updateArise',middlewares.verifyUser,middlewares.needLogin,normalController.updateArise)
router.post('/deleteArise',middlewares.verifyUser,middlewares.needLogin,normalController.deleteArise)

router.post('/addDeposit',middlewares.verifyUser,middlewares.needLogin,normalController.addDeposit)
router.get('/getDeposit',middlewares.verifyUser,middlewares.needLogin,normalController.getDeposit)
router.get('/getDepositStatus',middlewares.verifyUser,middlewares.needLogin,normalController.getStatusDeposit)
router.patch('/updateDeposit',middlewares.verifyUser,middlewares.needLogin,normalController.updateDeposit)
router.patch('/cancelDeposit',middlewares.verifyUser,middlewares.needLogin,normalController.cancelDeposit)

router.post('/addSpendBill',middlewares.verifyUser,middlewares.needLogin,normalController.addSpendBill)
router.get('/getSpendBill',middlewares.verifyUser,middlewares.needLogin,normalController.getSpendBill)
router.patch('/updateSpendBill',middlewares.verifyUser,middlewares.needLogin,normalController.updateSpendBill)

router.post('/addRecieveBill',middlewares.verifyUser,middlewares.needLogin,normalController.addRecieveBill)
router.get('/getRecieveBill',middlewares.verifyUser,middlewares.needLogin,normalController.getRecieveBill)
router.patch('/updateRecieveBill',middlewares.verifyUser,middlewares.needLogin,normalController.updateRecieveBill)


router.post('/addAsset',middlewares.verifyUser,middlewares.needLogin,normalController.addAsset)
router.get('/getAsset',middlewares.verifyUser,middlewares.needLogin,normalController.getAsset)
router.patch('/updateAsset',middlewares.verifyUser,middlewares.needLogin,normalController.updateAsset)

router.post('/addContract',middlewares.verifyUser,middlewares.needLogin,normalController.addContract)
router.post('/addServiceToHouse',middlewares.verifyUser,middlewares.needLogin,normalController.addServiceToHouse)
router.post('/addMemberToHouse',middlewares.verifyUser,middlewares.needLogin,normalController.addMemberToHouse)

router.get('/getContract',middlewares.verifyUser,middlewares.needLogin,normalController.getContract)
router.get('/getServiceDetailRoom',middlewares.verifyUser,middlewares.needLogin,normalController.getServiceDetailRoom)
router.get('/getMemberInHouse',middlewares.verifyUser,middlewares.needLogin,normalController.getMemberInHouse)

router.patch('/updateContract',middlewares.verifyUser,middlewares.needLogin,normalController.updateContract)
router.patch('/updateServiceToHouse',middlewares.verifyUser,middlewares.needLogin,normalController.updateServiceToHouse)
router.patch('/updateMemberToHouse',middlewares.verifyUser,middlewares.needLogin,normalController.updateMemberToHouse)

router.patch('/leaveRoom',middlewares.verifyUser,middlewares.needLogin,normalController.leaveRoom)
router.patch('/takeRoom',middlewares.verifyUser,middlewares.needLogin,normalController.takeRoom)


router.post('/rentOne',middlewares.verifyUser,middlewares.needLogin,normalController.rentOne)
router.post('/getRent',middlewares.verifyUser,middlewares.needLogin,normalController.getRent)
router.post('/payMoneyMonth',middlewares.verifyUser,middlewares.needLogin,normalController.payMoneyMonth)
router.post('/discountPayMonth',middlewares.verifyUser,middlewares.needLogin,normalController.discountPayMonth)
router.get('/getDisCountMonth',middlewares.verifyUser,middlewares.needLogin,normalController.getDisCountMonth)
router.post('/rentAll',middlewares.verifyUser,middlewares.needLogin,normalController.rentAll)

router.post('/getRentDetail',middlewares.verifyUser,middlewares.needLogin,normalController.getRentDetail)
router.get('/getRoomNotDone',middlewares.verifyUser,middlewares.needLogin,normalController.getRoomNotDone)
router.get('/getContractEndSoon',middlewares.verifyUser,middlewares.needLogin,normalController.getContractEndSoon)


module.exports = router;


