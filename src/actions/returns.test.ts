import { describe, it, expect, vi, beforeEach } from "vitest";
import { createReturnRequest, getOrderDetails } from "./returns";
import { prisma } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    order: {
      findUnique: vi.fn(),
    },
    returnRequest: {
      create: vi.fn(),
    },
  },
}));

describe("Return Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOrderDetails", () => {
    it("should return error if order not found", async () => {
      (prisma.order.findUnique as any).mockResolvedValue(null);
      const result = await getOrderDetails("invalid-id", "test@example.com");
      expect(result.success).toBe(false);
      expect(result.error).toContain("Order not found");
    });

    it("should return error if email does not match", async () => {
      (prisma.order.findUnique as any).mockResolvedValue({
        id: "123",
        user: { email: "owner@example.com" },
      });
      const result = await getOrderDetails("123", "wrong@example.com");
      expect(result.success).toBe(false);
      expect(result.error).toContain("matching that email");
    });

    it("should return order details if valid", async () => {
      const mockOrder = {
        id: "123",
        createdAt: new Date(),
        user: { email: "owner@example.com" },
        items: [
          { productId: "prod1", quantity: 1, price: 50, product: { name: "Shirt", images: [] } }
        ]
      };
      (prisma.order.findUnique as any).mockResolvedValue(mockOrder);
      
      const result = await getOrderDetails("123", "owner@example.com");
      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
    });
  });

  describe("createReturnRequest", () => {
    it("should fail validation if fields missing", async () => {
      const formData = new FormData();
      const result = await createReturnRequest(formData);
      expect(result.success).toBe(false);
    });

    it("should create return request if valid", async () => {
      const formData = new FormData();
      formData.append("orderId", "123");
      formData.append("productId", "prod1");
      formData.append("quantity", "1");
      formData.append("reason", "Item is defective and damaged.");

      // Mock finding the order
      (prisma.order.findUnique as any).mockResolvedValue({
        id: "123",
        items: [{ productId: "prod1", quantity: 1 }]
      });

      // Mock creating the return
      (prisma.returnRequest.create as any).mockResolvedValue({ id: "ret_1" });

      const result = await createReturnRequest(formData);
      expect(result.success).toBe(true);
      expect(prisma.returnRequest.create).toHaveBeenCalled();
    });
  });
});