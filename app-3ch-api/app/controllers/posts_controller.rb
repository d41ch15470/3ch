class PostsController < ApplicationController
  def index
    params.permit(:category_id)

    posts = if !params[:category_id].nil?
              Post.left_outer_joins(:category)
                  .where(category_id: params[:category_id])
                  .where.not(categories: { status: 'delete' })
                  .order(created_at: 'DESC')
                  .select(:id, :category_name, :anonymous_id, :name, :mail, :title, :body, :hidden)
            else
              Post.left_outer_joins(:category)
                  .where.not(categories: { status: 'delete' })
                  .order(created_at: 'DESC')
                  .select(:id, :category_name, :anonymous_id, :name, :mail, :title, :body, :hidden)
            end

    response = {
      posts: posts,
      total_count: posts.size
    }

    send_success(:ok, response)
  end

  def create
    params.require(:post).permit(:category_id, :name, :mail, :title, :body)

    post = {
      category_id: params[:category_id],
      anonymous_id: current_user.nil? ? '' : current_user.uid,
      name: params[:name],
      mail: params[:mail],
      title: params[:title],
      body: params[:body],
      hidden: false
    }
    Post.create(post)

    send_success(:ok)
  end

  def update
    params.require(:post).permit(:post_id, :hidden)

    @post = Post.find(params[:post_id])
    @post.update({ hidden: params[:hidden] })

    send_success(:ok)
  end
end
