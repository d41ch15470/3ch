class PostsController < ApplicationController
    def index
        render json: { action: action_name }
    end

    def create
        render json: { action: action_name }
    end

    def show
        render json: { action: action_name }
    end

    def update
        render json: { action: action_name }
    end

    def destroy
        render json: { action: action_name }
    end
end
