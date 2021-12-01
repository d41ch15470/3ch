class Auth::SessionsController < DeviseTokenAuth::SessionsController
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

  def create_and_assign_token
    if @resource.respond_to?(:with_lock)
      @resource.with_lock do
        @token = @resource.create_token
        @resource.save!
      end
    else
      @token = @resource.create_token
      @resource.save!
    end
  end

  def provider
    'user_id'
  end

  def resource_params
    params.require(:session).permit(:user_id, :password, :user_type)
  end
end
