const pool = require("../app/configDB");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require("fs");
const { nextTick } = require("process");
const { promise } = require("../app/configDB");

class normalController{
    
    async getHouses(req,res){
        const {status,name} = req.query;
        let stringSql = "";
        const poolPromise = pool.promise()
        if(req.userNormal.isAdmin == 1){
            stringSql = "SELECT * FROM `house` where id > 0 "
        }
        else {
            stringSql = `SELECT * FROM house WHERE id IN (${req.userNormal.area ? req.userNormal.area : ""}) `
        }
        if(status){
            stringSql = stringSql + `AND status = ${status} `
        }
        if(name){
            stringSql = stringSql + `AND name_house like "%${name}%" `
        }
        stringSql += `ORDER BY house.id DESC `
        try {
            const [records,fields] = await poolPromise.execute(stringSql)
            res.status(200).json({
                data : records
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy nhà không thành công !"
            })
        }
        
    }

    async getStatusRoom(req,res){
        const poolPromise = pool.promise()
        try {
            const [records,fields] = await poolPromise.execute("select * from status_room")
            return res.status(200).json({
                data : records
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy trạng thái phòng không thành công !"
            })
        }
    }

    async getRooms(req,res){
        const poolPromise = pool.promise();
        const {idRoom,status,name} = req.query;
        let stringSql = `select * from room where House_id = ${idRoom} `;
        if(status){
            stringSql = stringSql + `AND status_room = ${status} `
        }
        if(name){
            stringSql = stringSql + `AND room_number like "%${name}%" `
        }
        stringSql += `ORDER BY id DESC`
        try {
            const [recordsRoom ,fieldsRoom] = await poolPromise.execute(stringSql)
            return res.status(200).json({
                data : recordsRoom
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phòng không thành công !"
            })
        } 
    }

    async getRoomDetail(req,res){
        const poolPromise = pool.promise();
        const {id} = req.query;
        try {
            const [recordsRoom,fieldsRoom] = await poolPromise.execute("select * from room where id = ?",[id])
            const [recordsGalery,fieldsGalery] = await poolPromise.execute("select * from galery_room where room_id = ?",[id])
            recordsRoom[0].galery = recordsGalery
            return res.status(200).json({
                data : recordsRoom
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phòng không thành công !"
            })
        }
    }

    async getService(req,res){
        const poolPromise = pool.promise();
        const {nameService,status} = req.query;
        let stringSql = `select * from service where id > 0 `
        if(nameService)
        {
            stringSql = stringSql + `AND name like "%${nameService}%" `
        }
        if(status)
        {
            stringSql += `and status = ${status} `
        }
        stringSql += `ORDER BY id DESC `
        try {
            const [records,fields] = await poolPromise.execute(stringSql);
            return res.status(200).json({
                data : records
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy dịch vụ không thành công !"
            })
        }
    }

    async getJobStatus(req,res){
        const poolPromise = pool.promise();
        try {
            const [records,fields] = await poolPromise.execute("select * from todolist_status");
            return res.status(200).json({
                data : records
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy trạng thái công việc không thành công !"
            })
        }
    }

    async getJobs(req,res){
        const poolPromise = pool.promise();
        const {limit,page,time,status,note} = req.query; 
        let stringSql = `select * from todolist where id > 0 `;
        if(time)
        {
            const newTime = time.split("/")[1];
            const newYear = time.split("/")[2];
            stringSql += `and MONTH(todolist.time) = ${newTime} and YEAR(todolist.time) = ${newYear} `
        }
        if(status){
            stringSql += `and todolist_status = ${status} `
        }
        if(note){
            stringSql += `and todolist.describe like "%${note}%" `
        }
        const tempArray = stringSql.split(" ");
        tempArray[1] = "COUNT(*) as count";
        const stringCountSql = tempArray.join(" ");
        const offset = (page - 1)*limit;
        stringSql += `ORDER BY id DESC `
        stringSql += `LIMIT ${limit} OFFSET ${offset} `
        try {
            const [recordsJob,fieldsJob] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            for(let i = 0; i < recordsJob.length ; i++)
            {
                const [recordsDetail,fieldsDetail] = await poolPromise.execute("SELECT todolist_detail.id,todolist_detail.room_id,room.room_number,house.id as house_id,house.name_house FROM `todolist_detail` LEFT JOIN (room LEFT JOIN house on room.House_id = house.id) ON todolist_detail.room_id = room.id where todolist_detail.todo_id = ?",[recordsJob[i].id])
                recordsJob[i].room = recordsDetail
            }
            return res.status(200).json({
                data : recordsJob,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy công việc không thành công !"
            })
        }
    }

    async DoneJob(req,res){
        const poolPromise = pool.promise();
        const {idJob,statusJob,timeDone,room} = req.body; 
        const newStringTime = timeDone.split("/").reverse().join("-")
        const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
        const JobArea = Array.from(new Set(room.map(item => item.house_id)))
        // console.log(req.userNormal);
        // let canChange = false;
        // for(let i = 0 ; i < arrayArea ; i++)
        // {
        //     if(JobArea.includes(arrayArea[i])){
        //         canChange = true
        //     }
        // }
        // if(req.userNormal.isAdmin == 1)
        // {
        //     canChange = true
        // }
        // if(canChange)
        // {
            try {
                const [records,fields] = await poolPromise.execute("update todolist set `todolist_status`=?,`done_time`=? where id = ?",[statusJob,newStringTime,idJob])
                return res.status(200).json({
                    message : "Đánh giấu hoàn thành thành công !"
                })
            } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Đánh giấu hoàn thành không thành công !"
                })
            }
        // }
        // else{
        //     return res.status(400).json({
        //         message : "Bạn không có quyền để thực hiện việc này !"
        //     })
        // }
    }

    async addElectricBill(req,res)
    {
        const poolPromise = pool.promise();
        const {room_id,oldNumber,newNumber,from_time,to_time,current_time,price,idUser,nameUser} = req.body;
        const newFrom = from_time.split("/").reverse().join("-")
        const newTo = to_time.split("/").reverse().join("-")
        const newTimeCurrent = current_time.split("/").reverse().join("-")
        if(new Date(newFrom).getTime() >= new Date(newTo).getTime())
        {
            return res.status(400).json({
                message : "Ngày tháng năm không hợp lệ !"
            })
        }
        try {
            const [recordsCheck,fieldsCheck] = await poolPromise.execute("SELECT * FROM `electric_bill` WHERE ? < to_time and from_time < ? and room_id = ?",[newFrom,newTo,room_id]);
            if(recordsCheck.length !== 0)
            {
                return res.status(400).json({
                    message : "Hóa đơn tháng đã tồn tại !"
                })
            }
            const [records,fields] = await poolPromise.execute("insert into `electric_bill` (`idUser`,`nameUser`,`room_id`,`old`,`new`,`from_time`,`to_time`,`current_time`,`price`) values (?,?,?,?,?,?,?,?,?)",[idUser,nameUser,room_id,oldNumber,newNumber,newFrom,newTo,newTimeCurrent,price]);
            return res.status(200).json({
                message : "Thêm hóa đơn thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Thêm hóa đơn không thành công !"
                })
        }
    }

    async getElectricBill(req,res){
        const poolPromise = pool.promise();
        const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
        const stringArea = arrayArea.join(",");
        const {limit,page,time,house,statusRoom} = req.query; 
        let stringSql = `SELECT electric_bill.id as billId, electric_bill.idUser , electric_bill.nameUser , electric_bill.old, electric_bill.new, electric_bill.from_time, electric_bill.to_time , electric_bill.current_time , electric_bill.price , room.room_number , room.id as room_id,house.id as house_id, house.name_house FROM electric_bill LEFT JOIN ((room LEFT JOIN status_room ON room.status_room = status_room.id) LEFT JOIN house ON room.House_id = house.id) ON electric_bill.room_id = room.id `;
        let stringCountSql = `SELECT COUNT(*) as count FROM electric_bill LEFT JOIN ((room LEFT JOIN status_room ON room.status_room = status_room.id) LEFT JOIN house ON room.House_id = house.id) ON electric_bill.room_id = room.id `
        if(req.userNormal.isAdmin == 1)
        {
            stringSql += `where electric_bill.id > 0 `
            stringCountSql += `where electric_bill.id > 0 `
        }
        else{
            if(stringArea)
            {
                stringSql += `where house.id IN (${stringArea}) `;
                stringCountSql += `where house.id IN (${stringArea}) `
            }
            else{
                stringSql += `where house.id IN ("${stringArea}") `;
                stringCountSql += `where house.id IN ("${stringArea}") `
            }
        }

        if(time)
        {
            const newTime = time.split("/")[1];
            const newYear = time.split("/")[2];
            stringSql += `and MONTH(electric_bill.from_time) = ${newTime} and YEAR(electric_bill.from_time) = ${newYear} `
            stringCountSql += `and MONTH(electric_bill.from_time) = ${newTime} and YEAR(electric_bill.from_time) = ${newYear} `
        }

        if(house)
        {
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
        }

        if(statusRoom)
        {
            stringSql += `and status_room.id = ${statusRoom} `
            stringCountSql += `and status_room.id = ${statusRoom} `
        }
        
        const offset = (page - 1)*limit;
        stringSql += `ORDER BY electric_bill.id DESC `
        stringSql += `LIMIT ${limit} OFFSET ${offset}`
        try {
            const [recordsBill,fieldsBill] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            return res.status(200).json({
                data : recordsBill,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phiếu điện không thành công !"
            })
        }
    }

    async updateElectricBill(req,res){
        const poolPromise = pool.promise();
        const {room_id,oldNumber,newNumber,from_time,to_time,current_time,price,idUser,nameUser,id} = req.body;
        console.log(req.body);
        const newFrom = from_time.split("/").reverse().join("-")
        const newTo = to_time.split("/").reverse().join("-")
        const newTimeCurrent = current_time.split("/").reverse().join("-")

        if(new Date(newFrom).getTime() >= new Date(newTo).getTime())
        {
            return res.status(400).json({
                message : "Ngày tháng năm không hợp lệ !"
            })
        }
        try {
            const [recordsCheck,fieldsCheck] = await poolPromise.execute("SELECT * FROM `electric_bill` WHERE ? < to_time and from_time < ? and room_id = ? and id <> ?",[newFrom,newTo,room_id,id]);
            if(recordsCheck.length !== 0)
            {
                return res.status(400).json({
                    message : "Hóa đơn tháng đã tồn tại !"
                })
            }
            const [records,fields] = await poolPromise.execute("update `electric_bill` set `idUser` = ?, `nameUser` = ?, `room_id` = ?, `old` = ?, `new` = ?, `from_time` = ?, `to_time` = ?, `current_time` = ?, `price` = ? where id = ?",[idUser,nameUser,room_id,oldNumber,newNumber,newFrom,newTo,newTimeCurrent,price,id]);
            return res.status(200).json({
                message : "Cập nhật hóa đơn thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Cập nhật hóa đơn không thành công !"
                })
        }
    }


    async addWaterBill(req,res)
    {
        const poolPromise = pool.promise();
        const {room_id,oldNumber,newNumber,from_time,to_time,current_time,price,idUser,nameUser} = req.body;
        const newFrom = from_time.split("/").reverse().join("-")
        const newTo = to_time.split("/").reverse().join("-")
        const newTimeCurrent = current_time.split("/").reverse().join("-")
        if(new Date(newFrom).getTime() >= new Date(newTo).getTime())
        {
            return res.status(400).json({
                message : "Ngày tháng năm không hợp lệ !"
            })
        }
        try {
            const [recordsCheck,fieldsCheck] = await poolPromise.execute("SELECT * FROM `water_bill` WHERE ? < to_time and from_time < ? and room_id = ?",[newFrom,newTo,room_id]);
            if(recordsCheck.length !== 0)
            {
                return res.status(400).json({
                    message : "Hóa đơn tháng đã tồn tại !"
                })
            }
            const [records,fields] = await poolPromise.execute("insert into `water_bill` (`idUser`,`nameUser`,`room_id`,`old`,`new`,`from_time`,`to_time`,`current_time`,`price`) values (?,?,?,?,?,?,?,?,?)",[idUser,nameUser,room_id,oldNumber,newNumber,newFrom,newTo,newTimeCurrent,price]);
            return res.status(200).json({
                message : "Thêm hóa đơn thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Thêm hóa đơn không thành công !"
                })
        }
    }

    async getWaterBill(req,res){
        const poolPromise = pool.promise();
        const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
        const stringArea = arrayArea.join(",");
        const {limit,page,time,house,statusRoom} = req.query; 
        let stringSql = `SELECT water_bill.id as billId, water_bill.idUser , water_bill.nameUser , water_bill.old, water_bill.new, water_bill.from_time,water_bill.to_time , water_bill.current_time , water_bill.price , room.room_number , room.id as room_id,house.id as house_id, house.name_house FROM water_bill LEFT JOIN ((room LEFT JOIN status_room ON room.status_room = status_room.id) LEFT JOIN house ON room.House_id = house.id) ON water_bill.room_id = room.id `;
        let stringCountSql = `SELECT COUNT(*) as count FROM water_bill LEFT JOIN ((room LEFT JOIN status_room ON room.status_room = status_room.id) LEFT JOIN house ON room.House_id = house.id) ON water_bill.room_id = room.id `
        if(req.userNormal.isAdmin == 1)
        {
            stringSql += `where water_bill.id > 0 `
            stringCountSql += `where water_bill.id > 0 `
        }
        else{
            if(stringArea)
            {
                stringSql += `where house.id IN (${stringArea}) `;
                stringCountSql += `where house.id IN (${stringArea}) `
            }
            else{
                stringSql += `where house.id IN ("${stringArea}") `;
                stringCountSql += `where house.id IN ("${stringArea}") `
            }
        }

        if(time)
        {
            const newTime = time.split("/")[1]
            const newYear = time.split("/")[2];
            stringSql += `and MONTH(water_bill.from_time) = ${newTime} and YEAR(water_bill.from_time) = ${newYear} `
            stringCountSql += `and MONTH(water_bill.from_time) = ${newTime} and YEAR(water_bill.from_time) = ${newYear} `
        }

        if(house)
        {
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
        }

        if(statusRoom)
        {
            stringSql += `and status_room.id = ${statusRoom} `
            stringCountSql += `and status_room.id = ${statusRoom} `
        }
        
        const offset = (page - 1)*limit;
        stringSql += `ORDER BY water_bill.id DESC `
        stringSql += `LIMIT ${limit} OFFSET ${offset}`
        try {
            const [recordsBill,fieldsBill] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            return res.status(200).json({
                data : recordsBill,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phiếu nước không thành công !"
            })
        }
    }

    async updateWaterBill(req,res){
        const poolPromise = pool.promise();
        const {room_id,oldNumber,newNumber,from_time,to_time,current_time,price,idUser,nameUser,id} = req.body;
        const newFrom = from_time.split("/").reverse().join("-")
        const newTo= to_time.split("/").reverse().join("-")
        const newTimeCurrent = current_time.split("/").reverse().join("-")
        if(new Date(newFrom).getTime() >= new Date(newTo).getTime())
        {
            return res.status(400).json({
                message : "Ngày tháng năm không hợp lệ !"
            })
        }
        // const monthTime = time.split("/")[1];
        try {
            const [recordsCheck,fieldsCheck] = await poolPromise.execute("SELECT * FROM `water_bill` WHERE ? < to_time and from_time < ? and room_id = ? and id <> ?",[newFrom,newTo,room_id,id]);
            if(recordsCheck.length !== 0)
            {
                return res.status(400).json({
                    message : "Hóa đơn tháng đã tồn tại !"
                })
            }
            const [records,fields] = await poolPromise.execute("update `water_bill` set `idUser` = ?, `nameUser` = ?, `room_id` = ?, `old` = ?, `new` = ?, `from_time` = ?, `to_time` = ? , `current_time` = ?, `price` = ? where id = ?",[idUser,nameUser,room_id,oldNumber,newNumber,newFrom,newTo,newTimeCurrent,price,id]);
            return res.status(200).json({
                message : "Cập nhật hóa đơn thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Cập nhật hóa đơn không thành công !"
                })
        }
    }

    async addArise(req,res){
        const poolPromise = pool.promise();
        const {idUser,time,nameUser,price,note,room_id} = req.body;
        const newTime = time.split('/').reverse().join('-');
        try {
            const [recordsJob,fieldsJob] = await poolPromise.execute("INSERT INTO `arise` (`idUser`, `nameUser`, `price`, `time`, `note`) VALUES (?,?,?,?,?)",[idUser,nameUser,price,newTime,note]);
            const idArise = recordsJob.insertId;
            for(let i = 0 ; i < room_id.length ; i++){
                const [recordsDetail,fieldsDetail] = await poolPromise.execute("INSERT INTO `arise_detail` (`room_id`, `arise_id`) VALUES (?,?)",[room_id[i],idArise])
            }
            return res.status(200).json({
                message : "Thêm phiếu phát sinh thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Thêm phiếu phát sinh thất bại !"
            })
        }
    }

    async getArise(req,res){
        const poolPromise = pool.promise();
        const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
        const stringArea = arrayArea.join(",");
        const {limit,page,time,house,note} = req.query; 
        let stringSql = `SELECT arise.id FROM arise LEFT JOIN (arise_detail LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON arise_detail.room_id = room.id) ON arise.id = arise_detail.arise_id where arise.id > 0 `;
        if(time)
        {
            const newTime = time.split("/")[1]
            const newYear = time.split("/")[2]  
            stringSql += `and MONTH(arise.time) = ${newTime} and YEAR(arise.time) = ${newYear} `
        }
        if(house)
        {
            stringSql += `and house.id = ${house} `
        }
        if(note)
        {
            stringSql += `and arise.note like "%${note}%" `
        }
        if(req.userNormal.isAdmin == 2){
            const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
            const stringArea = arrayArea.join(",");
            if(stringArea)
            {
                stringSql += `and house.id IN (${stringArea}) `;
            }
            else{
                return res.status(200).json({
                    data : [],
                    count : 0
                })
            }
        }
        const offset = (page - 1)*limit;
        try {
            const [recordsAriseId,fieldsAriseId] = await poolPromise.execute(stringSql);
            const tempArray = recordsAriseId.map(item => {return item.id});
            const arrayGet = Array.from(new Set(tempArray));
            const StringId = arrayGet.join(",") 
            if(arrayGet.length == 0)
            {
                return res.status(200).json({
                    data : [],
                    count : 0
                })
            }

            let [recordsArise,fieldsArise] = await poolPromise.execute(`Select * from arise where arise.id IN (${StringId}) ORDER BY arise.id DESC LIMIT ${limit} OFFSET ${offset}`)
            for(let i = 0; i < recordsArise.length ; i++)
            {
                const [recordsDetail,fieldsDetail] = await poolPromise.execute("SELECT arise_detail.id,arise_detail.room_id,room.room_number,house.id as house_id,house.name_house FROM `arise_detail` LEFT JOIN (room LEFT JOIN house on room.House_id = house.id) ON arise_detail.room_id = room.id where arise_detail.arise_id = ?",[recordsArise[i].id])
                recordsArise[i].room = recordsDetail
            }
            return res.status(200).json({
                data : recordsArise,
                count : arrayGet.length
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phiếu phát sinh không thành công !"
            })
        }
    }

    async updateArise(req,res){
        const poolPromise = pool.promise();
        const {id,idUser,nameUser,note,price,room_id,time} = req.body;
        const newTime = time.split('/').reverse().join('-');
        try {
            const [recordsJob,fieldsJob] = await poolPromise.execute("update `arise` SET idUser = ?, nameUser = ?, price = ?, time = ?, note = ? where id = ?",[idUser,nameUser,price,newTime,note,id]);
            const [recordsDeleteDetail,fieldsDeleteDetail] = await poolPromise.execute("delete from arise_detail where arise_id = ?",[id])
            for(let i = 0 ; i < room_id.length ; i++){
                const [recordsDetail,fieldsDetail] = await poolPromise.execute("INSERT INTO `arise_detail` (`room_id`, `arise_id`) VALUES (?,?)",[room_id[i],id])
            }
            return res.status(200).json({
                message : "Cập nhật phiếu phát sinh thành công !"
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Cập nhật phiếu phát sinh không thành công !"
            })
        }
    }

    async deleteArise(req,res){
        const poolPromise = pool.promise();
        const {id} = req.body;
        try {
            const [recordsDeleteDetail,fieldsDeleteDetail] = await poolPromise.execute("delete from arise_detail where arise_id = ?",[id])
            const [records,fields] = await poolPromise.execute("delete from arise where id = ?",[id])
            return res.status(200).json({
                message : "Xóa phiếu phát sinh thành công !"
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Xóa phiếu phát sinh không thành công !"
            })
        }
    }

    async addDeposit(req,res)
    {
        const poolPromise = pool.promise();
        const {day_come,idUser,money_deposit,nameUser,name_person,note,phone_number,room_id} = req.body;
        const newTime = day_come.split("/").reverse().join("-")
        
        try {
            const [records,fields] = await poolPromise.execute("insert into `deposit` (`idUser`,`nameUser`,`room_id`,`name_person`,`phone_number`,`money_deposit`,`day_come`,`note`) values (?,?,?,?,?,?,?,?)",[idUser,nameUser,room_id,name_person,phone_number,money_deposit,newTime,note]);
            const [recordsRoom,fieldsRooms] = await poolPromise.execute("update room set status_room = ? where id = ?",[3,room_id]);
            return res.status(200).json({
                message : "Thêm phiếu đặt cọc thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Thêm phiếu đặt cọc không thành công !"
                })
        }
    }

    async getDeposit(req,res){
        const poolPromise = pool.promise();
        const {limit,page,time,house,status} = req.query; 
        let stringSql = `SELECT deposit.id,deposit.status,deposit.idUser,deposit.nameUser,deposit.room_id,deposit.name_person,deposit.phone_number,deposit.time,deposit.money_deposit,deposit.day_come,deposit.note,house.name_house,house.id as houseId,room.room_number FROM deposit LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON deposit.room_id =room.id where deposit.id > 0 `;
        let stringCountSql = `SELECT COUNT(*) as count FROM deposit LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON deposit.room_id =room.id where deposit.id > 0 `;
        if(time)
        {
            const newTime = time.split("/")[1]
            const newYear = time.split("/")[2]
            stringSql += `and MONTH(deposit.time) = ${newTime} and YEAR(deposit.time) = ${newYear} `
            stringCountSql += `and MONTH(deposit.time) = ${newTime} and YEAR(deposit.time) = ${newYear} `
        }
        if(house)
        {
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
        }
        if(status)
        {
            stringSql += `and deposit.status = ${status} `
            stringCountSql += `and deposit.status = ${status} `
        }

        if(req.userNormal.isAdmin == 2){
            const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
            const stringArea = arrayArea.join(",");
            if(stringArea)
            {
                stringSql += `and house.id IN (${stringArea}) `;
            }
            else{
                return res.status(200).json({
                    data : [],
                    count : 0
                })
            }
        }

        const offset = (page - 1)*limit;
        stringSql += `ORDER BY deposit.id DESC `
        stringSql += `LIMIT ${limit} OFFSET ${offset}`
        try {
            const [recordsJob,fieldsJob] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            return res.status(200).json({
                data : recordsJob,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phiếu đặt cọc trước không thành công !"
            })
        }
    }

    async getStatusDeposit(req,res){
        const poolPromise = pool.promise();
        try {
            const [records,fields] = await poolPromise.execute("select * from deposit_status");
            return res.status(200).json({
                data : records
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy trạng thái phiếu đặt cọc trước không thành công !"
            })
        }
    }

    async updateDeposit(req,res){
        const poolPromise = pool.promise();
        const {day_come,id,idUser,money_deposit,nameUser,name_person,note,phone_number,room_id,oldRoomId} = req.body;
        const newTime = day_come.split("/").reverse().join("-")
        try {
            const [recordsUpdateRoom,fieldsUpdateRoom] = await poolPromise.execute("update room SET status_room = 1 where id = ?",[oldRoomId])
            const [records,fields] = await poolPromise.execute("update `deposit` SET `idUser` = ?,`nameUser` = ?,`room_id` = ?,`name_person` = ?,`phone_number` = ?,`money_deposit` = ?,`day_come` = ?,`note` = ? where id = ?",[idUser,nameUser,room_id,name_person,phone_number,money_deposit,newTime,note,id]);
            const [recordsUpdateRoomNew,fieldsUpdateRoomNew] = await poolPromise.execute("update room SET status_room = 3 where id = ?",[room_id])
            return res.status(200).json({
                message : "Cập nhật phiếu đặt cọc thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Cập nhật phiếu đặt cọc không thành công !"
                })
        }
    }


    async cancelDeposit(req,res){
        const poolPromise = pool.promise();
        const {id,idRoom} = req.body;
        try {
            const [recordsUpdateRoom,fieldsUpdateRoom] = await poolPromise.execute("update room SET status_room = 1 where id = ?",[idRoom])
            const [records,fields] = await poolPromise.execute("update deposit set status = 3 where id = ?",[id])
            return res.status(200).json({
                message : "Hủy đơn thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Hủy đơn không thành công !"
                })
        }
    }


    async addSpendBill(req,res)
    {
        const poolPromise = pool.promise();
        const {idUser,price,nameUser,receiver,reason,room_id,time} = req.body;
        const newTime = time.split("/").reverse().join("-")
        try {
            const [records,fields] = await poolPromise.execute("insert into `spend_bill` (`idUser`, `nameUser`, `room_id`, `time`, `price`, `receiver`, `reason`) values (?,?,?,?,?,?,?)",[idUser,nameUser,room_id,newTime,price,receiver,reason]);
            return res.status(200).json({
                message : "Thêm phiếu thu thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Thêm phiếu thu không thành công !"
                })
        }
    }

    async getSpendBill(req,res){
        const poolPromise = pool.promise();
        const {limit,page,time,house,note} = req.query; 
        let stringSql = `SELECT spend_bill.id,spend_bill.idUser,spend_bill.nameUser,spend_bill.room_id,spend_bill.time,spend_bill.price,spend_bill.receiver,spend_bill.reason,room.room_number,house.id as houseId, house.name_house FROM spend_bill LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON spend_bill.room_id = room.id where spend_bill.id > 0 `;
        let stringCountSql = `SELECT COUNT(*) as count FROM spend_bill LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON spend_bill.room_id = room.id where spend_bill.id > 0 `;
        if(time)
        {
            const newTime = time.split("/")[1]
            const newYear = time.split("/")[2]
            stringSql += `and MONTH(spend_bill.time) = ${newTime} and YEAR(spend_bill.time) = ${newYear} `
            stringCountSql += `and MONTH(spend_bill.time) = ${newTime} and YEAR(spend_bill.time) = ${newYear} `
        }
        if(house)
        {
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
        }
        if(note)
        {
            stringSql += `and spend_bill.reason LIKE "%${note}%" `
            stringCountSql += `and spend_bill.reason LIKE "%${note}%" `
        }
       

        if(req.userNormal.isAdmin == 2){
            const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
            const stringArea = arrayArea.join(",");
            if(stringArea)
            {
                stringSql += `and house.id IN (${stringArea}) `;
            }
            else{
                return res.status(200).json({
                    data : [],
                    count : 0
                })
            }
        }

        const offset = (page - 1)*limit;
        stringSql += `ORDER BY spend_bill.id DESC `
        stringSql += `LIMIT ${limit} OFFSET ${offset}`
        try {
            const [records,fields] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            return res.status(200).json({
                data : records,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phiếu thu không thành công !"
            })
        }
    }


    async updateSpendBill(req,res)
    {
        const poolPromise = pool.promise();
        const {id,idUser,price,nameUser,receiver,reason,room_id,time} = req.body;
        const newTime = time.split("/").reverse().join("-")
        try {
            const [records,fields] = await poolPromise.execute("update `spend_bill` SET `idUser` = ?, `nameUser` = ?, `room_id` = ?, `time` = ?, `price` = ?, `receiver` = ?, `reason` = ? where id = ?",[idUser,nameUser,room_id,newTime,price,receiver,reason,id]);
            return res.status(200).json({
                message : "Cập nhật phiếu thu thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Cập nhật phiếu thu không thành công !"
                })
        }
    }


    async addRecieveBill(req,res)
    {
        const poolPromise = pool.promise();
        const {idUser,price,nameUser,receiver,reason,room_id,time} = req.body;
        const newTime = time.split("/").reverse().join("-")
        try {
            const [records,fields] = await poolPromise.execute("insert into `receive_bill` (`idUser`, `nameUser`, `room_id`, `time`, `price`, `receiver`, `reason`) values (?,?,?,?,?,?,?)",[idUser,nameUser,room_id,newTime,price,receiver,reason]);
            return res.status(200).json({
                message : "Thêm phiếu thu thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Thêm phiếu thu không thành công !"
                })
        }
    }

    async getRecieveBill(req,res){
        const poolPromise = pool.promise();
        const {limit,page,time,house,note} = req.query; 
        let stringSql = `SELECT receive_bill.id,receive_bill.idUser,receive_bill.nameUser,receive_bill.room_id,receive_bill.time,receive_bill.price,receive_bill.receiver,receive_bill.reason,room.room_number,house.id as houseId, house.name_house FROM receive_bill LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON receive_bill.room_id = room.id where receive_bill.id > 0 `;
        let stringCountSql = `SELECT COUNT(*) as count FROM receive_bill LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON receive_bill.room_id = room.id where receive_bill.id > 0 `;
        if(time)
        {
            const newTime = time.split("/")[1]
            const newYear = time.split("/")[2]
            stringSql += `and MONTH(receive_bill.time) = ${newTime} and YEAR(receive_bill.time) = ${newYear} `
            stringCountSql += `and MONTH(receive_bill.time) = ${newTime} and YEAR(receive_bill.time) = ${newYear} `
        }
        if(house)
        {
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
        }
        if(note)
        {
            stringSql += `and receive_bill.reason LIKE "%${note}%" `
            stringCountSql += `and receive_bill.reason LIKE "%${note}%" `
        }
       

        if(req.userNormal.isAdmin == 2){
            const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
            const stringArea = arrayArea.join(",");
            if(stringArea)
            {
                stringSql += `and house.id IN (${stringArea}) `;
            }
            else{
                return res.status(200).json({
                    data : [],
                    count : 0
                })
            }
        }

        const offset = (page - 1)*limit;
        stringSql += `ORDER BY receive_bill.id DESC `
        stringSql += `LIMIT ${limit} OFFSET ${offset}`
        try {
            const [records,fields] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            return res.status(200).json({
                data : records,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phiếu chi không thành công !"
            })
        }
    }

    async updateRecieveBill(req,res)
    {
        const poolPromise = pool.promise();
        const {id,idUser,price,nameUser,receiver,reason,room_id,time} = req.body;
        const newTime = time.split("/").reverse().join("-")
        try {
            const [records,fields] = await poolPromise.execute("update `receive_bill` SET `idUser` = ?, `nameUser` = ?, `room_id` = ?, `time` = ?, `price` = ?, `receiver` = ?, `reason` = ? where id = ?",[idUser,nameUser,room_id,newTime,price,receiver,reason,id]);
            return res.status(200).json({
                message : "Cập nhật phiếu chi thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Cập nhật phiếu chi không thành công !"
                })
        }
    }

    async addAsset(req,res){
        const poolPromise = pool.promise();
        const {day_start,name,note,number,number_now,price,room_id,idUser,nameUser,isEnd} = req.body;
        const newTime = day_start.split("/").reverse().join("-")
        try {
            const [records,fields] = await poolPromise.execute("insert into `asset` (`room_id`, `name`, `price`, `number`, `number_now`, `day_start`, `note`,`idUser`,`nameUser`,`isEnd`) values (?,?,?,?,?,?,?,?,?,?)",[room_id,name,price,number,number_now,newTime,note,idUser,nameUser,isEnd]);
            return res.status(200).json({
                message : "Thêm tài sản thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Thêm tài sản không thành công !"
                })
        }
    }

    async getAsset(req,res){
        const poolPromise = pool.promise();
        const {limit,page,house,room,status,name} = req.query; 
        let stringSql = `SELECT asset.id,asset.idUser,asset.nameUser,asset.room_id,asset.name,asset.price,asset.number,asset.number_now,asset.time_update as day_end,asset.day_start,asset.note,asset.isEnd,room.room_number,house.id as houseId, house.name_house FROM asset LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON asset.room_id = room.id where asset.id > 0 `;
        let stringCountSql = `SELECT COUNT(*) as count FROM asset LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON asset.room_id = room.id where asset.id > 0 `;
        if(house)
        {
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
        }
        if(room)
        {
            stringSql += `and asset.room_id = ${room} `
            stringCountSql += `and asset.room_id = ${room} `
        }
       if(status)
       {
            stringSql += `and asset.isEnd = ${status} `
            stringCountSql += `and asset.isEnd = ${status} `
       }
       if(name)
       {
            stringSql += `and asset.name LIKE "%${name}%" `
            stringCountSql += `and asset.name LIKE "%${name}%" `
       }

        if(req.userNormal.isAdmin == 2){
            const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
            const stringArea = arrayArea.join(",");
            if(stringArea)
            {
                stringSql += `and house.id IN (${stringArea}) `;
            }
            else{
                return res.status(200).json({
                    data : [],
                    count : 0
                })
            }
        }

        const offset = (page - 1)*limit;
        stringSql += `ORDER BY asset.id DESC `
        stringSql += `LIMIT ${limit} OFFSET ${offset}`;
        try {
            const [records,fields] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            return res.status(200).json({
                data : records,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phiếu tài sản không thành công !"
            })
        }
    }

    async updateAsset(req,res){
        const poolPromise = pool.promise();
        let {id,day_start,day_end = null,name,note,number,number_now,price,room_id,idUser,nameUser,isEnd} = req.body;
        const date = new Date();
        let StringValue = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        const newTime = day_start.split("/").reverse().join("-");
        const newTimeEnd = day_end.split("/").reverse().join("-");
        console.log(req.body);
        try {
            const [records,fields] = await poolPromise.execute("update `asset` SET `room_id` = ?, `name` = ?, `price` = ?, `number` = ?, `time_update` = ?, `number_now` = ?, `day_start` = ?, `note` = ?,`idUser` = ?,`nameUser` = ?,`isEnd` = ? where id = ?",[room_id,name,price,number,StringValue,number_now,newTime,note,idUser,nameUser,isEnd,id]);
            return res.status(200).json({
                message : "Cập nhật sản thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Cập nhật sản không thành công !"
                })
        }
    }

    async addContract(req,res){
        const poolPromise = pool.promise();
        const {CMND_day,birth,contract_day,contract_end} = req.body;
        const newCMND_day = CMND_day.split("/").reverse().join("-");
        const newbirth = birth.split("/").reverse().join("-");
        const newcontract_day = contract_day.split("/").reverse().join("-");
        const newcontract_end = contract_end.split("/").reverse().join("-");
        try {
            const [recordsMemberOn,fieldsMemberOn]= await poolPromise.execute("SELECT member.CMND FROM `contract` LEFT JOIN member ON contract.member_id = member.id where contract.isOnTime = 1;")
            const arrayTemp = recordsMemberOn.map(item => item.CMND);
            if(arrayTemp.includes(req.body.CMND))
            {
                return res.status(400).json({
                    message : "Khách hàng hiện tại vẫn còn hợp đồng chưa hết hạn !" 
                })
            }
            const [recordsMember,fieldsMember] = await poolPromise.execute("INSERT INTO `member`(`room_id`, `name`, `phone_number`, `CMND`, `CMND_day`, `CMND_place`, `email`, `permanent_address`, `birth`, `birth_place`, `note`) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[req.body.room_id,req.body.name,req.body.phone_number,req.body.CMND,newCMND_day,req.body.CMND_place,req.body.email,req.body.permanent_address,newbirth,req.body.birth_place,req.body.note])
            const idMember = recordsMember.insertId;
            const [recordsContract,fieldsContract] = await poolPromise.execute("INSERT INTO `contract`(`idUser`, `nameUser`, `member_id`, `room_id`, `contract_day`, `contract_time`, `contract_end`, `deposit`) VALUES (?,?,?,?,?,?,?,?)",[req.body.idUser,req.body.nameUser,idMember,req.body.room_id,newcontract_day,req.body.contract_time,newcontract_end,req.body.deposit])
            const [recordsRoom,fieldsRoom] = await poolPromise.execute("update room set status_room = 2 where id = ?",[req.body.room_id])
            return res.status(200).json({
                message : "Thêm hợp đồng thành công !" 
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Thêm hợp đồng không thành công !"
                })
        }
    }

    async addServiceToHouse(req,res){
        const poolPromise = pool.promise();
        const {arrayService,roomId} = req.body;
        const newArray = JSON.parse(arrayService);
        try {
            for(let i = 0 ; i < newArray.length ; i++)
            {
                const [recordsMember,fieldsMember] = await poolPromise.execute("INSERT INTO `service_detail`(`room_id`, `service_id`, `number`) VALUES (?,?,?)",[roomId,newArray[i].id,newArray[i].number])
            }
            res.status(200).json({
                message : "Đăng ký dịch vụ thành công !"
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Đăng ký dịch vụ không thành công !"
                })
        }
    }

    async addMemberToHouse(req,res){    
        const poolPromise = pool.promise();
        const {items,idRoom} = req.body;
        const newArray = JSON.parse(items);
        newArray.forEach((item) => {
            const newbirth = item.birth.split("/").reverse().join("-");
            item.birth = newbirth
        })
        try {
            for(let i = 0 ; i < newArray.length ; i++)
            {
                const [recordsMember,fieldsMember] = await poolPromise.execute("INSERT INTO `member`(`room_id`,`CMND`, `birth`, `email`,`name`,`permanent_address`,`phone_number`) VALUES (?,?,?,?,?,?,?)",[idRoom,newArray[i].CMND,newArray[i].birth,newArray[i].email,newArray[i].name,newArray[i].permanent_address,newArray[i].phone_number])
            }
            res.status(200).json({
                message : "Thêm thành viên phòng thành công !"
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Thêm thành viên phòng không thành công !"
                })
        }
    }

    async getContract(req,res){
        const poolPromise = pool.promise();
        const {roomId} = req.query;
        try {
            const [records,fields] = await poolPromise.execute("SELECT contract.id,contract.room_id,contract.member_id,contract.contract_day,contract.contract_time,contract.contract_end,contract.deposit,member.name,member.phone_number,member.CMND,member.CMND_day,member.CMND_place,member.email,member.permanent_address,member.birth,member.birth_place,member.note FROM `contract` LEFT JOIN member ON contract.member_id = member.id where contract.room_id = ? and contract.isOnTime = 1",[roomId])
            res.status(200).json({
                data : records
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Lấy hợp đồng phòng không thành công !"
                })
        }
    }

    async getServiceDetailRoom(req,res){
        const poolPromise = pool.promise();
        const {roomId} = req.query;
        try {
            const [records,fields] = await poolPromise.execute("SELECT service_detail.id,service_detail.room_id,service_detail.service_id,service_detail.number,service.name,service.price FROM `service_detail` LEFT JOIN service ON service_detail.service_id = service.id where service_detail.room_id = ?",[roomId])
            res.status(200).json({
                data : records
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Lấy dịch vụ phòng không thành công !"
                })
        }
    }

    async getMemberInHouse(req,res)
    {
        const poolPromise = pool.promise();
        const {roomId} = req.query;
        try {
            const [records,fields] = await poolPromise.execute("SELECT * FROM `contract` WHERE room_id = ? and isOnTime = 1",[roomId]);
            const mainMember = records[0].member_id;
            const [recordsMember,fieldsMember] = await poolPromise.execute("SELECT * FROM `member` WHERE room_id = ? and id <> ? and status = 1",[roomId,mainMember])
            res.status(200).json({
                data : recordsMember
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Lấy người cùng phòng không thành công !"
                })
        }
    }

    async updateContract(req,res){
        const poolPromise = pool.promise();
        const {CMND_day,birth,contract_day,contract_end} = req.body;
        const newCMND_day = CMND_day.split("/").reverse().join("-");
        const newbirth = birth.split("/").reverse().join("-");
        const newcontract_day = contract_day.split("/").reverse().join("-");
        const newcontract_end = contract_end.split("/").reverse().join("-");
        try {
            const [recordsMember,fieldsMember] = await poolPromise.execute("update `member` SET `name` = ?, `phone_number` = ?, `CMND` = ?, `CMND_day` = ?, `CMND_place` = ?, `email` = ?, `permanent_address` = ?, `birth` = ?, `birth_place` = ?, `note` = ? where id = ?",[req.body.name,req.body.phone_number,req.body.CMND,newCMND_day,req.body.CMND_place,req.body.email,req.body.permanent_address,newbirth,req.body.birth_place,req.body.note,req.body.member_id])
            const [recordsContract,fieldsContract] = await poolPromise.execute("update `contract` SET `idUser` = ?, `nameUser` = ?, `contract_day` = ?, `contract_time` = ?, `contract_end` = ?, `deposit` = ? where id = ?",[req.body.idUser,req.body.nameUser,newcontract_day,req.body.contract_time,newcontract_end,req.body.deposit,req.body.id])
            return res.status(200).json({
                message : "Cập nhật hợp đồng thành công !" 
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Cập nhật hợp đồng không thành công !"
                })
        }
    }

    async updateServiceToHouse(req,res){
        const poolPromise = pool.promise();
        const {arrayService,roomId} = req.body;
        console.log(req.body);
        const newArray = JSON.parse(arrayService);
        try {
            const [records,fields] = await poolPromise.execute("delete from service_detail where room_id = ?",[roomId])
            for(let i = 0 ; i < newArray.length ; i++)
            {
                const [recordsMember,fieldsMember] = await poolPromise.execute("INSERT INTO `service_detail`(`room_id`, `service_id`, `number`) VALUES (?,?,?)",[roomId,newArray[i].id,newArray[i].number])
            }
            res.status(200).json({
                message : "Cập nhật dịch vụ thành công !"
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Cập nhật dịch vụ không thành công !"
                })
        }
    }

    async updateMemberToHouse(req,res){    
        const poolPromise = pool.promise();
        const {items = '[]',idRoom,itemChange = '[]',itemDelete = '[]'} = req.body;
        const newArray = JSON.parse(items);
        const newItemChange = JSON.parse(itemChange);
        const newItemDelete = JSON.parse(itemDelete);
        newArray.forEach((item) => {
            const newbirth = item.birth.split("/").reverse().join("-");
            item.birth = newbirth
        })
        newItemChange.forEach((item) => {
            const newbirth = item.birth.split("/").reverse().join("-");
            item.birth = newbirth
        })
        console.log(newItemChange,"heheh");
        try {
            for(let i = 0 ; i < newArray.length ; i++)
            {
                const [recordsMember,fieldsMember] = await poolPromise.execute("INSERT INTO `member` (`room_id`,`CMND`, `birth`, `email`,`name`,`permanent_address`,`phone_number`) VALUES (?,?,?,?,?,?,?)",[idRoom,newArray[i].CMND,newArray[i].birth,newArray[i].email,newArray[i].name,newArray[i].permanent_address,newArray[i].phone_number])
            }
            for(let i = 0 ; i < newItemChange.length ; i++)
            {
                const [records,fields] = await poolPromise.execute("update `member` SET `CMND` = ?, `birth` = ?, `email` = ?,`name` = ?,`permanent_address` = ?,`phone_number` = ? where id = ?",[newItemChange[i].CMND,newItemChange[i].birth,newItemChange[i].email,newItemChange[i].name,newItemChange[i].permanent_address,newItemChange[i].phone_number,newItemChange[i].id])
                console.log("abc");
            }
            for(let i = 0 ; i < newItemDelete.length ; i++)
            {
                const [records,fields] = await poolPromise.execute("delete from member where id = ?",[newItemDelete[i].id])
            }
            res.status(200).json({
                message : "Cập nhật thành viên phòng thành công !"
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Cập nhật thành viên phòng không thành công !"
                })
        }
    }

    async leaveRoom(req,res){
        const poolPromise = pool.promise();
        const {idRoom} = req.body;
        try {
            const date = new Date();
            const StringValue = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            const [recordsContract,fieldsContract] = await poolPromise.execute("update contract SET isOnTime = 0,contract_end = ? where room_id = ? and isOnTime = 1",[StringValue,idRoom])
            const [recordsMember,fieldsMember] = await poolPromise.execute("update member SET time_end = ?, status = 0 where room_id = ? and status = 1",[StringValue,idRoom])
            const [recordsService,fieldsService] = await poolPromise.execute("delete from service_detail where room_id = ?",[idRoom])
            const [records,fields] = await poolPromise.execute("update room SET status_room = 1 where id = ?",[idRoom])
            return res.status(200).json({
                message : "Trả phòng thành công !"
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Trả phòng không thành công !"
                })
        }
    }

    async takeRoom(req,res){
        const poolPromise = pool.promise();
        const {idRoom} = req.body;
        console.log(req.body);
        try {
            const [records,fields] = await poolPromise.execute("update room SET status_room = 1 where id = ?",[idRoom])
            const date = new Date();
            const StringValue = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            const [recordsDeposit,fieldsDeposit] = await poolPromise.execute("update deposit SET status = 2, day_come = ? where status = 1 and room_id = ?",[StringValue,idRoom])
            return res.status(200).json({
                message : "Nhận phòng thành công !"
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Nhận phòng không thành công !"
                })
        }
    }

    async rentOne(req,res){
        const poolPromise = pool.promise();
        const {room_id,from_time,to_time} = req.body
        console.log(req.body);
        const newFrom = from_time.split("/").reverse().join("-")
        const newTo = to_time.split("/").reverse().join("-")
        if(new Date(newFrom).getTime() >= new Date(newTo).getTime())
        {
            return res.status(400).json({
                message : "Ngày tháng năm không hợp lệ !"
            })
        }
        try {
            const [records,fields] = await poolPromise.execute("select * from rent WHERE ? < to_time and from_time < ? and room_id = ?",[newFrom,newTo,room_id])
            if(records.length !== 0)
            {
                return res.status(400).json({
                    message : "Hóa đơn đã tồn tại"
                })
            }



            const [recordPriceRoom,fieldsPriceroom] = await poolPromise.execute("select price from room where id = ?",[room_id])
            const [recordsElectric,fieldsElectric] = await poolPromise.execute("SELECT electric_bill.price FROM `electric_bill` LEFT JOIN room ON room.id = electric_bill.room_id where ? <= electric_bill.from_time and ? >= electric_bill.to_time and electric_bill.room_id = ?",[newFrom,newTo,room_id])
            const [recordsWater,fieldsWater] = await poolPromise.execute("SELECT water_bill.price FROM `water_bill` LEFT JOIN room ON room.id = water_bill.room_id where ? <= water_bill.from_time and ? >= water_bill.to_time and water_bill.room_id = ?",[newFrom,newTo,room_id])
            const [recordsService,fieldsService] = await poolPromise.execute("SELECT * FROM service_detail LEFT JOIN service ON service_detail.service_id = service.id where room_id = ?",[room_id])
            const [recordsArise,fieldsArise] = await poolPromise.execute("SELECT * FROM `arise_detail` LEFT JOIN arise ON arise.id = arise_detail.arise_id where arise.time BETWEEN ? AND ? and arise_detail.room_id = ?",[newFrom,newTo,room_id])
            let sumNumber = 0;
            recordsService.forEach(item => {
                sumNumber += (item.price * item.number)
            })
            recordsArise.forEach(item => {
                sumNumber += item.price
            })
            sumNumber += recordPriceRoom[0].price;
            recordsWater.forEach(item => {
                sumNumber += (item.price)
            })
            recordsElectric.forEach(item => {
                sumNumber += (item.price)
            })
            const [recordsMain,fieldsMain] = await poolPromise.execute("insert into rent (idUser,nameUser,room_id,from_time,to_time,money_need) values (?,?,?,?,?,?)",[req.body.idUser,req.body.nameUser,room_id,newFrom,newTo,sumNumber])
            return res.status(200).json({
                message : "Tính tiền phòng thành công !"
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Tính tiền phòng không thành công !"
                })
        }
    }


    async getRentDetail(req,res){
        const poolPromise = pool.promise();
        const {id} = req.body
        let newFrom ;
        let newTo ;
        try {
            const [records,fields] = await poolPromise.execute("select * from rent WHERE id = ?",[id])
            newFrom = records[0].from_time;
            newTo = records[0].to_time;
            const room_id = records[0].room_id
            const [recordPriceRoom,fieldsPriceroom] = await poolPromise.execute("select price from room where id = ?",[room_id])
            const [recordsElectric,fieldsElectric] = await poolPromise.execute("SELECT electric_bill.price,electric_bill.from_time,electric_bill.to_time FROM `electric_bill` LEFT JOIN room ON room.id = electric_bill.room_id where ? <= electric_bill.from_time and ? >= electric_bill.to_time and electric_bill.room_id = ?",[newFrom,newTo,room_id])
            const [recordsWater,fieldsWater] = await poolPromise.execute("SELECT water_bill.price,water_bill.from_time,water_bill.to_time FROM `water_bill` LEFT JOIN room ON room.id = water_bill.room_id where ? <= water_bill.from_time and ? >= water_bill.to_time and water_bill.room_id = ?",[newFrom,newTo,room_id])
            const [recordsService,fieldsService] = await poolPromise.execute("SELECT * FROM service_detail LEFT JOIN service ON service_detail.service_id = service.id where room_id = ?",[room_id])
            const [recordsArise,fieldsArise] = await poolPromise.execute("SELECT * FROM `arise_detail` LEFT JOIN arise ON arise.id = arise_detail.arise_id where arise.time BETWEEN ? AND ? and arise_detail.room_id = ?",[newFrom,newTo,room_id])
            
            const data = {
                roomPrice : recordPriceRoom[0].price,
                electric : recordsElectric,
                water : recordsWater,
                service : recordsService,
                arise : recordsArise
            }
            return res.status(200).json({
                data
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Tính tiền phòng không thành công !"
                })
        }
    }

    async getRent(req,res){
        const poolPromise = pool.promise();
        const {limit,page,house,time} = req.body; 
        let stringSql = `SELECT rent.id,rent.idUser,rent.nameUser,rent.room_id,rent.from_time,rent.to_time,rent.current_time,rent.money_need,rent.money_do,rent.arise,rent.discount_reason,room.room_number,house.id as houseId,house.name_house FROM rent LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON rent.room_id = room.id where rent.id > 0 `;
        let stringCountSql = `SELECT COUNT(*) as count FROM rent LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON rent.room_id = room.id where rent.id > 0 `;
        if(time)
        {
            const newTime = time.split("/")[1]
            const newYear = time.split("/")[2]
            stringSql += `and MONTH(rent.from_time) = ${newTime} and YEAR(rent.from_time) = ${newYear} `
            stringCountSql += `and MONTH(rent.from_time) = ${newTime} and YEAR(rent.from_time) = ${newYear} `
        }
        if(house)
        {
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
        }

       

        if(req.userNormal.isAdmin == 2){
            const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
            const stringArea = arrayArea.join(",");
            if(stringArea)
            {
                stringSql += `and house.id IN (${stringArea}) `;
            }
            else{
                return res.status(200).json({
                    data : [],
                    count : 0
                })
            }
        }

        const offset = (page - 1)*limit;
        stringSql += `ORDER BY rent.id DESC `
        stringSql += `LIMIT ${limit} OFFSET ${offset}`;
        try {
            const [records,fields] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            return res.status(200).json({
                data : records,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy hóa đơn tháng không thành công !"
            })
        }
    }

    async payMoneyMonth(req,res){
        const poolPromise = pool.promise();
        const {money,day_do,idUser,nameUser,id} = req.body;
        const newTime = day_do.split("/").reverse().join("-");
        try {
            const [records,fields] = await poolPromise.execute("select * from rent where id = ?",[id]);
            let nowMoney = records[0].money_do*1 + money*1;
            console.log(req.body,nowMoney);
            if(nowMoney >= records[0].money_need)
            {
                const [recordsChange1,fieldsChange1] = await poolPromise.execute("update `rent` SET `money_do` = ?,`current_time` = ?,`idUser` = ?,`nameUser` = ?,`isDone` = 1 where id = ?",[nowMoney,newTime,idUser,nameUser,id])
            }
            else{
                const [recordsChange2,fieldsChange2] = await poolPromise.execute("update rent SET `money_do` = ?,`current_time` = ?,`idUser` = ?,`nameUser` = ? where id = ?",[nowMoney,newTime,idUser,nameUser,id])
            }
            return res.status(200).json({
                message : "Đóng tiền thành công !"
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Đóng tiền không thành công !"
            })
        }
    }

    async discountPayMonth(req,res){
        const poolPromise = pool.promise();
        const {id,idUser,money,nameUser,reason} = req.body;
        try {
            const [records,fields] = await poolPromise.execute("select * from rent where id = ?",[id]);
            let moneyBeforeLastDiscount = records[0].money_need*1 - records[0].arise*1;
            let moneyAfter = moneyBeforeLastDiscount*1 + money*1;
            if(moneyAfter <= records[0].money_do || moneyAfter == 0)
            {
                const [recordsChange1,fieldsChange1] = await poolPromise.execute("update `rent` SET `money_need` = ?,`arise` = ?,`discount_reason` = ?,`idUser` = ?,`nameUser` = ?,`isDone` = 1 where id = ?",[moneyAfter,money*1,reason,idUser,nameUser,id])
            }
            else{
                const [recordsChange2,fieldsChange2] = await poolPromise.execute("update `rent` SET `money_need` = ?,`arise` = ?,`discount_reason` = ?,`idUser` = ?,`nameUser` = ? where id = ?",[moneyAfter,money*1,reason,idUser,nameUser,id])
            }
            return res.status(200).json({
                message : "Giảm giá tiền thành công !"
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Giảm giá tiền không thành công !"
            })
        }
    }

    async getDisCountMonth(req,res){
        const poolPromise = pool.promise();
        const {id} = req.query;
        try {
            const [records,fields] = await poolPromise.execute("select arise,discount_reason from rent where id = ?",[id])
            return res.status(200).json({
                data : records[0]
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy giảm giá tiền không thành công !"
            })
        }
    }


    async rentAll(req,res){
        const poolPromise = pool.promise();
        const {house_id,month,room_id,special = false} = req.body
        console.log(req.body,"hahahahah");
        const newMonth = month.split("/")[1];
        const newYear = month.split("/")[2];
        let newTime = month.split("/");
        newTime[0] = 1;
        newTime = newTime.reverse().join("-")
        try {
            const [recordsIdRoom,fieldsIdRoom] = await poolPromise.execute("SELECT room.id FROM `room` WHERE room.House_id = ? and status_room = 2",[house_id]);
            const [recordIdHaveNote,fieldsIdHaveNote] = await poolPromise.execute("Select room_id as id from rent where MONTH(rent.rent_time) = ? and YEAR(rent_time) = ? and arise <> 0",[newMonth,newYear])
            const arrayId = [];
            let idArrayHaveArise = special ? recordIdHaveNote.map(item => item.id) : [];
            recordsIdRoom.filter(item => {
                if(!room_id.includes(item.id) && !idArrayHaveArise.includes(item.id))
                {
                    arrayId.push(item.id)
                }   
            });
            console.log(arrayId,"heheheh");
            for(let i = 0; i < arrayId.length ; i++)
            {
                const [recordsFirst,fieldsFirst] = await poolPromise.execute("SELECT room.id as idRoom,room.price as roomPrice,electric_bill.price as electricPrice,water_bill.price as waterPrice FROM electric_bill LEFT JOIN (water_bill LEFT JOIN room ON room.id = water_bill.room_id) ON room.id = electric_bill.room_id where MONTH(electric_bill.time) = ? and MONTH(water_bill.time) = ? and room.id = ?",[newMonth,newMonth,arrayId[i]])
                const [recordsService,fieldsService] = await poolPromise.execute("SELECT * FROM service_detail LEFT JOIN service ON service_detail.service_id = service.id where room_id = ?",[arrayId[i]])
                const [recordsArise,fieldsArise] = await poolPromise.execute("SELECT * FROM `arise_detail` LEFT JOIN arise ON arise.id = arise_detail.arise_id where MONTH(arise.time) = ? and arise_detail.room_id = ?",[newMonth,arrayId[i]])
                let sumNumber = 0;
                let stringService = "";
                let stringArise = "";
                recordsService.forEach(item => {
                    sumNumber += (item.price * item.number)
                    stringService += `+${item.name} : ${item.price}vnđ : ${item.number} => thành tiền : ${item.price * item.number}vnđ
                    `
                })
                recordsArise.forEach(item => {
                    sumNumber += item.price
                    stringArise += `+${item.note} : ${item.price}vnđ
                    `
                })
                const stringNote = `-Tiền phòng : ${recordsFirst[0]?.roomPrice}vnđ
                -Tiền điện : ${recordsFirst[0]?.electricPrice}vnđ
                -Tiền nước : ${recordsFirst[0]?.waterPrice}vnđ
                -Tiền dịch vụ : 
                    ${stringService}
                -Tiền phát sinh :
                    ${stringArise}
                `
    
                sumNumber += recordsFirst[0]?.roomPrice;
                sumNumber += recordsFirst[0]?.electricPrice;
                sumNumber += recordsFirst[0]?.waterPrice
    
    
                const [recordsDelete,fieldsDelete] = await poolPromise.execute("delete from rent where room_id = ? and MONTH(rent_time) = ?",[arrayId[i],newMonth])
                const [recordsMain,fieldsMain] = await poolPromise.execute("insert into rent (idUser,nameUser,room_id,rent_time,money_need,detail) values (?,?,?,?,?,?)",[req.body.idUser,req.body.nameUser,arrayId[i],newTime,sumNumber,stringNote])
            }
            return res.status(200).json({
                message : "Tính tiền phòng thành công !"
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Tính tiền phòng không thành công !"
                })
        }
    }

    async getRoomNotDone(req,res){
        const poolPromise = pool.promise();
        const {limit,page,house,time,room} = req.query; 
        let stringSql = `select rent.id,rent.room_id,rent.from_time,rent.to_time,rent.money_need,rent.money_do,room.room_number,house.id as houseId,house.name_house from rent LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON rent.room_id = room.id where rent.isDone = 0 `;
        let stringCountSql = `select COUNT(*) as count from rent LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON rent.room_id = room.id where rent.isDone = 0 `;
        if(time)
        {
            const newTime = time.split("/")[1];
            const yearTime = time.split("/")[2];
            stringSql += `and MONTH(rent.from_time) = ${newTime} and YEAR(rent.from_time) = ${yearTime} `
            stringCountSql += `and MONTH(rent.from_time) = ${newTime} and YEAR(rent.from_time) = ${yearTime} `
        }
        if(house)
        {
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
        }
        if(room)
        {
            stringSql += `and room.id = ${room} `
            stringCountSql += `and room.id = ${room} `
        }

       

        if(req.userNormal.isAdmin == 2){
            const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
            const stringArea = arrayArea.join(",");
            if(stringArea)
            {
                stringSql += `and house.id IN (${stringArea}) `;
            }
            else{
                return res.status(200).json({
                    data : [],
                    count : 0
                })
            }
        }

        const offset = (page - 1)*limit;
        stringSql += `LIMIT ${limit} OFFSET ${offset}`;
        try {
            const [records,fields] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            return res.status(200).json({
                data : records,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phòng nợ không thành công !"
            })
        }
    }

    async getContractEndSoon(req,res){
        const poolPromise = pool.promise();
        const {limit,page,house,room} = req.query; 
        let stringSql = `SELECT contract.room_id,room.room_number,house.id as houseId,house.name_house,contract.id,contract.contract_day,contract.contract_end,DATEDIFF(CURRENT_DATE(),contract.contract_end) AS remaining_days FROM contract LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON contract.room_id = room.id Where DATEDIFF(contract.contract_end,CURRENT_DATE()) < 30 and contract.isOnTime = 1 `;
        let stringCountSql = `SELECT COUNT(*) as count FROM contract LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON contract.room_id = room.id Where DATEDIFF(contract.contract_end,CURRENT_DATE()) < 30 and contract.isOnTime = 1 `;
        if(house)
        {
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
        }
        if(room)
        {
            stringSql += `and room.id = ${room} `
            stringCountSql += `and room.id = ${room} `
        }

        if(req.userNormal.isAdmin == 2){
            const arrayArea = req.userNormal.area ? req.userNormal.area.split(",") : [];
            const stringArea = arrayArea.join(",");
            if(stringArea)
            {
                stringSql += `and house.id IN (${stringArea}) `;
            }
            else{
                return res.status(200).json({
                    data : [],
                    count : 0
                })
            }
        }

        const offset = (page - 1)*limit;
        stringSql += `LIMIT ${limit} OFFSET ${offset}`;
        try {
            const [records,fields] = await poolPromise.execute(stringSql);
            const [recordsCount,fieldsCount] = await poolPromise.execute(stringCountSql);
            return res.status(200).json({
                data : records,
                count : recordsCount[0].count
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy phòng sắp hết hợp đồng không thành công !"
            })
        }
    }
};  


module.exports = new normalController;