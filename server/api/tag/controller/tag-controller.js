import tagDAO from "../dao/tag-dao";
import SuccessResponse from "~/server/api/utils/SuccessResponse";
import models from "~/server/models";

export default class tagController {
    static getAll(req, res) {
        logger.info(`tagController Controller: getAll - query :${JSON.stringify(req.query)}`);
        tagDAO
      .getAll(req.query)
      .then(result => {
          res.status(200);
          res.json(new SuccessResponse(models.Tag.name, result.rows, { count: result.count, limit: req.query.limit }));
      })
      .catch(error => res.status(400).json(error));
    }

    static createNew(req, res) {
        const _tag = req.body;

        tagDAO
      .createNew(_tag)
      .then(tag => res.status(201).json(tag))
      .catch(error => res.status(400).json(error));
    }

    static removeById(req, res) {
        const _id = req.params.id;

        tagDAO
      .removeById(_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
    }
}
