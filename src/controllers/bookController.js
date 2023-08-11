import { Op } from "sequelize";
import bookModel from "../models/bookModel.js";

export default class BookController {
	async addBook(req, res, imageName) {
		const data = await bookModel.create({ ...req.body, image: imageName });
		console.log(data);
		if (data) {
			res.json(data);
		} else {
			res.json({
				success: false,
				message: "Error during adding the book.",
			});
		}
	}

	async getBookByID(req, res) {
		const { id } = req.params;
		if (id) {
			const data = await bookModel.findByPk(id);
			if (data) {
				res.json(data);
			} else {
				res.json([]);
			}
		} else {
			res.json({ success: false, message: "Book ID not provided." });
		}
	}

	async updateBook(req, res) {
		const { id } = req.params;
		if (id) {
			const data = await bookModel.update(req.body, {
				where: {
					id,
				},
			});
			if (data[0] === 1) {
				res.json({ success: true, message: "Updated Book" });
			} else {
				res.json({ success: false, message: "Couldn't Update Book" });
			}
		} else {
			res.json({ success: false, message: "Book ID not provided." });
		}
	}

	async deleteBook(req, res) {
		const { id } = req.params;
		console.log(id);
		if (id) {
			const data = await bookModel.destroy({
				where: {
					id,
				},
			});
			console.log(data);
			if (data === 1) {
				res.json({ success: true, message: "Book Deleted" });
			} else {
				res.json({ success: false, message: "Couldn't Delete Book" });
			}
		} else {
			res.json({ success: false, message: "Book ID not provided." });
		}
	}

	async searchBook(req, res) {
		const { q } = req.query;
		if (q) {
			const data = await bookModel.findAll({
				where: {
					[Op.or]: {
						name: {
							[Op.like]: `%${q}%`,
						},
						author: {
							[Op.like]: `%${q}%`,
						},
					},
				},
			});
			console.log(data);
			res.json(data);
		} else
			res.json({ success: false, message: "Empty Query Search String." });
	}

	async getBooks(req, res) {
		let { limit } = req.query;
		if (!limit) {
			limit = 20;
		}
		const data = await bookModel.findAll({
			limit: limit,
		});
		for(let d of data){
			d.dataValues.image="http://localhost:8000/uploads/"+d.dataValues.image;
		}
		console.log(data)
		res.json(data);
	}
}
