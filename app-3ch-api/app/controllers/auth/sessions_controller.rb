class Auth::SessionsController < DeviseTokenAuth::SessionsController
  def index
    if user_signed_in?
      send_success(:ok, { user_type: current_user.user_type })
    else
      send_error(:unauthorized, 'authentication error')
    end
  end

  def provider
    'user_id'
  end

  def resource_params
    params.require(:session).permit(:user_id, :password)
  end
end
