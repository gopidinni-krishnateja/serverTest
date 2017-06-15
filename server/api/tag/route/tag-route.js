import tagController from "../controller/tag-controller";

export default class tagRoutes {
    static init(router) {
        router
      .route("/api/tags")
      .get(tagController.getAll)
      .post(tagController.createNew);

        router
      .route("/api/tags/:id")
      .delete(tagController.removeById);
    }
}
