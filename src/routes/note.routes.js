const express = require('express');
const NoteService = require('../services/noteService');
const service = new NoteService();
const noteRouter = express.Router();

noteRouter.post('/create', async (req, res) => {
    const data = req.body;
    console.log("body:", data);
    const response = await service.createNote(data);
    res.send(response.responseBody());
});

noteRouter.get('/', async (req, res) => {
    const userId = req.query.userId;
    const courseId = req.query.courseId;
    console.log("userId:", userId, "courseId:", courseId)
    const response = await service.getNotes(userId, courseId);
    res.send(response.responseBody());
});

noteRouter.put('/update', async (req, res) => {
    const noteId = req.body.noteId;
    const data = req.body.newContent;
    console.log(req.body)
    const response = await service.updateNoteById(noteId, data);
    res.send(response.responseBody());
});

noteRouter.delete('/delete/:id', async (req, res) => {
    const noteId = req.params.id;
    const response = await service.deleteNoteById(noteId);
    res.send(response.responseBody());
});

module.exports = {noteRouter};