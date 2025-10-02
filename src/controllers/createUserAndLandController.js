// src/controllers/createUserAndLand.js
import { createUser } from "../repositories/user.js";
import { createLand } from "../repositories/land.js";

export const createUserAndLand = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const body = req.body || {};

    const userAddress = body.address[0] || "";
    const landAddress = body.address[1] || "";

    // Build user payload
    const userPayload = {
      fullName: body.fullName,
      designation: body.designation,
      nic: body.nic,
      address: userAddress,
      contact_no: body.contact_no,
      accountNo: body.account_Number || body.accountNo,
      bank: body.bank,
      branch: body.branch,
      role: "686376157bac8e175bd885aa",
      password: body.password, // optionally
      created_by: req.user?._id || body.createdBy || null,
    };

    // Files from multer (match uploadFields names)
    const files = req.files || {};
    if (files.farmerPhoto && files.farmerPhoto[0]) {
      userPayload.nic_softcopy = {
        filename: files.farmerPhoto[0].filename,
        path: files.farmerPhoto[0].path,
      };
    }

    const newUser = await createUser(userPayload);

    // Build land payload
    const landPayload = {
      user: newUser._id,
      division: body.division,
      address: landAddress,
      size: Number(body.size || body.landSize), 
      unit: body.unit || body.landUnit,
      created_by: req.user?._id || body.createdBy || null,
    };

    // landPhoto
    if (files.landPhoto && files.landPhoto[0]) {
      landPayload.images = [{ filename: files.landPhoto[0].filename, path: files.landPhoto[0].path }];
    }

    // documents (may be multiple)
    if (files.documents && files.documents.length) {
      landPayload.documents = files.documents.map((f) => ({ filename: f.filename, path: f.path }));
    }

    // signedAgreement (store on land)
    if (files.signedAgreement && files.signedAgreement[0]) {
      landPayload.signed_agreement = { filename: files.signedAgreement[0].filename, path: files.signedAgreement[0].path };
    }

    const newLand = await createLand(landPayload);

    res.status(201).json({ user: newUser, land: newLand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default { createUserAndLand };
