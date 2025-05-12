import { Router } from "express";

export interface IRoute {
  router: Router;
  routes(): void;
}

export abstract class BaseRouter implements IRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  abstract routes(): void;
}
