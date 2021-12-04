class Auth::SessionsController < DeviseTokenAuth::SessionsController
  def index
    params.require(:session).permit(:type)

    if params[:type] == 'admin' && admin?
      send_success(:ok)
    elsif params[:type] == 'user' && user?
      send_success(:ok)
    else
      send_error(:unauthorized, 'authentication error')
    end
  end

  private

  def find_resource(field, value)
    type = get_case_insensitive_field_from_resource_params('user_type')
    @resource = if database_adapter&.include?('mysql')
                  # fix for mysql default case insensitivity
                  resource_class.where("BINARY #{field} = ? AND provider= ? AND user_type = ?", value, provider,
                                       type).first
                else
                  resource_class.dta_find_by(field => value, 'provider' => provider, 'user_type' => type)
                end
  end

  def provider
    'user_id'
  end

  def resource_params
    params.require(:session).permit(:user_id, :password, :user_type)
  end
end
