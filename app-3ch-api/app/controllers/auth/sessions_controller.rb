class Auth::SessionsController < DeviseTokenAuth::SessionsController
  private

  def provider
    'user_id'
  end

  def resource_params
    params.require(:session).permit(:user_id, :password)
  end
end
