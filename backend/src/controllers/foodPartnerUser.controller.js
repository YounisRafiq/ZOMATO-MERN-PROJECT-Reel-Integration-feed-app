const mongoose = require('mongoose');
const foodPartnerModel = require('../models/foodPartner.model');

async function getfoodPartnerById(req, res) {
    const foodPartnerId = req.foodPartner;

    if (!mongoose.Types.ObjectId.isValid(foodPartnerId)) {
        return res.status(400).json({ message: "Invalid Food Partner ID" });
    }

    try {
        const foodPartner = await foodPartnerModel.findById(foodPartnerId);

        if (!foodPartner) {
            return res.status(404).json({ message: "Food Partner NOT Found" });
        }

        res.status(200).json({
            message: "Food Partner retrieved successfully",
            foodPartner
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { getfoodPartnerById };