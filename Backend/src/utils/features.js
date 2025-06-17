export class Features {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  pagination() {
    const page = Math.max(parseInt(this.queryString.page) || 1, 1);
    const limit = parseInt(this.queryString.limit) || 20;
    const skip = (page - 1) * limit;

    this.page = page;
    this.limit = limit;
    this.skip = skip;

    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  filter() {
    let filterObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "fields", "keyword"];
    excludedFields.forEach((el) => delete filterObj[el]);

    const mongoFilter = {};

    Object.keys(filterObj).forEach((key) => {
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const field = match[1];
        const operator = match[2];
        if (!mongoFilter[field]) mongoFilter[field] = {};
        mongoFilter[field][`$${operator}`] = filterObj[key];
      } else {
        mongoFilter[key] = filterObj[key];
      }
    });

    this.mongooseQuery = this.mongooseQuery.find(mongoFilter);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortedBy);
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { name: { $regex: keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}
