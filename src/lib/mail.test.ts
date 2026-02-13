import { describe, it, expect, vi } from "vitest";
import nodemailer from "nodemailer";

// Mock nodemailer before importing the module under test
vi.mock("nodemailer", () => {
  const sendMailMock = vi.fn();
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: sendMailMock,
      })),
    },
  };
});

describe("Mail Configuration", () => {
  it("should configure transporter with IPv4 (family: 4) to prevent ECONNREFUSED", async () => {
    // Import the module to trigger createTransport
    await import("./mail");

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        family: 4, // The critical fix
      })
    );
  });
});