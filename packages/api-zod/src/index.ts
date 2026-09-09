import { z } from "zod";

/**
 * Health check response schema
 */
export const HealthCheckResponse = z.object({
  status: z.enum(["ok"]),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponse>;

/**
 * Device activation request body schema
 */
export const ActivateDeviceBody = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  deviceKey: z.string().min(1, "Device key is required"),
  playlistName: z.string().min(1, "Playlist name is required"),
  pin: z.string().regex(/^\d{4,8}$/, "PIN must be 4-8 digits"),
  m3uUrl: z.string().url("Invalid M3U URL").optional().or(z.literal("")),
  xtreamServer: z.string().optional().or(z.literal("")),
  xtreamUsername: z.string().optional().or(z.literal("")),
  xtreamPassword: z.string().optional().or(z.literal("")),
  epgUrl: z.string().url("Invalid EPG URL").optional().or(z.literal("")),
});

export type ActivateDeviceBody = z.infer<typeof ActivateDeviceBody>;

/**
 * Device PIN verification request schema
 */
export const DevicePinInput = z.object({
  pin: z.string().regex(/^\d{4,8}$/, "PIN must be 4-8 digits"),
});

export type DevicePinInput = z.infer<typeof DevicePinInput>;

/**
 * Device configuration response schema
 */
export const DeviceConfigResponse = z.object({
  deviceId: z.string(),
  playlistName: z.string(),
  m3uUrl: z.string().nullable(),
  xtreamServer: z.string().nullable(),
  xtreamUsername: z.string().nullable(),
  xtreamPassword: z.string().nullable(),
  epgUrl: z.string().nullable(),
  updatedAt: z.string(),
});

export type DeviceConfigResponse = z.infer<typeof DeviceConfigResponse>;

/**
 * Activation success response schema
 */
export const ActivationSuccessResponse = z.object({
  success: z.boolean(),
  deviceId: z.string(),
  message: z.string(),
  updatedAt: z.string(),
});

export type ActivationSuccessResponse = z.infer<typeof ActivationSuccessResponse>;

/**
 * Error response schema
 */
export const ErrorResponse = z.object({
  error: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponse>;
