import express from "express";
import path from "path";

export const configureStaticFiles = (app: express.Application): void => {
  app.use(express.static(path.join(process.cwd(), "public")));

  const uploadPath = path.join(process.cwd(), "public/uploads");
  const fs = require("fs");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};
