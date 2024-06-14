class ApiFeacture {
    constructor(query, queryStr, req) {
      this.query = query;
      this.queryStr = queryStr;
      this.req = req;
    }
  
    search() {
        // console.log('this.queryStr',this.queryStr)
      let nameFilter = {};
      if (this.queryStr.customer_name) {
        const searchTerm = this.queryStr.customer_name;
        console.log('22222',searchTerm)
        const regexTerm = searchTerm.replace(/\s/g, '\\s*').split('').join('.*');
        nameFilter = {
            customer_name: { $regex: searchTerm, $options: 'i' }
        };
      } else if (this.queryStr.type) {
        nameFilter.type = this.queryStr.type;
      } else if (this.queryStr.category) {
        nameFilter.category = this.queryStr.category;
      }
    
      this.query = this.query.find({ ...nameFilter });
      console.log("Search Query:", this.query.getFilter());
      return this;
    }
    
    filter() {
      const queryCopy = { ...this.queryStr };
      const removeFields = ["keyword", "page", "limit"];
  
      removeFields.forEach((key) => delete queryCopy[key]);
  
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
      this.query = this.query.find(this.query.getFilter());
      return this;
    }
  
    pagination(resultPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
      const skip = resultPerPage * (currentPage - 1);
      this.query = this.query.limit(resultPerPage).skip(skip);
      return this;
    }
  
    async exec() {
      try {
        const result = await this.query.exec();
        // console.log("Executed Query Result:", result);
        return result;
      } catch (error) {
        console.error("Execution Error:", error);
        throw error;
      }
    }
  }
  
  export default ApiFeacture;