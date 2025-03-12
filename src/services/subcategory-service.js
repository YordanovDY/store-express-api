import Subcategory from "../models/Subcategory.js";
import { getErrorMessage } from "../utils/error-util.js";

const subcategoryService = {
    getSingleSubcategory,
    addSubcategory
};

function getSingleSubcategory(subcategoryId) {
    return Subcategory.findById(subcategoryId);
}

async function addSubcategory(subcategoryName) {
    const foundSubcategory = await Subcategory.findOne({ name: subcategoryName });

    if (foundSubcategory) {
        throw new Error('This subcategory name already exists!');
    }

    return Subcategory.create({ name: subcategoryName });

}
export default subcategoryService;