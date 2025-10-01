const route = require('../Models/route.model');



const addRouteService = async (routeData) => {
    try {
        let result = await route.addRoute(routeData);
        return result;
    } catch (error) {
        throw error;
    }
};

const updateRouteService = async (route_id, routeData) => {
    try {
        let result = await route.updateRoute(route_id, routeData);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteRouteService = async (route_id) => {
    try {
        let result = await route.deleteRoute(route_id);
        return result;
    } catch (error) {
        throw error;
    }
};

const getAllRoutesService = async () => {
    try {
        let result = await route.getAllRoutes();
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addRouteService,
    updateRouteService,
    deleteRouteService,
    getAllRoutesService
};
