const pool = require("../app/configDB");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require("fs");
const { nextTick } = require("process");
const { json } = require("express");

class adminController{
    async getStaff(req,res){
        const {page,limit} = req.query;
        const offset = (page-1) * limit;

        const poolPromise = pool.promise();
        try {
            const [recordsStaff,fieldsStaff] = await poolPromise.execute("SELECT id,user_img,fullname,email,phone_number,address,isActive FROM `user` WHERE role_id = 2 ORDER BY id DESC LIMIT ? OFFSET ?",[limit,offset])
            const [recordsCount,fieldsCount] = await poolPromise.execute("SELECT COUNT(*) as number FROM `user` WHERE role_id = 2");
            res.status(200).json({
                data : recordsStaff,
                count : recordsCount[0].number
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message : "Đăng ký thất bại !"
            })
        }
    }

    async updateActive(req,res){
        const {id,isActive} = req.body;
        const poolPromise = pool.promise();
        try {
            const [records,fields] = await poolPromise.execute("update user set isActive = ? where id = ?",[isActive,id])
            if(isActive == 0)
            {
                const [recordsActive,fieldsActive] = await poolPromise.execute("delete from tokens where user_id = ?",[id])
            }
            res.status(200).json({
                message : "Thay đổi kích hoạt user thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message : "Thay đổi kích hoạt user thất bại !"
            })
        }
    }

    async changePassStaff(req,res){
        const {id,password} = req.body;
        const poolPromise = pool.promise();
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed =  await bcrypt.hash(password,salt);
        try {
            const [records,fields] = await poolPromise.execute("update user set password = ? where id = ?",[hashed,id])
            res.status(200).json({
                message : "Thay đổi mật khẩu thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message : "Thay đổi mật khẩu user thất bại !"
            })
        }
    }

    async updateStaff(req,res){
        const {id,name,phone_number,email,address} = req.body;
        const poolPromise = pool.promise();
        try {
            const [records,fields] = await poolPromise.execute("update user set fullname = ?,email = ?,phone_number = ?,address = ? where id = ?",[name,email,phone_number,address,id])
            res.status(200).json({
                message : "Thay đổi thông tin user thành công !"
            })
        } catch (error) {
            console.log(error);
            if(error.code == 'ER_DUP_ENTRY')
            {
                return res.status(400).json({
                    message : "Số điện thoại đã được đăng kí trước !!!"
                })
            }
            return res.status(400).json({
                message : "Thay đổi thông tin user thất bại !"
            })
        }
    }

    async addHouse(req,res){
        const {name_house,address} = req.body;
        const poolPromise = pool.promise();
        try {
            const [records,fields] = await poolPromise.execute("insert into house (name_house,address) values (?,?)",[name_house,address])
            res.status(200).json({
                message : "Thêm nhà thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message : "Thêm nhà thất bại !"
            })
        }
    }

    async changeStatusHouse(req,res){
        const {id,status} = req.body;
        console.log(req.body);
        const poolPromise = pool.promise();
        try {
            const [records,fields] = await poolPromise.execute("update house set status = ? where id = ?",[status,id])
            if(status == 0)
            {
                const [recordsUser,fieldsUser] = await poolPromise.execute("select idUser from area where idHouse = ?",[id]);
                console.log(recordsUser);
                const Users = [];
                recordsUser.forEach(item => {Users.push(item.idUser)})
                let stringUser = Users.join(',')
                if(stringUser.length !== 0)
                {
                    const stringQuery = `delete from tokens where user_id in (${stringUser})`
                    const [recordsToken,fieldsToken] = await poolPromise.execute(stringQuery)
                }
                const [recordsArea,fieldsArea] = await poolPromise.execute("delete from area where idHouse = ?",[id])
            }
            res.status(200).json({
                message : "Thay đổi thành công !"
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Thay đổi trạng thái nhà không thành công !"
            })
        }
    }

    async updateHouse(req,res){
        const {id,name_house,address} = req.body;
        const poolPromise = pool.promise();
        try {
            const [records,fields] = await poolPromise.execute("update house set name_house = ?,address= ? where id = ?",[name_house,address,id])
            res.status(200).json({
                message : "Thay đổi thành công !"
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Thay đổi thông tin nhà không thành công !"
            })
        }
    }

    async AddRoleStaff(req,res){
        const {id,area} = req.body;
        if(!id || !area){
            res.status(400).json({
                message : "Thêm quyền không thành công !"
            })
        }
        const arrayArea = area.split(",")
        const poolPromise = pool.promise();
        try {
            for(let i = 0 ; i < arrayArea.length ; i++)
            {
                const [records,fields] = await poolPromise.execute("insert into area (`idUser`,`idHouse`) values (?,?)",[id,arrayArea[i]]);   
            }
            res.status(200).json({
                message : "Thêm quyền thành công !"
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Thêm quyền không thành công !"
            })
        }
    }

    async getRoleStaff(req,res){
        const {id} = req.query;
        const poolPromise = pool.promise();
        try {
            const [records,fields] = await poolPromise.execute("select * from area where idUser = ?",[id]);
            res.status(200).json({
                data : records
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Lấy quyền user không thành công !"
            })
        }
    }

    async updateRoleStaff(req,res){
        const {id,area} = req.body;
        console.log(id,area,"heheh");
        const poolPromise = pool.promise();
        const arrayArea = area ? area.split(",") : []
        try {
            const [recordsDelete,fieldsDelete] = await poolPromise.execute("delete from area where idUser = ?",[id])
            for(let i = 0 ; i < arrayArea.length ; i++){
                const [records,fields] = await poolPromise.execute("insert into area (idUser,idHouse) values (?,?)",[id,arrayArea[i]])
            } 
            const [records,fields] = await poolPromise.execute("delete from tokens where user_id = ?",[id])
            res.status(200).json({
                message : "Thay đổi quyền user thành công !"
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message : "Thay đổi quyền user không thành công !"
            })
        }
    }

    async addRoom(req,res){
        const poolPromise = pool.promise();
        const form = formidable({ 
            multiples: true,
        });
        form.on('fileBegin',(name , file) => {
            const typeFile = file.originalFilename.split(".")[file.originalFilename.split(".").length - 1];
            file.filepath = "src/public/img/ImgRoom/" + file.newFilename + `.${typeFile}`;
            file.newFilename = file.newFilename + `.${typeFile}`;
        })
        form.parse(req, async (err, fields, files) => {
            const {house_id,status_room,room_number,price,length,width,people_number,describe} = fields;
            if(err){
                return res.status(401).json({
                    message : "Tạo room thất bại !"
                })
            }
            try {
                const [recordsRoom,fieldsRoom] = await poolPromise.execute("INSERT INTO room (`status_room`, `House_id`, `room_number`, `price`, `length`, `width`, `people_number`, `describe`) VALUES (?,?,?,?,?,?,?,?)",[status_room,house_id,room_number,price,length,width,people_number,describe])
                const idRoom = recordsRoom.insertId;
                if(!files.imgs){
                    files.imgs = []
                }
                else if(!Array.isArray(files.imgs)){
                    files.imgs = [files.imgs]
                }
                for(let item of files?.imgs)
                {
                    const urlImg = `http://localhost:3001/img/ImgRoom/${item.newFilename}`;
                    const [rowsImg,fildsImg] = await poolPromise.query("insert into galery_room (room_id,galery) values (?,?)",[idRoom,urlImg])
                }
                res.status(200).json({
                    message : "Thêm phòng thành công !"
                })
            } catch (error) {
                console.log(error);
                return res.status(401).json({
                    message : "Tạo room thất bại !"
                })
            }
        });
    }

    async updateRoom(req,res){
        const poolPromise = pool.promise();
        const form = formidable({ 
            multiples: true,
        });
        form.on('fileBegin',(name , file) => {
            const typeFile = file.originalFilename.split(".")[file.originalFilename.split(".").length - 1];
            file.filepath = "src/public/img/ImgRoom/" + file.newFilename + `.${typeFile}`;
            file.newFilename = file.newFilename + `.${typeFile}`;
        })
        form.parse(req, async (err, fields, files) => {
            console.log(files,"/",fields);
            const {id,house_id,status_room,room_number,price,length,width,people_number,describe,deleteImgs} = fields;
            const deleteImgsArray = JSON.parse(deleteImgs)
            if(err){
                return res.status(401).json({
                    message : "Tạo room thất bại !"
                })
            }
            try {
                const [recordsRoom,fieldsRoom] = await poolPromise.execute("update room set `status_room` = ?, `House_id`=?, `room_number` = ?, `price` = ?, `length` = ?, `width` = ?, `people_number` = ?, `describe` = ? where id = ?",[status_room,house_id,room_number,price,length,width,people_number,describe,id])

                if(!files.imgs){
                    files.imgs = []
                }
                else if(!Array.isArray(files.imgs)){
                    files.imgs = [files.imgs]
                }

                for(let item of files?.imgs)
                {
                    const urlImg = `http://localhost:3001/img/ImgRoom/${item.newFilename}`;
                    const [rowsImg,fildsImg] = await poolPromise.query("insert into galery_room (room_id,galery) values (?,?)",[id,urlImg])
                }
                for(let item of deleteImgsArray)
                {
                    const [recordsDelete,fieldsDelete] = await poolPromise.execute("delete from galery_room where id = ?",[item.id])
                    const urlDelete = `src/public/img/ImgRoom/${item.galery.split("/")[item.galery.split("/").length - 1]}`
                            fs.unlink(urlDelete, function (err) {
                                if (err) throw err;
                            });
                }
                res.status(200).json({
                    message : "Thêm phòng thành công !"
                })
            } catch (error) {
                console.log(error);
                return res.status(401).json({
                    message : "Tạo room thất bại !"
                })
            }
        });
    }

    async ChangeStatusRoom(req,res){
        const poolPromise = pool.promise();
        const {idRoom,status} = req.body;
        try {
            const [records,fields] = await poolPromise.execute("update room set status_room = ? where id = ?",[status,idRoom]);
            return res.status(200).json({
                message : "Thay đổi trạng thái phòng thành công"
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Thay đổi trạng thái phòng thất bại !"
            })
        }
    }

    async addService(req,res){
        const poolPromise = pool.promise();
        const {name , price , note} = req.body;
        try {
            const [records,fields] = await poolPromise.execute("insert into service (name,price,note) values (?,?,?)",[name,price,note])
            return res.status(200).json({
                message : "Thêm dịch vụ thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Thêm dịch vụ thất bại !"
            })
        }
    }

    async updateService(req,res){
        const poolPromise = pool.promise();
        const {id,name,price,note} = req.body;
        try {
            const [records,fields] = await poolPromise.execute("update service set name = ?, price = ?, note = ? where id = ?",[name,price,note,id])
            return res.status(200).json({
                message : "Thay đổi dịch vụ thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Thay đổi dịch vụ thất bại !"
            })
        }
    }

    async changeStatusService(req,res){
        const poolPromise = pool.promise();
        const {idService,status} = req.body;
        try {
            const [records,fields] = await poolPromise.execute("update service SET status = ? where id = ?",[status,idService])
            return res.status(200).json({
                message : "Thay đổi trạng thái dịch vụ thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Thay đổi trạng thái dịch vụ thất bại !"
            })
        }
    }

    async addJob(req,res){
        const poolPromise = pool.promise();
        const {todolist_status,time,describe,solution,note,room_id} = req.body;
        const newTime = time.split('/').reverse().join('-');
        try {
            const [recordsJob,fieldsJob] = await poolPromise.execute("INSERT INTO `todolist` (`todolist_status`, `time`, `describe`, `solution`, `note`) VALUES (?,?,?,?,?)",[todolist_status,newTime,describe,solution,note]);
            const idJob = recordsJob.insertId;
            for(let i = 0 ; i < room_id.length ; i++){
                const [recordsDetail,fieldsDetail] = await poolPromise.execute("INSERT INTO `todolist_detail` (`room_id`, `todo_id`) VALUES (?,?)",[room_id[i],idJob])
            }
            return res.status(200).json({
                message : "Thêm công việc thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Thêm công việc thất bại !"
            })
        }
    }

    async deleteJob(req,res){
        const poolPromise = pool.promise();
        const {idJob} = req.body;
        try {
            const [recordsDetail,fieldsDetail] = await poolPromise.execute("delete from todolist_detail where todo_id = ?",[idJob])
            const [records,fields] = await poolPromise.execute("delete from todolist where id = ?",[idJob]);
            return res.status(200).json({
                message : "Xóa công việc thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Xóa công việc thất bại !"
            })
        }
    }

    async updateJob(req,res){
        const poolPromise = pool.promise();
        const {todolist_status,time,describe,solution,note,room_id,id} = req.body;
        console.log(req.body);
        const newTime = time.split('/').reverse().join('-');
        try {
            const [recordsJob,fieldsJob] = await poolPromise.execute("update `todolist` set `todolist_status` = ?,`time` = ?,`describe` = ?,`solution` = ?,`note` = ? WHERE `id` = ?",[todolist_status,newTime,describe,solution,note,id]);
            const [recordsDeleteDetail,fieldsDeleteDetail] = await poolPromise.execute("delete from todolist_detail where todo_id = ?",[id])
            for(let i = 0 ; i < room_id.length ; i++){
                const [recordsDetail,fieldsDetail] = await poolPromise.execute("INSERT INTO `todolist_detail` (`room_id`, `todo_id`) VALUES (?,?)",[room_id[i],id])
            }
            return res.status(200).json({
                message : "Cập nhật công việc thành công !"
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Cập nhật công việc thất bại !"
            })
        }
    }

    async deleteDeposit(req,res){
        const poolPromise = pool.promise();
        const {id,idRoom} = req.body;
        try {
            const [recordsUpdateRoom,fieldsUpdateRoom] = await poolPromise.execute("update room SET status_room = 1 where id = ?",[idRoom])
            const [records,fields] = await poolPromise.execute("delete from deposit where id = ?",[id])
            return res.status(200).json({
                message : "Xóa phiếu đặt cọc thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Xóa phiếu đặt cọc không thành công !"
                })
        }
    }

    async deleteSpendBill(req,res){
        const poolPromise = pool.promise();
        const {id} = req.body;
        try {
            const [records,fields] = await poolPromise.execute("delete from spend_bill where id = ?",[id])
            return res.status(200).json({
                message : "Xóa phiếu thu thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Xóa phiếu thu không thành công !"
                })
        }
    }
    
    async deleteRecieveBill(req,res){
        const poolPromise = pool.promise();
        const {id} = req.body;
        try {
            const [records,fields] = await poolPromise.execute("delete from receive_bill where id = ?",[id])
            return res.status(200).json({
                message : "Xóa phiếu chi thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Xóa phiếu chi không thành công !"
                })
        }
    }

    async deleteAsset(req,res){
        const poolPromise = pool.promise();
        const {idAsset} = req.body;
        try {
            const [records,fields] = await poolPromise.execute("delete from asset where id = ?",[idAsset])
            return res.status(200).json({
                message : "Xóa tài sản thành công !"
            })
        } catch (error) {
                console.log(error);
                res.status(400).json({
                    message : "Xóa tài sản không thành công !"
                })
        }
    }

    async getReportMoney(req,res){
        const poolPromise = pool.promise();
        const {time} = req.query
        let monthTime = time.split("/")[1]
        let yearTime = time.split("/")[2]
        try {
                const [recordsHouse,fieldsHouse] = await poolPromise.execute("select id,name_house from house");
                // const arrayId = recordsHouse.map(item => {return item.id})
                const [recordsRent,fieldsRent] = await poolPromise.execute("SELECT house.id,house.name_house,SUM(rent.money_do) as sumMoney FROM rent LEFT JOIN (room LEFT JOIN house ON room.House_id =house.id) ON rent.room_id =room.id where MONTH(rent.from_time) = ? and YEAR(rent.from_time) = ? GROUP BY house.id",[monthTime,yearTime]);
                const [recordsRecieve,fieldsRecieve] = await poolPromise.execute("SELECT house.id,house.name_house,SUM(receive_bill.price) as sumMoney FROM receive_bill LEFT JOIN (room LEFT JOIN house ON room.House_id =house.id) ON receive_bill.room_id =room.id where MONTH(receive_bill.time) = ? and YEAR(receive_bill.time) = ? GROUP BY house.id",[monthTime,yearTime]);
                const [recordsSpend,fieldsSpend] = await poolPromise.execute("SELECT house.id,house.name_house,SUM(spend_bill.price) as sumMoney FROM spend_bill LEFT JOIN (room LEFT JOIN house ON room.House_id =house.id) ON spend_bill.room_id =room.id WHERE MONTH(spend_bill.time) = ? and YEAR(spend_bill.time) = ? GROUP BY house.id",[monthTime,yearTime]);
                let final = [];
                for(let i = 0 ; i < recordsHouse.length ; i++)
                {
                    let tempObject = {};
                    tempObject.nameHouse = recordsHouse[i].name_house;
                    tempObject.recieve = 0;
                    tempObject.spend = 0;
                    recordsRent.forEach(item => {
                        if(recordsHouse[i].id == item.id)
                        {
                            tempObject.recieve = item.sumMoney*1
                        }
                    })
                    recordsRecieve.forEach(item => {
                        if(recordsHouse[i].id == item.id)
                        {
                            tempObject.recieve += item.sumMoney*1
                        }
                    })
                    recordsSpend.forEach(item => {
                        if(recordsHouse[i].id == item.id)
                        {
                            tempObject.spend = item.sumMoney*1
                        }
                    })
                    tempObject.lost = tempObject.recieve - tempObject.spend;
                    final.push(tempObject)
                }
                console.log(final);
            return res.status(200).json({
                data : final
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Lấy báo cáo lời lỗ không thành công !"
                })
        }
    }

    async getGuessReport(req,res){
        const poolPromise = pool.promise();
        const {limit,page,status,house,room,name} = req.query; 
        let stringSql = `SELECT member.id,member.note,member.room_id,member.name,member.phone_number,member.CMND,member.CMND_day,member.CMND_place,member.email,member.permanent_address,member.birth,member.birth_place,member.time_start,member.time_end,member.status,room.room_number, house.id as houseId,house.name_house,contract.id as contractId FROM (member LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON member.room_id = room.id) LEFT JOIN contract ON member.id = contract.member_id where member.id > 0 `;
        let stringCountSql = `SELECT COUNT(*) as count FROM (member LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON member.room_id = room.id) LEFT JOIN contract ON member.id = contract.member_id where member.id > 0 `;
        
       if(status){
            stringSql += `and member.status = ${status} `
            stringCountSql += `and member.status = ${status} `
       }
       if(house){
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
       }
       if(room){
            stringSql += `and room.id = ${room} `
            stringCountSql += `and room.id = ${room} `
       }
       if(name){
            stringSql += `and member.name LIKE "%${name}%" `
            stringCountSql += `and member.name LIKE "%${name}%" `
       }

        const offset = (page - 1)*limit;
        stringSql += `ORDER BY member.id DESC `
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


    async updateMemberInReport(req,res){
        const poolPromise = pool.promise();
        const {CMND_day,birth,contract_day,contract_end} = req.body;
        const newCMND_day = CMND_day.split("/").reverse().join("-");
        const newbirth = birth.split("/").reverse().join("-");
        try {
            const [recordsMember,fieldsMember] = await poolPromise.execute("update `member` SET `name` = ?, `phone_number` = ?, `CMND` = ?, `CMND_day` = ?, `CMND_place` = ?, `email` = ?, `permanent_address` = ?, `birth` = ?, `birth_place` = ?, `note` = ? where id = ?",[req.body.name,req.body.phone_number,req.body.CMND,newCMND_day,req.body.CMND_place,req.body.email,req.body.permanent_address,newbirth,req.body.birth_place,req.body.note,req.body.id])
            return res.status(200).json({
                message : "Cập nhật khách hàng thành công !" 
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Cập nhật khách hàng không thành công !"
                })
        }
    }

    async deleteMemberInReport(req,res){
        const poolPromise = pool.promise();
        const {id} = req.body;
        console.log(id);
        try {
            const [recordsMember,fieldsMember] = await poolPromise.execute("delete from member where id = ?",[id])
            return res.status(200).json({
                message : "Xóa khách hàng thành công !" 
            })
        } catch (error) {
            console.log(error);
                res.status(400).json({
                    message : "Xóa khách hàng không thành công !"
                })
        }
    }

    async getContracts(req,res){
        const poolPromise = pool.promise();
        const {limit,page,status,house,room,time} = req.query; 
        let stringSql = `select contract.id,contract.idUser,contract.isOnTime,contract.nameUser,contract.member_id,contract.room_id,contract.contract_day,contract.contract_time,contract.contract_end,contract.deposit,member.name,member.phone_number,room.room_number,house.id as houseId,house.name_house from (contract LEFT JOIN member ON contract.member_id = member.id) LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON contract.room_id = room.id WHERE contract.id > 0 `;
        let stringCountSql = `select COUNT(*) as count from (contract LEFT JOIN member ON contract.member_id = member.id) LEFT JOIN (room LEFT JOIN house ON room.House_id = house.id) ON contract.room_id = room.id WHERE contract.id > 0 `;
        let monthTime = time.split("/")[1]
        let yearTime = time.split("/")[2]
       if(status){
            stringSql += `and contract.isOnTime = ${status} `
            stringCountSql += `and contract.isOnTime = ${status} `
       }
       if(house){
            stringSql += `and house.id = ${house} `
            stringCountSql += `and house.id = ${house} `
       }
       if(room){
            stringSql += `and room.id = ${room} `
            stringCountSql += `and room.id = ${room} `
       }
       if(time)
       {
            stringSql += `and MONTH(contract.contract_day) = ${monthTime} and YEAR(contract.contract_day) = ${yearTime} `
            stringCountSql += `and MONTH(contract.contract_day) = ${monthTime} and YEAR(contract.contract_day) = ${yearTime} `
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
                message : "Lấy hóa hợp đồng không thành công !"
            })
        }
    }
};


module.exports = new adminController;