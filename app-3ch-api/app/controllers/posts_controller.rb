class PostsController < ApplicationController
    def index
        render json: { status: "success",
            posts: Post.left_outer_joins(:category).order(created_at: "DESC").select(:id, :category_name, :anonymous_id, :name, :mail, :title, :body, :hidden),
            total_count: 10,
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
        print @post.hidden
        @post.update({ :hidden => params[:hidden]})
        render json: { status: "success" }
    end

    def destroy
        render json: { action: action_name }
    end
end
