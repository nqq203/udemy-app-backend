const { STATUS_CODE } = require('../constants/statuscode.constant');

module.exports = class BaseResponse {
  constructor(status, success, message, data) {
    this.status = status || STATUS_CODE.INTERNAL_SERVER_ERROR;
    this.success = success || false;
    this.message = message || '';
    this.data = data || '';
  }

  responseBody() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}
