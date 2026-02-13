import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "./users";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { hash } from "bcryptjs";

// Mock dependencies
vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/mail", () => ({
  sendVerificationEmail: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  hash: vi.fn(),
}));

describe("registerUser Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error if input is invalid", async () => {
    const formData = new FormData();
    formData.append("name", "J"); // Too short
    formData.append("email", "invalid-email");
    formData.append("password", "123"); // Too short
    formData.append("phoneNumber", "123"); // Too short

    const result = await registerUser(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
  });

  it("should return error if user already exists", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("password", "password123");
    formData.append("phoneNumber", "1234567890");

    (prisma.user.findFirst as any).mockResolvedValue({ id: "existing-id" });

    const result = await registerUser(formData);

    expect(result.success).toBe(false);
    expect(result.message).toContain("already registered");
  });

  it("should successfully create user and send email", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("password", "password123");
    formData.append("phoneNumber", "1234567890");

    (prisma.user.findFirst as any).mockResolvedValue(null);
    (hash as any).mockResolvedValue("hashed-password");
    (prisma.user.create as any).mockResolvedValue({ id: "new-user-id" });
    (sendVerificationEmail as any).mockResolvedValue(true);

    const result = await registerUser(formData);

    expect(result.success).toBe(true);
    expect(prisma.user.create).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalled();
  });

  it("should rollback (delete user) if email sending fails", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("password", "password123");
    formData.append("phoneNumber", "1234567890");

    (prisma.user.findFirst as any).mockResolvedValue(null);
    (hash as any).mockResolvedValue("hashed-password");
    (prisma.user.create as any).mockResolvedValue({ id: "new-user-id" });
    (sendVerificationEmail as any).mockRejectedValue(new Error("SMTP Error"));

    const result = await registerUser(formData);

    expect(result.success).toBe(false);
    expect(result.message).toContain("Failed to send verification email");
    
    // Verify rollback
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "new-user-id" } });
  });
});