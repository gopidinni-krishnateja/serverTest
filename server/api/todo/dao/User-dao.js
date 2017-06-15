
import Promise from "bluebird";
import models from "../../../../server/models"
import _ from "lodash";
export  default class userDAO
{
  static createNew(request,res) {

    return new Promise((resolve, reject) => {
      let _reqBody = request;
      //logger.info(`Create: ${JSON.stringify(_reqBody)}`);
      models.User.create({
        firstName: _reqBody.firstName,
        lastName: _reqBody.lastName,
        email: _reqBody.email,
        password:  _reqBody.password,
        address: _reqBody.address
      }).then(request => {
        console.log("hello")
      })
        .catch(error => {
          console.log(error)
          //logger.info(`error: ${error}`);
          /*res.status
          res.status(400).json(error);*/
        });
    });
  }
  static update(_reqBody) {
    return new Promise((resolve, reject) => {
      models.User.update({
          firstName: _reqBody.firstName,
          lastName: _reqBody.lastName,
          email: _reqBody.email,
          password: _reqBody.password,
          address: _reqBody.address
        },
        { where: { id: _reqBody.id}, returning: true, plain:true}
      ).then((updateResponse) => {
        resolve(updateResponse[1].dataValues);
      }, (error) => {
        reject(error);
      });
    });
  }
  static removeById(_id) {
    return new Promise((resolve, reject) => {
      models.User
        .findById(_id)
        .then(User => {
          if (!User) {
            return reject(404);
          }
          return User.destroy()
            .then(() => { resolve(204); }, (error) => reject(error));
        }, (error) => {
          logger.error(`Internal error while deleting user: ${error}`);
          reject(error);
        });
    });
  }
  static getAll(queryParams) {
    return new Promise((resolve, reject) => {
      console.log(models.User);
      models.User
        .findAndCountAll({})
        .then(User => {
          console.log("in User: "+ JSON.stringify(User));
          resolve(User);
        }, (error) => {
          reject(error);
        });
    });
  }

}
