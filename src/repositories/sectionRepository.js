const Section = require('../models/sections');

module.exports = class SectionRepository {
  constructor() {
    this.model = Section;
  }

  async getAllByEntity(entity){
    try {
      const sections = await this.model.find(entity)
      return sections;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async create(data) {
    try {
      const newSection = new Section(data);
      await newSection.save();
      return newSection;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getByEntity(entity) {
    try {
      const section = await this.model.findOne(entity);
      return section;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAll() {
    try {
      const sections = await this.model.find();
      return sections;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(filter, entity) {
    try {
      const section = await this.model.findOneAndUpdate(filter, entity);
      return section;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(entity) {
    try {
      const section = await this.model.findOneAndDelete(entity);
      return section;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
