const create = async (Model, data) => {
  try {
    const document = new Model(data);
    return await document.save();
  } catch (error) {
    throw new Error(`Error creating document: ${error.message}`);
  }
};

const readAll = async (Model) => {
  try {
    return await Model.find();
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
