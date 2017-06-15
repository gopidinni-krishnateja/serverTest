import UserController from "../controller/user-controller";

export default class UserRoutes {
  static init(router) {
    router
    .route("/api/todo")
    .get(UserController.getAll)
      .post(UserController.createNew)
      .put(UserController.update);
    router
      .route("/api/todo/:id")
      .delete(UserController.removeById);
    /*// router
    // .route("/api/todos/:id")
    //   get(UserController.getById)
    // .delete(UserController.deleteTodo);*/
  }
}
