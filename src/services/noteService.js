const NoteRepository = require('../repositories/noteRepository');
const {
    ConflictResponse,
    BadRequest,
    InternalServerError,
    NotFoundResponse,
  } = require("../common/error.response");
  const { 
    CreatedResponse,
    SuccessResponse,
  } = require("../common/success.response");
module.exports = class NoteService {
    constructor() {
        this.repository = new NoteRepository();
    }

    async getNotes(userId, courseId) {
        try {
            const entities = { userId, courseId };
            const notes = await this.repository.getByEntities(entities);
            if (!notes) {
                return new NotFoundResponse("Notes not found");
            }
            return new SuccessResponse({ message: "Notes found", metadata: notes });
        } catch (error) {
            console.log(error);
            return new InternalServerError();
        }
    }

    async createNote(data) {
        try {
            const note = await this.repository.create(data);
            if (!note) {
                return new BadRequest("Note not created");
            }

            return new CreatedResponse({ message: "Note created", metadata: note });
        } catch (error) {
            console.log(error);
            return new InternalServerError();
        }
    }

    async updateNoteById(noteId, data) {
        try {
            const note = await this.repository.update({ _id: noteId }, data);
            if (!note) {
                return new NotFoundResponse("Note not found");
            }
            return new SuccessResponse({ message: "Note updated", metadata: note });

        } catch (error) {
            console.log(error);
            return new InternalServerError();
        }
    }

    async deleteNoteById(noteId) {
        try {
            const note = await this.repository.delete({ _id: noteId });
            if (!note) {
                return new NotFoundResponse("Note not found");
            }
            if (note.result.ok === 1) {
                return new SuccessResponse({ message: "Note deleted" });
            } else {
                return new ConflictResponse("Note not deleted");
            }
        } catch (error) {
            console.log(error);
            return new InternalServerError();
        }
    }
}