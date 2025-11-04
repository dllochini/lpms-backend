import { createUser } from "../repositories/user.js";
import { createLand } from "../repositories/land.js";

export const createUserAndLand = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const body = req.body || {};

    // ✅ Safely extract addresses
    const addresses = Array.isArray(body.address)
      ? body.address
      : [body.address];
    const userAddress = addresses[0] || "";
    const landAddress = addresses[1] || "";

    const createdBy = req.user?._id || body.createdBy || null;

    // ✅ User payload
    const userPayload = {
      fullName: body.fullName,
      designation: body.designation,
      nic: body.nic,
      address: userAddress,
      division: body.division, // 1️⃣ --- FIX 1: Add division to User model
      contactNo: body.contactNo,
      accountNo: body.accountNo || body.account_Number,
      bank: body.bank,
      branch: body.branch,
      role: body.role || "686376157bac8e175bd885aa",
      password: body.password,
      createdBy,
      updated_history: [
        {
          updatedAt: new Date(),
          updatedBy: createdBy,
          changes: "initial creation",
        },
      ],
    };

    const files = req.files || {};
    if (files.farmerPhoto?.[0]) {
      userPayload.nic_softcopy = {
        filename: files.farmerPhoto[0].filename,
        path: files.farmerPhoto[0].path,
      };
    }

    const newUser = await createUser(userPayload);

    // ✅ Land payload
    const landPayload = {
      farmer: newUser._id,
      division: body.division,
      address: landAddress,
      size: Number(body.size || body.landSize),
      unit: body.unit || body.landUnit,
      createdBy,
      updated_history: [
        {
          updatedAt: new Date(),
          updatedBy: createdBy,
          changes: `initial creation with user ${newUser._id}`,
        },
      ],
    };

    if (files.landPhoto?.[0]) {
      landPayload.images = [
        {
          filename: files.landPhoto[0].filename,
          path: files.landPhoto[0].path,
        },
      ];
    }

    if (files.documents?.length) {
      landPayload.documents = files.documents.map((f) => ({
        filename: f.filename,
        path: f.path,
      }));
    }

    if (files.signedAgreement?.[0]) {
      landPayload.signed_agreement = {
        filename: files.signedAgreement[0].filename,
        path: files.signedAgreement[0].path,
      };
    }

    const newLand = await createLand(landPayload);

    res.status(201).json({ user: newUser, land: newLand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default { createUserAndLand };
