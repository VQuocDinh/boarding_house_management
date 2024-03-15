

const AutRouter = require("./AutRouter")
const AdminRouter = require("./AdminRouter")
const NormalRouter = require("./NormalRouter")
function Router(app){
   
    app.use('/auth',AutRouter)
    app.use('/admin',AdminRouter)
    app.use('/normal',NormalRouter)
}

module.exports = Router;