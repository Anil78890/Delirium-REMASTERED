
import { z } from "zod";

const addressLabelSchema = z
    .string()
    .trim()
    .min(1, "Address label is required")
    .max(30, "Address label must be 30 characters or fewer");

const recipientNameSchema = z
    .string()
    .trim()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100, "Recipient name is too long");

const phoneNumberSchema = z
    .string()
    .trim()
    .regex(
        /^\d{10,15}$/,
        "Phone number must contain 10 to 15 digits",
    );

const addressLineSchema = z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address is too long");

const latitudeSchema = z.coerce
    .number()
    .finite()
    .min(-90)
    .max(90);

const longitudeSchema = z.coerce
    .number()
    .finite()
    .min(-180)
    .max(180);

export const createAddressSchema = z.object({
    label: addressLabelSchema,
    recipientName: recipientNameSchema,
    phoneNumber: phoneNumberSchema,
    addressLine: addressLineSchema,
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema
    .omit({
        isDefault: true,
    })
    .partial()
    .extend({
        isDefault: z.boolean().optional(),
    });

export type CreateAddressInput = z.infer<
    typeof createAddressSchema
>;

export type UpdateAddressInput = z.infer<
    typeof updateAddressSchema
>;
