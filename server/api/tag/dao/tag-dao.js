import Promise from "bluebird";
import _ from "lodash";
import models from "~/server/models";
import apiUtils from "../../utils/apitUtils";

export default class jobTitleDAO {
    static getAll(queryParams) {
        return new Promise((resolve, reject) => {

            //populate search query
            const _query = apiUtils.populateSearchQuery(queryParams);

            logger.info(_query);

            models.Tag
                .findAndCountAll(_query)
                .then(titles => {
                    resolve(titles);
                }, (error) => {
                    logger.error(`Internal error while fetching tags: ${error}`);
                    reject(error);
                });
        });
    }
  static create(_reqBody) {
    return new Promise((resolve, reject) => {
      logger.info(`Create: ${JSON.stringify(_reqBody)}`);
      models.Client
        .create({
          firstName: _reqBody.firstName,
          lastName: _reqBody.lastName,
          title: _reqBody.title,
          email: _reqBody.email,
          phoneNumber: _reqBody.phoneNumber,
          status: ClientStatus.ACTIVE.code
        }).then(clientInstance => {
        resolve(clientInstance.get({plain:true}));
      }, (error) => {
        logger.info("clientInstance error");
        reject(error);
      });
    });
  }
}

