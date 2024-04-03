const Session = require('../models/sessions');

module.exports = class SessionRepository{
  constructor(){
    this.model = Session;
}

  async create(data){
    const session = new Session(data);
    return await session.save();
  }

  async getByEntity(entity){
    try {
      const session = await this.model.findOne(entity);
      return session;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(filter, entity) {
    try {
      const session = await this.model.findOneAndUpdate(filter, entity);
      return session;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}