import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });

    if (company) {
      return res.status(400).json({
        message: "This company is already registered.",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const getCompany = async (req, res) => {
  const { page, shouldSkip } = req.query;

  const pageNumber = parseInt(page, 10) || 1;
  const shouldSkipValue = parseInt(shouldSkip, 10);

  const limit = shouldSkipValue === 0 ? 0 : 7;
  const skip = limit === 0 ? 0 : (pageNumber - 1) * limit;

  try {
    const userId = req.id;
    const totalCount = await Company.countDocuments({ userId });

    const companies =
      limit === 0
        ? await Company.find({ userId })
        : await Company.find({ userId }).limit(limit).skip(skip);

    if (companies.length === 0) {
      return res
        .status(404)
        .json({ message: "company not found", success: false });
    }

    const totalPages = limit === 0 ? 1 : Math.ceil(totalCount / limit);

    return res
      .status(200)
      .json({ companies, success: true, totalPages, totalCount });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company)
      return res
        .status(404)
        .json({ message: "Company not found!", success: false });
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompanyInformation = async (req, res) => {
  try {
    const { name, description, website, totalEmployees, genre, location } =
      req.body;

    let fileUri;
    const file = req.files?.file?.[0];
    if (file) {
      fileUri = getDataUri(file);
    }
    let cloudResponse;
    let logo;
    if (file) {
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    const updateData = {
      name,
      description,
      website,
      location,
      logo,
      totalEmployees,
      genre,
    };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found!", success: false });
    }

    return res.status(200).json({
      message: "Company information updated.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while updating company information.",
      success: false,
    });
  }
};
