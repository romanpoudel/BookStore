import { Op } from "sequelize";
import bookModel from "../models/bookModel.js";
import textConstants from "../constants/textConstants.js";
import urlConstants from "./urlConstants.js";

export default class BookController {
	async addBook(req, res, imageName) {
		try {
			const data = await bookModel.create({
				...req.body,
				image: imageName,
			});
			console.log(data);
			if (data) {
				res.json(data);
			} else {
				res.json({
					success: false,
					message: "Error during adding the book.",
				});
			}
		} catch (err) {
			return res.json({
				success: false,
				message: "Error while Quering in Database",
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
			res.json({
				success: false,
				message: textConstants.BOOK_ID_NOT_PROVIDED,
			});
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
			res.json({
				success: false,
				message: textConstants.BOOK_ID_NOT_PROVIDED,
			});
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
			res.json({
				success: false,
				message: textConstants.BOOK_ID_NOT_PROVIDED,
			});
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
				raw: true,
			});
			console.log(data);
			for (let d of data) {
				d.image = urlConstants.IMG_PATH_URL + d.image;
			}
			res.json(data);
		} else
			res.json({ success: false, message: "Empty Query Search String." });
	}

	async getBooks(req, res) {
		let { limit } = req.query;
		if (!limit) {
			limit = 20;
		}
		try {
			const data = await bookModel.findAll({
				limit: parseInt(limit),
				raw: true,
			});
			for (let d of data) {
				d.image = urlConstants.IMG_PATH_URL + d.image;
			}
			console.log(data);
			res.json(data);
		} catch (err) {
			res.json({ success: false, message: err });
		}
	}
}
