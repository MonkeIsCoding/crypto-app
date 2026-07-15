import { Request, Response } from "express";
import * as accountService from "../services/accountService";

export async function deleteAccount(req: Request, res: Response): Promise<void> {
  await accountService.deleteAccount(req.uid!);
  res.status(204).send();
}
