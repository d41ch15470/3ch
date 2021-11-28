class CategoriesController < ApplicationController    
    def index
        params.permit(:allCnt)

        categories = Category.left_outer_joins(:posts)
                             .where.not(status: "delete")
                             .group(:id, :category_name)
                             .select("categories.id, category_name, count(posts.id) as count, sum(ifnull(posts.hidden, 0)) hidden_count")

        # 集計
        cnt = 0
        hidden_cnt = 0
        categories_list = []
        categories.each do |category|
            cnt += category[:count]
            hidden_cnt = category[:hidden_count]
            categories_list.push(category)
        end

        if params[:allCnt] == "true" then
            categories_list.unshift({ :id => -1, :category_name => "すべて", :count => cnt, :hidden_count => hidden_cnt })
        end

        render json: { status: "success",
            categories: categories_list
        }
    end

    def create
        params.require(:category).permit(:category_name)
        Category.create({:category_name => params[:category_name], :status => false})
        render json: { status: "success" }
    end

    def show
        render json: { action: action_name }
    end

    def update
        params.require(:category).permit(:category_id, :category_name)
        @category = Category.find(params[:category_id])
        @category.update({ :category_name => params[:category_name] })
        render json: { status: "success" }
    end

    def destroy
        params.permit(:category_id)
        @category = Category.find(params[:category_id])
        @category.update({ :status => "delete" })
        render json: { status: "success" }
    end
end
