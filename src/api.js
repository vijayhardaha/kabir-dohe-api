import express from "express";

import { getData } from "./data.js";

const router = express.Router();

/**
 * Handles data fetching for both GET and POST requests.
 * Validates query parameters and fetches data accordingly.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const handleRequest = (req, res) => {
  try {
    // Extract parameters based on the request method
    const params = req.method === "POST" ? req.body : req.query;
    const { s, exactMatch, searchWithin, tags, popular, orderBy, order, page, perPage, pagination } = params;

    // Validate 'orderBy' parameter
    if (orderBy && !["id", "random", "popular", "couplet_english", "couplet_hindi"].includes(orderBy)) {
      return res.status(400).json({
        success: false,
        message:
          "Bad Request: The 'orderBy' value provided is invalid. Accepted values are 'id', 'random', 'popular', 'couplet_english', or 'couplet_hindi'.",
      });
    }

    // Validate 'order' parameter
    if (order && !["ASC", "DESC"].includes(order)) {
      return res.status(400).json({
        success: false,
        message:
          "Bad Request: The 'order' value provided is invalid. Accepted values are 'ASC' (ascending) or 'DESC' (descending).",
      });
    }

    // Validate 'searchWithin' parameter
    if (searchWithin) {
      const allowedFields = ["couplet", "translation", "explanation"];
      const searchWithinArray = searchWithin.split(",").map((field) => field.trim().toLowerCase());

      // Validate each field in searchWithinArray
      const invalidFields = searchWithinArray.filter((field) => !allowedFields.includes(field));

      if (invalidFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Bad Request: The 'searchWithin' value(s) provided are invalid. Accepted values are 'couplet', 'translation', or 'explanation'. Invalid values: ${invalidFields.join(", ")}.`,
        });
      }
    }

    // Fetch data using the provided parameters
    const result = getData({ s, exactMatch, searchWithin, tags, popular, orderBy, order, page, perPage, pagination });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Define routes and use the handler function for both POST and GET requests
/**
 * Route to handle fetching of couplets data.
 * Supports both POST and GET methods.
 */
router.route("/couplets").post(handleRequest).get(handleRequest);

export default router;
