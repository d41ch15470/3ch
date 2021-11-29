Rails.application.routes.draw do
  # devise
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    registrations: 'auth/registrations',
    sessions: 'auth/sessions'
  }
  devise_scope :user do
    get '/auth', to: 'auth/registrations#index'
  end

  # categories
  get '/categories', to: 'categories#index'
  post '/categories', to: 'categories#create'
  patch '/categories/:category_id', to: 'categories#update'
  delete '/categories/:category_id', to: 'categories#destroy'

  # posts
  get '/posts', to: 'posts#index'
  get '/categories/:category_id/posts', to: 'posts#index'
  post '/categories/:category_id/posts', to: 'posts#create'
  patch '/posts/:post_id', to: 'posts#update'
end