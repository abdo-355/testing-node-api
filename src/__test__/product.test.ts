import supertest from "supertest";

import app from "../app";

describe("product", () => {
  describe("get product route", () => {
    it("should return a 404 if the product doesn't exist", async () => {
      const productId = "product-123";
      await supertest(app).get(`/api/products/${productId}`).expect(404);
    });
  });
});
