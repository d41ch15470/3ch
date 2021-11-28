class PostsController < ApplicationController
    def index
        params.permit(:category_id)

        posts = []
        if params[:category_id] != nil then
            posts = Post.left_outer_joins(:category)
                        .where(category_id: params[:category_id])
                        .where.not(categories: {status: "delete"})
                        .order(created_at: "DESC")
                        .select(:id, :category_name, :anonymous_id, :name, :mail, :title, :body, :hidden)
        else
            posts = Post.left_outer_joins(:category)
                        .where.not(categories: {status: "delete"})
                        .order(created_at: "DESC")
                        .select(:id, :category_name, :anonymous_id, :name, :mail, :title, :body, :hidden)
        end

        render json: { status: "success",
            posts: posts,
            total_count: posts.size(),
        }
    end

    def create
        params.require(:post).permit(:category_id, :anonymous_id, :name, :mail, :title, :body)
        post = {
            :category_id => params[:category_id],
            :anonymous_id => params[:anonymous_id],
            :name => params[:name],
            :mail => params[:mail],
            :title => params[:title],
            :body => params[:body],
            :hidden => false,
        }
        Post.create(post)
        render json: { status: "success" }
    end

    def show
        render json: { action: action_name }
    end

    def update
        params.require(:post).permit(:post_id, :hidden)
        @post = Post.find(params[:post_id])
        @post.update({ :hidden => params[:hidden]})
        render json: { status: "success" }
    end

    def destroy
        render json: { action: action_name }
    end
end
