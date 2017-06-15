import UserDAO from "../dao/User-dao";
import models from "/home/sematic/WebstormProjects/serverTest/server/models/user"


export default class UserController {
  static createNew(req, res) {
    const _reqBody = req.body;
    UserDAO.createNew(_reqBody,res)
      .then(User => {
        res.status(201)
          .json(new SuccessResponse(models.User.firstName,models.User.lastName,models.User.email,models.User.password,models.User.address, User));
      })
      .catch(error => {

      });
  }
  static update(req, res) {
    const _reqBody = req.body;

    UserDAO.update(_reqBody)
      .then(User => {
        res.status(201)
          .json(new SuccessResponse(models.User.firstName,models.User.lastName,models.User.email,models.User.password,models.User.address, User));
      })
      .catch(error => {
        if (error === 404) {
          return res.status(404)
            .json(new ErrorResponse("404", `User data is not found with id @ ${reqBody.id}`));
        }

      });
  }
  static removeById(req, res) {

    const _id = req.params.firstName;
    console.log(_id)
    UserDAO
      .removeById(req.params.id)
      .then(() => res.status(204).end())
      .catch(error => {
        if (error === 404)


        res.status(400).json(error);
      });
  }
  static getAll(req, res) {
    const _query = req.query;
    UserDAO
      .getAll(_query)
      .then(result => {
        res.status(200);
        res.json(new SuccessResponse(models.User.firstName,models.User.lastName,models.User.email,models.User.password,models.User.address, result.rows, { count: result.count, limit: req.query.limit }));
      })
      .catch(error => res.status(400).json(error));
  }

}
