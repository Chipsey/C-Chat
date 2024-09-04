const create = async (Model, data) => {
  try {
    const document = new Model(data);
    return await document.save();
  } catch (error) {
    throw new Error(`Error creating document: ${error.message}`);
  }
};

const readAll = async (Model, { limit, page, search, searchFields }) => {
  try {
    const query = search
      ? {
          $or: searchFields.map((field) => ({
            [field]: { $regex: search, $options: "i" },
          })),
        }
      : {};

    const items = await Model.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalItems = await Model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    return { items, currentPage: parseInt(page), totalPages, totalItems };
  } catch (error) {
    throw new Error(`Error fetching documents: ${error.message}`);
  }
};

const readById = async (Model, id) => {
  try {
    return await Model.findById(id);
  } catch (error) {
    throw new Error(`Error fetching document by ID: ${error.message}`);
  }
};

const updateById = async (Model, id, data) => {
  try {
    return await Model.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }
};

const deleteById = async (Model, id) => {
  try {
    return await Model.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
};

module.exports = {
  create,
  readAll,
  readById,
  updateById,
  deleteById,
};
