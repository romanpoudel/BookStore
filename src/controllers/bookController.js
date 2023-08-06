import bookModel from "../models/bookModel.js";

export default class BookController {
  async addBook(req, res, imageName) {
    const data = await bookModel.create({ ...req.body, image: imageName });
    console.log(data);
    if (data) {
      res.json(data);
    } else {
      res.json({ success: false, message: "Error during adding the book." });
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
      console.log(id)
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
}
