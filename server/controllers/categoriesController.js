import { db } from '../db/connection.js';
import { listCategories } from '../models/categoryModel.js';

export function getCategories(req, res) {
  res.json(listCategories(db));
}
