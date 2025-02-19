import Category from "../models/Category.js";

const categoryService = {
    addCategory,
    getCategories,
    getSingleCategory,
    attachSubcategory
}

async function addCategory(categoryName) {
    const foundCategory = await Category.findOne({ name: categoryName });

    if(foundCategory){
        throw new Error('This category name already exists!');
    }

    return Category.create({ name: categoryName });
}

function getCategories() {
    return Category.find().populate('subcategories');
}

function getSingleCategory(categoryId) {
    return Category.findById(categoryId).populate('subcategories');
}

function attachSubcategory(categoryId, subcategoryId) {
    return Category.findByIdAndUpdate(categoryId, { $push: { subcategories: subcategoryId } });
}

export default categoryService;