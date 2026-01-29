import { v2 as cloudinary } from "cloudinary";
import { SubCategoryModels } from "../models/subCategoryModels.js";
import { redisClient } from "../redisConnect.js";

// Lấy danh sách tất cả subcategory
const getSubCategories = async (req, res) => {
  try {
    //Check Redis cache first
    const cachedSubCategories = await redisClient.get("subcategories:all");
    if (cachedSubCategories) {
      console.log("🚀 Lấy subcategories từ Redis cache");
      return res.status(200).json(JSON.parse(cachedSubCategories));
    }
    //If not in cache, fetch from database
    console.log("📊 Lấy subcategories từ MongoDB");
    const subCategories = await SubCategoryModels.find()
      .populate("category", "name") // populate để lấy thông tin category
      .sort({ createdAt: -1 });
    // Save to Redis cache with TTL 300 seconds (5 minutes)
    await redisClient.setEx("subcategories:all", 300, JSON.stringify(subCategories, null, 2));
    res.status(200).json(subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy subcategory theo category
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategoryModels.find({
      category: { $in: [categoryId] }
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Thêm subcategory mới
const createSubCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let { category } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Handle category array from FormData
    if (category) {
      if (typeof category === 'string') {
        category = [category];
      } else if (req.body['category[]']) {
        category = Array.isArray(req.body['category[]']) ? req.body['category[]'] : [req.body['category[]']];
      }
    }

    if (!category || !Array.isArray(category) || category.length === 0) {
      return res.status(400).json({ message: "At least one category is required" });
    }

    const existedSubCategory = await SubCategoryModels.findOne({ name });
    if (existedSubCategory) {
      return res.status(400).json({ message: "SubCategory name already exists" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload ảnh lên Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "subcategories" }, // optional: tổ chức folder
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Image upload failed" });
        }

        // Lưu vào database
        const newSubCategory = new SubCategoryModels({
          name,
          category: category, // array of category IDs
          image: {
            url: result.secure_url,
            public_id: result.public_id,
          },
        });

        await newSubCategory.save();
        // Delete Invalidate Redis cache
        await redisClient.del("subcategories:all");
        // Populate category info trước khi trả về
        const populatedSubCategory = await SubCategoryModels.findById(newSubCategory._id)
          .populate("category", "name");
        
        return res.status(201).json(populatedSubCategory);
      }
    );

    // Gửi buffer vào Cloudinary stream
    result.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cập nhật subcategory
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let { category } = req.body;

    // Handle category array from FormData
    if (category) {
      if (typeof category === 'string') {
        category = [category];
      } else if (req.body['category[]']) {
        category = Array.isArray(req.body['category[]']) ? req.body['category[]'] : [req.body['category[]']];
      }
    }

    console.log("Update subcategory request:", { id, name, category, hasFile: !!req.file });

    const subCategory = await SubCategoryModels.findById(id);
    if (!subCategory)
      return res.status(404).json({ message: "SubCategory not found" });

    // Kiểm tra tên trùng lặp (nếu thay đổi tên)
    if (name && name !== subCategory.name) {
      const existedSubCategory = await SubCategoryModels.findOne({ name });
      if (existedSubCategory) {
        return res.status(400).json({ message: "SubCategory name already exists" });
      }
    }

    // CHỈ upload khi có file
    if (req.file) {
      console.log("Uploading new image, file size:", req.file.size);
      
      // Sử dụng upload_stream cho memory storage
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: "subcategories",
            resource_type: "image"
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result.public_id);
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      try {
        const result = await uploadPromise;
        
        // Xóa ảnh cũ nếu có
        if (subCategory.image?.public_id) {
          console.log("Deleting old image:", subCategory.image.public_id);
          await cloudinary.uploader.destroy(subCategory.image.public_id);
        }

        subCategory.image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    if (name) {
      subCategory.name = name;
    }

    if (category && Array.isArray(category)) {
      subCategory.category = category;
    }

    const updatedSubCategory = await subCategory.save();
    // Delete Invalidate Redis cache
    await redisClient.del("subcategories:all");
    // Populate category info trước khi trả về
    const populatedSubCategory = await SubCategoryModels.findById(updatedSubCategory._id)
      .populate("category", "name");
    
    console.log("SubCategory updated successfully:", updatedSubCategory._id);
    res.status(200).json(populatedSubCategory);
  } catch (error) {
    console.error("Update subcategory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Xóa subcategory
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategoryModels.findById(id);

    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    // Xóa ảnh nếu có
    if (subCategory.image && subCategory.image.public_id) {
      await cloudinary.uploader.destroy(subCategory.image.public_id);
    }

    // Xóa subcategory trong DB
    await SubCategoryModels.findByIdAndDelete(id);

    // Delete Invalidate Redis cache
    await redisClient.del("subcategories:all");

    res.status(200).json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { 
  getSubCategories, 
  getSubCategoriesByCategory,
  createSubCategory, 
  updateSubCategory, 
  deleteSubCategory 
};
