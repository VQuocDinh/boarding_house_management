const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
const middlewares = require('../controllers/middlewares');


router.get('/getStaff',middlewares.verifyUser,middlewares.verifyAdmin,adminController.getStaff)

router.patch('/updateActive',middlewares.verifyUser,middlewares.verifyAdmin,adminController.updateActive)
router.patch('/updatePassStaff',middlewares.verifyUser,middlewares.verifyAdmin,adminController.changePassStaff)
router.patch('/updateStaff',middlewares.verifyUser,middlewares.verifyAdmin,adminController.updateStaff)
router.post('/addHouse',middlewares.verifyUser,middlewares.verifyAdmin,adminController.addHouse)
router.patch('/changeStatusHouse',middlewares.verifyUser,middlewares.verifyAdmin,adminController.changeStatusHouse)
router.patch('/changeInfoHouse',middlewares.verifyUser,middlewares.verifyAdmin,adminController.updateHouse)
router.post('/addRoleStaff',middlewares.verifyUser,middlewares.verifyAdmin,adminController.AddRoleStaff)
router.get('/getRoleStaff',middlewares.verifyUser,middlewares.verifyAdmin,adminController.getRoleStaff)
router.post('/updateRoleStaff',middlewares.verifyUser,middlewares.verifyAdmin,adminController.updateRoleStaff)
router.post('/addRoom',middlewares.verifyUser,middlewares.verifyAdmin,adminController.addRoom)
router.patch('/updateRoom',middlewares.verifyUser,middlewares.verifyAdmin,adminController.updateRoom)
router.patch('/changeStatusRoom',middlewares.verifyUser,middlewares.verifyAdmin,adminController.ChangeStatusRoom)
router.post('/addService',middlewares.verifyUser,middlewares.verifyAdmin,adminController.addService)
router.patch('/updateService',middlewares.verifyUser,middlewares.verifyAdmin,adminController.updateService)
router.patch('/changeStatusService',middlewares.verifyUser,middlewares.verifyAdmin,adminController.changeStatusService)


router.post('/addJob',middlewares.verifyUser,middlewares.verifyAdmin,adminController.addJob)
router.patch('/deleteJob',middlewares.verifyUser,middlewares.verifyAdmin,adminController.deleteJob)
router.patch('/updateJob',middlewares.verifyUser,middlewares.verifyAdmin,adminController.updateJob)



router.post('/deleteDeposit',middlewares.verifyUser,middlewares.verifyAdmin,adminController.deleteDeposit)
router.post('/deleteSpendBill',middlewares.verifyUser,middlewares.verifyAdmin,adminController.deleteSpendBill)
router.post('/deleteRecieveBill',middlewares.verifyUser,middlewares.verifyAdmin,adminController.deleteRecieveBill)
router.post('/deleteAsset',middlewares.verifyUser,middlewares.verifyAdmin,adminController.deleteAsset)

router.get('/getReportMoney',middlewares.verifyUser,middlewares.verifyAdmin,adminController.getReportMoney)
router.get('/getGuessReport',middlewares.verifyUser,middlewares.verifyAdmin,adminController.getGuessReport)
router.patch('/updateMemberInReport',middlewares.verifyUser,middlewares.verifyAdmin,adminController.updateMemberInReport)
router.patch('/deleteMemberInReport',middlewares.verifyUser,middlewares.verifyAdmin,adminController.deleteMemberInReport)
router.get('/getContracts',middlewares.verifyUser,middlewares.verifyAdmin,adminController.getContracts)
module.exports = router;


