import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateReturnStatus, getReturnRequests } from "./admin-returns";
import { prisma } from "@/lib/db";
import { checkAdmin } from "@/lib/auth-guards";

vi.mock("@/lib/db", () => ({
  prisma: {
    returnRequest: {
      update: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth-guards", () => ({
  checkAdmin: vi.fn(),
}));

// Mock revalidatePath to avoid error
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Admin Returns Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateReturnStatus", () => {
    it("should fail if validation fails", async () => {
      const formData = new FormData();
      // Missing requestId and status
      const result = await updateReturnStatus(formData);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid input.");
    });

    it("should update status if valid", async () => {
      const formData = new FormData();
      formData.append("requestId", "req_123");
      formData.append("status", "APPROVED");

      (prisma.returnRequest.update as any).mockResolvedValue({
        id: "req_123",
        status: "APPROVED",
        order: { user: { email: "test@example.com" } },
        product: { name: "Product A" }
      });

      const result = await updateReturnStatus(formData);

      expect(checkAdmin).toHaveBeenCalled();
      expect(prisma.returnRequest.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "req_123" },
        data: expect.objectContaining({ status: "APPROVED" })
      }));
      expect(result.success).toBe(true);
    });
  });

  describe("getReturnRequests", () => {
    it("should return serialized requests", async () => {
      const mockDate = new Date();
      const mockRequests = [
        {
          id: "1",
          createdAt: mockDate,
          order: { id: "o1", user: { email: "a@b.com", name: "A" } },
          product: { name: "P1", images: ["img.jpg"], price: 100 } // Decimal usually returned as object/number by prisma mock
        }
      ];

      (prisma.returnRequest.findMany as any).mockResolvedValue(mockRequests);

      const result = await getReturnRequests();

      expect(checkAdmin).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].createdAt).toBe(mockDate.toISOString());
      expect(result[0].product.price).toBe(100);
    });
  });
});