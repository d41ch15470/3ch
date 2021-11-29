class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  protected

  def send_success(status, data = nil)
    send_response(status, true, nil, data)
  end

  def send_error(status, message, data = nil)
    send_response(status, false, message, data)
  end

  private

  def send_response(status, success, message, data = nil)
    response = {
      success: success,
      errors: [message]
    }
    response = response.merge(data) if data
    render json: response, status: status
  end
end
