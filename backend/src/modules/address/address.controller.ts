
import type { RequestHandler } from "express";
import { addressService } from "./address.service.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.schema.js";

export const listAddresses: RequestHandler = async (req, res) => {
  const addresses = await addressService.list(req.user!.id);

  res.status(200).json({
    success: true,
    data: addresses,
  });
};

export const createAddress: RequestHandler = async (req, res) => {
  const input = createAddressSchema.parse(req.body);

  const address = await addressService.create(req.user!.id, input);

  res.status(201).json({
    success: true,
    data: address,
  });
};

export const updateAddress: RequestHandler = async (req, res) => {
  const input = updateAddressSchema.parse(req.body);
  const addressId = req.params.addressId;

if (typeof addressId !== "string" || !addressId) {
  res.status(400).json({
    success: false,
    message: "A valid address ID is required",
  });
  return;
}

  const address = await addressService.update(
    req.user!.id,
    addressId,
    input,
  );

  res.status(200).json({
    success: true,
    data: address,
  });
};

export const deleteAddress: RequestHandler = async (req, res) => {
 const addressId = req.params.addressId;

if (typeof addressId !== "string" || !addressId) {
  res.status(400).json({
    success: false,
    message: "A valid address ID is required",
  });
  return;
}

  await addressService.remove(req.user!.id, addressId);

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
};

export const setDefaultAddress: RequestHandler = async (req, res) => {
  const addressId = req.params.addressId;

if (typeof addressId !== "string" || !addressId) {
  res.status(400).json({
    success: false,
    message: "A valid address ID is required",
  });
  return;
}

  const address = await addressService.setDefault(
    req.user!.id,
    addressId,
  );

  res.status(200).json({
    success: true,
    data: address,
  });
};
