const client = require("../lib/client")


const findById = ( moduleCategory, categories) => {
    console.log('Categories inside findById:', categories)
    const correctCat = categories.find(cat => cat.category_name === moduleCategory );
    console.log('CorrectCat:',correctCat)
    return correctCat.id;
}

module.exports = { findById }
