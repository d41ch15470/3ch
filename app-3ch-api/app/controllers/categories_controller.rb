class CategoriesController < ApplicationController    
    def index
        render json: { status: "success",
            categories: Category.all
        }
    end

    def create
        Category.create({:category_name => "category1", :status => false})
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
