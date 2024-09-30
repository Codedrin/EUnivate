import Quotation from "../../models/SuperAdmin/quotationModel.js";

// Get all quotations
export const getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find();
        res.status(200).json(quotations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quotations' });
    }
};

//Display the notification dot if there's a new quotation saved
export const checkNotifications = async (req, res) => {
    try {

        const oneHourAgo = new Date(Date.now() - 3600000); 

      
        const newQuotations = await Quotation.find({ createdAt: { $gte: oneHourAgo } });

        res.json({ hasNew: newQuotations.length > 0 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check notifications' });
    }
};

//Delete Quotations
export const deleteQuotation = async (req, res) => {
    const { id } = req.params;
    try {
        await Quotation.findByIdAndDelete(id);
        res.status(200).json({ message: 'Quotation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete quotation' });
    }
};
