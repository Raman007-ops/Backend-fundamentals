import products from "../constants/products.js";

export const getAllProducts = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: products,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

export const about = (req, res) => {
  res.send(
    "This is a product API built using Express.js. It provides information about various products, including their names, prices, and descriptions. The API allows users to retrieve a list of all products and learn more about each product's details. It is designed to be simple and efficient, making it easy for developers to integrate into their applications.",
  );
};

export const getproductById = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Invalid Product ID",
      });
    }

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Product Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

export const getPaginatedProducts = (req, res) => {
  try {
    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    page = page || 1;
    limit = limit || 5;

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Invalid page or limit value",
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts = products.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedProducts,
      error: null,
      currentPage : page,
      limit : limit,
      totalProducts : products.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

export const SearchProduct = (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Search query is required",
      });
    }
    const matchedProducts = products.filter((p) => {
      return (
        p.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        p.description.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      );
    });

    return res.status(200).json({
      success: true,
      data: matchedProducts,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};