import UserRoutes from "../api/todo/route/user-route";


export default class Routes {
   static init(app, router) {
     UserRoutes.init(router);

    app.get("/api",(req,res)=> res.status(200).send({
      message:"Welcome User"
    }))
     app.use("/", router);
   }
}
