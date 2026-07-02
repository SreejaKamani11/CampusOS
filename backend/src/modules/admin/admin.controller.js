const adminService = require("./admin.service");
const stationeryService = require("../stationery/stationery.service");
const ordersService = require("../orders/orders.service");
const getDashboard = async (req, res, next) => {
    try {
        const stats = await adminService.getDashboard();

        return res.status(200).json({
            success: true,
            data: {
                totalUsers: Number(stats.total_users),
                totalOrders: Number(stats.total_orders),
                totalRevenue: Number(stats.total_revenue),
                totalPrintJobs: Number(stats.total_print_jobs)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const { search = "" } = req.query;

        const users = await adminService.getUsers(search);

        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

const updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { active } = req.body;

        // Prevent admin from disabling their own account
        if (req.user.id === id && active === false) {
            return res.status(400).json({
                success: false,
                message: "You cannot disable your own account."
            });
        }

        const user = await adminService.updateUserStatus(id, active);

        return res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Don't allow admin to change their own role
        if (req.user.id === id) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role."
            });
        }

        const user = await adminService.updateUserRole(id, role);

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
};
const getStationeryProducts = async (req, res, next) => {
    try {
        const products = await stationeryService.getAllProducts();

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
};
const createStationeryProduct = async (req, res, next) => {
    try {
        const product = await stationeryService.createProduct(req.body);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

const updateStationeryProduct = async (req, res, next) => {
    try {
        const product = await stationeryService.updateProduct(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};
const deleteStationeryCategory = async (req, res, next) => {
    try {
        const category = await stationeryService.deleteCategory(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category
        });

    } catch (error) {

        if (error.message === "CATEGORY_IN_USE") {
            return res.status(400).json({
                success: false,
                message: "Cannot delete category because it contains products."
            });
        }

        next(error);
    }
};

const updateStationeryStock = async (req, res, next) => {
    try {
        const { stock } = req.body;

        const product = await stationeryService.updateStock(
            req.params.id,
            stock
        );

        return res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};
const getStationeryCategories = async (req, res, next) => {
    try {
        const categories = await stationeryService.getAllCategories();

        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};
const createStationeryCategory = async (req, res, next) => {
    try {
        const category = await stationeryService.createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};
const updateStationeryCategory = async (req, res, next) => {
    try {
        const category = await stationeryService.updateCategory(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};

const canteenService = require("../canteen/canteen.service");

const getCanteenMenu = async (req, res, next) => {
    try {
        const menu = await canteenService.getAllMenuItems();

        return res.status(200).json({
            success: true,
            data: menu
        });
    } catch (error) {
        next(error);
    }
};
const createCanteenMenuItem = async (req, res, next) => {
    try {
        const menuItem = await canteenService.createMenuItem(req.body);

        return res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            data: menuItem
        });
    } catch (error) {
        next(error);
    }
};
const updateCanteenMenuItem = async (req, res, next) => {
    try {
        const menuItem = await canteenService.updateMenuItem(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Menu item updated successfully",
            data: menuItem
        });
    } catch (error) {
        next(error);
    }
};
const deleteCanteenMenuItem = async (req, res, next) => {
    try {
        const menuItem = await canteenService.deleteMenuItem(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Menu item deleted successfully",
            data: menuItem
        });
    } catch (error) {
        next(error);
    }
};
const updateCanteenMenuAvailability = async (req, res, next) => {
    try {
        const { available } = req.body;

        const menuItem = await canteenService.updateMenuAvailability(
            req.params.id,
            available
        );

        return res.status(200).json({
            success: true,
            message: "Menu availability updated successfully",
            data: menuItem
        });
    } catch (error) {
        next(error);
    }
};
const getCanteenCategories = async (req, res, next) => {
    try {
        const categories = await canteenService.getAllCategories();

        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};
const createCanteenCategory = async (req, res, next) => {
    try {
        const category = await canteenService.createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};
const updateCanteenCategory = async (req, res, next) => {
    try {
        const category = await canteenService.updateCategory(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};
const deleteCanteenCategory = async (req, res, next) => {
    try {
        const category = await canteenService.deleteCategory(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};
const printoutService = require("../printout/printout.service");

const getAllPrintJobs = async (req, res, next) => {
    try {
        const jobs = await printoutService.getAllPrintJobs();

        return res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};

const updatePrintJobStatus = async (req, res, next) => {
    try {
        const job = await printoutService.updatePrintJobStatus(
            req.params.id,
            req.body.status
        );

        return res.status(200).json({
            success: true,
            message: "Print job status updated successfully",
            data: job
        });
    } catch (error) {
        next(error);
    }
};
const getAllOrders = async (req, res, next) => {
    try {

        const orders = await ordersService.getAllOrders();

        return res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {

        const order = await ordersService.updateOrderStatus(
            req.params.id,
            req.body.status,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });

    } catch (error) {
        next(error);
    }
};
const getOrderDetails = async(req,res,next)=>{

    try{

        const order=await ordersService.getOrderByIdForAdmin(
            req.params.id
        );

        return res.status(200).json({

            success:true,
            data:order

        });

    }catch(error){

        next(error);

    }

};
const deleteStationeryProduct = async (req, res, next) => {
    try {
        const product = await stationeryService.deleteProduct(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getDashboard,
    getUsers,
    updateUserStatus,
    updateUserRole,
    getStationeryProducts,
    createStationeryProduct,
    updateStationeryProduct,
    updateStationeryStock,
    getStationeryCategories,
    createStationeryCategory,
    updateStationeryCategory,
    deleteStationeryCategory,
    getCanteenMenu,
    createCanteenMenuItem,
    updateCanteenMenuItem,
    deleteCanteenMenuItem,
    updateCanteenMenuAvailability,
    getCanteenCategories,
    createCanteenCategory,
    updateCanteenCategory,
    deleteCanteenCategory,
    getAllPrintJobs,
    updatePrintJobStatus,
    updateOrderStatus,
    getAllOrders,
    getOrderDetails,
    deleteStationeryProduct
};