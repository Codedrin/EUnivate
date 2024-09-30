import Product from "../../models/Admin/addProducts.js";
import Event from "../../models/Admin/addEvents.js";
import Project from "../../models/Admin/addProjects.js";
import Quotation from "../../models/SuperAdmin/quotationModel.js";

export const getDashboardStats = async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const projectCount = await Project.countDocuments();
        const webinarCount = await Event.countDocuments();
        const quotationCount = await Quotation.countDocuments();
        res.json({ quotations: quotationCount, products: productCount, projects: projectCount, webinars: webinarCount });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
