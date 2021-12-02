class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include ActionController::Cookies

  protected

  def admin?
    user_signed_in? && current_user.user_type == 'admin'
  end

  def user?
    user_signed_in? && current_user.user_type == 'user'
  end

  def authenticate_admin?
    send_error(:unauthorized, 'authentication error') unless user_signed_in? && current_user.user_type == 'admin'
  end

  def authenticate_user?
    send_error(:unauthorized, 'authentication error') unless user_signed_in? && current_user.user_type == 'user'
  end

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
