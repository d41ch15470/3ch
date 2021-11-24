class Auth::SessionsController < DeviseTokenAuth::SessionsController

  def create
    # Check
    field = (resource_params.keys.map(&:to_sym) & resource_class.authentication_keys).first

    @resource = nil
    if field
      q_value = get_case_insensitive_field_from_resource_params(field)
      t_value = get_case_insensitive_field_from_resource_params("user_type")

      @resource = find_resource(field, q_value, t_value)
    end

    if @resource && valid_params?(field, q_value) && (!@resource.respond_to?(:active_for_authentication?) || @resource.active_for_authentication?)
      valid_password = @resource.valid_password?(resource_params[:password])
      if (@resource.respond_to?(:valid_for_authentication?) && !@resource.valid_for_authentication? { valid_password }) || !valid_password
        return render_create_error_bad_credentials
      end

      create_and_assign_token

      sign_in(:user, @resource, store: false, bypass: false)

      yield @resource if block_given?

      render_create_success
    elsif @resource && !(!@resource.respond_to?(:active_for_authentication?) || @resource.active_for_authentication?)
      if @resource.respond_to?(:locked_at) && @resource.locked_at
        render_create_error_account_locked
      else
        render_create_error_not_confirmed
      end
    else
      render_create_error_bad_credentials
    end
  end

  private

  def find_resource(field, value, type)
    @resource = if database_adapter&.include?('mysql')
                  # fix for mysql default case insensitivity
                  resource_class.where("BINARY #{field} = ? AND provider= ? AND user_type = ?", value, provider, type).first
                else
                  resource_class.dta_find_by(field => value, "provider" => provider, "user_type" => type)
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
