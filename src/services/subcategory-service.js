import Subcategory from "../models/Subcategory.js";
import { getErrorMessage } from "../utils/error-util.js";

const subcategoryService = {
    addSubcategory
};

async function addSubcategory(subcategoryName) {
    try {
        const foundSubcategory = await Subcategory.findOne({ name: subcategoryName });

        if (foundSubcategory) {
            throw new Error('This subcategory name already exists!');
        }

        return Subcategory.create({ name: subcategoryName });

    } catch (err) {
        console.error(getErrorMessage(err));
        throw new Error('Something went wrong!');
    }
}
export default subcategoryService;