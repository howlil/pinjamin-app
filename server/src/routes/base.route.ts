import { Router } from "express";
import { IRoute } from "../interfaces/route.interface";

export abstract class BaseRouter implements IRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  abstract routes(): void;
}
