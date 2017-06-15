import _ from "lodash";

export default class SuccessResponse {

    //default constructor
    constructor(modelName, data, pagination = {}) {
        this.kind = modelName;
        if (Array.isArray(data)) {
            this.data = {
                items: data
            };
        } else {
            this.data = SuccessResponse.filterResponse(data);
        }
        if (pagination) {
            this.totalItems = pagination.count;
            this.itemsPerPage = pagination.limit;
        }
    }

    static filterResponse(obj) {
        _.forEach(obj, (value, key) => {
            if (key === "createdAt" || key === "updatedAt") {
                delete obj[key];
            } else if (value === "" || value === null) {
                delete obj[key];
            } else if (typeof value === "object") {
                SuccessResponse.filterResponse(value);
            } else if (Array.isArray(value)) {
                _.forEach(value, (k, v) => { SuccessResponse.filterResponse(v); });
            }
        });
        return obj;
    }


    //toJson
    toJSON() {
        return {
            kind: this.kind,
            data: this.data,
            totalItems: this.totalItems ? this.totalItems : "",
            itemsPerPage: this.itemsPerPage ? this.itemsPerPage : ""
        };
    }
}
