
import _ from "lodash";
const moment = require("moment");

export default class apiUtils {

    static buildSearchQuery(queryParams, models) {
        queryParams = queryParams ? queryParams : {};
        const query = {
            search: {},
            include: [],
            sort: [],
            pagination: {},
            attributes: []
        };

        //We are not supporting paging
        if (queryParams.limit) {
            query.pagination["limit"] = queryParams.limit;
            delete queryParams.limit;
        }
        if (queryParams.offset) {
            query.pagination["offset"] = queryParams.offset;
            delete queryParams.offset;
        }

        if (queryParams.page) {
            query.pagination["offset"] = (query.pagination["limit"]) * (queryParams.page - 1);
            delete queryParams.page;
        }

        let sortContext;

        if (queryParams.sortContext) {
            sortContext = queryParams.sortContext;
            delete queryParams.sortContext;
        }

        //prepare sort query
        if (queryParams.sort) {
            const sortParams = queryParams.sort.split(",");

            sortParams.forEach(sortParam => {
                let populatedSortField = null;

                if (sortParam.startsWith("-")) {
                    populatedSortField = apiUtils.populateSort(sortParam.substr(1, sortParam.length), query);
                    if (Array.isArray(populatedSortField)) {
                        populatedSortField.push("DESC");
                    } else {
                        populatedSortField = [populatedSortField, "DESC"];
                    }
                    query.sort.push(populatedSortField);
                } else {
                    populatedSortField = apiUtils.populateSort(sortParam, query);
                    if (Array.isArray(populatedSortField)) {
                        populatedSortField.push("ASC");
                    } else {
                        populatedSortField = [populatedSortField, "ASC"];
                    }
                    query.sort.push(populatedSortField);
                }
            });
            delete queryParams.sort;
        }

        //prepare attributes for query
        if (queryParams.fields) {
            const temp = queryParams.fields.split(",");

            temp.forEach(field => {
                if (field.indexOf(".") !== -1) {
                    console.log("field")
                    console.log(field)
                    console.log("field")
                    apiUtils.populateQuery(field, query, false, null, sortContext, models);
                } else {
                    query.attributes.push(field);
                }
            });
            delete queryParams.fields;
        }

        //prepare where query
        _.forEach(queryParams, (value, key) => {
            const eachQueryValue = queryParams[key];
            if (key !== "q" && key.indexOf(".") === -1) {
                if (key.indexOf('date') !== -1){
                    query.search[key] = new Date(_.toInteger(eachQueryValue));
                } else if (key.indexOf('status') !== -1){
                    if ( eachQueryValue !== 'ALL' ){
                        query.search[key] = eachQueryValue;
                    }
                } else if (key.indexOf('is') !== -1){
                    query.search[key] = eachQueryValue;
                } else {
                    const allQuery = `%${eachQueryValue}%`;
                    query.search[key] = Array.isArray(eachQueryValue) ? { $or: { $ilike: allQuery } } : { $ilike: allQuery };
                }

            } else if (key !== "q" && key.indexOf(".") !== -1) {
                apiUtils.populateQuery(key, query, true, eachQueryValue, sortContext, models);
            }
        });
        logger.info("apiUtils built query");
        logger.info(query);
        logger.info("apiUtils built query");
        return query;
    }

    static populateQuery(field, query, isWhere, whereValue, sortContext, models) {
        const paths = field.split(".");
        const index = apiUtils.findIndexByKeyAndValue(query.include, "key", paths[0]);
        let populatedQuery = {};
        console.log("index")
        console.log(index)
        console.log("index")
        if (index >= 0) {
            populatedQuery = query.include[index];
            query.include.splice(index);
        } else {
            const embedClass = apiUtils.embedClass(paths[0], models);
            console.log("embedClass")
            console.log(embedClass)
            console.log("embedClass")
            if (sortContext && JSON.parse(sortContext)[paths[0]]) {
                populatedQuery = { model: embedClass[0], as: embedClass[1], key: paths[0], include: [], where: JSON.parse(sortContext)[paths[0]], attributes: ["id"] };
            } else {
                populatedQuery = { model: embedClass[0], as: embedClass[1], key: paths[0], include: [], where: {}, attributes: ["id"], through: {attributes:[]} };
            }
        }
        if (paths.length === 2) {
            if (isWhere) {
                populatedQuery.where[paths[1]] = whereValue;
            } else {
                populatedQuery.attributes.push(paths[1]);
            }
        } else {
            apiUtils.populateQuery(paths.slice(1).join("."), populatedQuery, isWhere, whereValue, sortContext);
        }
        query.include.push(populatedQuery);
    }
    static populateSort(field, query) {
        if (field.indexOf(".") !== -1) {
            apiUtils.populateQuery(field, query);
            const paths = field.split(".");
            const sortObjects = [];

            for (let i = 0; i < paths.length - 1; i++) {
                const embedClass = apiUtils.embedClass(paths[i]);

                sortObjects.push({ model: embedClass[0], as: embedClass[1] });
            }
            sortObjects.push(paths[paths.length - 1]);
            return sortObjects;
        }
        return field;
    }

    static embedClass(key, models) {
        let embedClasses = {
            "jobTitle": [models.JobTitle, "jobTitle"],
            "tag": [models.Tag, "tag"],
            "project": [models.Project, "project"],
            "projectFundCode": [models.ProjectFundCode, "projectFundCode"],
            "departments": [models.Department, "departments"]
        };
        return embedClasses[key];
    }
    static findIndexByKeyAndValue(a, key, value) {
        for (let i = 0; i < a.length; i++) {
            if (a[i][key] && a[i][key] === value) { return i; }
        }
        return -1;
    }

    /**
     * Populate search query for application
     * @param queryParams
     * @param models
     * @returns {{}}
     */
    static populateSearchQuery(queryParams, models) {
        //@todo: we shouldn't pass models here. Debug and fix why models not injected in apitUtils..
        let _searchQuery = {},
            _populateQuery;
        _populateQuery = apiUtils.buildSearchQuery(queryParams, models);
        _searchQuery.where = _populateQuery.search;
        _searchQuery.attributes = _populateQuery.attributes;
        _searchQuery.include = _populateQuery.include;
        _searchQuery.order = _populateQuery.sort;

        //if pagination params available in query, apply pagination on results
        if (_populateQuery.pagination) {
            _searchQuery.limit = _populateQuery.pagination.limit;
            _searchQuery.offset = _populateQuery.pagination.offset;
        }
        return _searchQuery;
    }

    static getDate(date) {
        return date?moment.utc(date+1).format():"";
    }
}

module.exports = apiUtils;
