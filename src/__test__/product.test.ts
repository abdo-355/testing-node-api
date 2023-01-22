import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import app from "../app";
import { createProduct } from "../service/product.service";
import { signJwt } from "../utils/jwt.utils";

const userId = new mongoose.Types.ObjectId().toString();

const productPayload = {
  user: userId,
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  description:
    "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
  price: 879.99,
  image: "https://i.imgur.com/QlRphfQ.jpg",
};

const userPayload = {
  _id: userId,
  email: "j ane.doe@exampte.com",
  name: "Jane Doe",
};

describe("product", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.set("strictQuery", false).connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get product route", () => {
    it("should return a 404 if the product doesn't exist", async () => {
      const productId = "product-123";
      await supertest(app).get(`/api/products/${productId}`).expect(404);
    });

    it("should return a 200 status and the product if the product exists", async () => {
      const product = await createProduct(productPayload);

      const { body, statusCode } = await supertest(app).get(
        `/api/products/${product.productId}`
      );

      expect(statusCode).toBe(200);
      expect(body.productId).toBe(product.productId);
    });
  });

  describe("create product route", () => {
    it("should return a 403 if the user isn't signed in", async () => {
      const { statusCode } = await supertest(app).post("/api/products");

      expect(statusCode).toBe(403);
    });

    it("should return a 201 if the user is signed in", async () => {
      //@ts-ignore
      const jwt = signJwt(userPayload);

      const { statusCode } = await supertest(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${jwt}`)
        .send(productPayload);

      expect(statusCode).toBe(201);
    });
  });
});
