const Note = require("../models/notes");
const mongoose = require("mongoose");

module.exports = class NoteRepository {
  constructor() {
    this.model = Note;
  }

  async getByEntities(entities) {
    try {
      //console.log(entities)
      const notes = await this.model.find(entities);
      return notes;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async create(data) {
    try {
      const newNote = new Note(data);
      await newNote.save();
      return newNote;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(filter, entity) {
    try {
      const note = await this.model.findOneAndUpdate(filter, entity, {
        new: true,
      });
      console.log(note);
      return note;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(entity) {
    try {
      const deletedNote = await this.model.deleteMany(entity);
      return deletedNote;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
