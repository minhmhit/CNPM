const routeService = require("../Services/route.service");

//thêm chuyến đường và điểm dừng
const addRoute = async (req, res) => {
    const { route_name, start_point, end_point, stop_points, description } = req.body;
    const data = await routeService.addRouteService({
        route_name,
        start_point,
        end_point,
        stop_points,
        description
    });
    res.status(201).json(data);
};
//sửa chuyến đường và điểm dừng
const updateRoute = async (req, res) => {
    const { route_id } = req.params;
    const { route_name, start_point, end_point, stop_points, description } = req.body;
    const data = await routeService.updateRouteService(route_id, {
        route_name,
        start_point,
        end_point,
        stop_points,
        description
    });
    res.status(200).json(data);
};
//xoá chuyến đường và điểm dừng
const deleteRoute = async (req, res) => {
    const { route_id } = req.params;
    const data = await routeService.deleteRouteService(route_id);
    res.status(200).json(data);
};
//lấy tất cả chuyến đường và điểm dừng
const getAllRoutes = async (req, res) => {
    const data = await routeService.getAllRoutesService();
    res.status(200).json(data);
};

module.exports = {
    addRoute,
    updateRoute,
    deleteRoute,
    getAllRoutes
};
