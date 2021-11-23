class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def index
    render json: { user_id: SecureRandom.uuid }
  end

  private

  def build_resource
    @resource            = resource_class.new(sign_up_params)
    @resource.provider   = provider
    @resource.uid        = @resource.user_id
  end

  def provider
    'user_id'
  end

  def sign_up_params
    params.require(:registration).permit(:password, :user_id)
  end
end
