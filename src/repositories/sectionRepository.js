const Section = require('../models/sections');

module.exports = class SectionRepository{
    constructor(){
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
}