class CategoriesController < ApplicationController
  before_action :authenticate_admin?, only: %i[create update destroy]

  def index
    categories = if admin?
                   Category.left_outer_joins(:posts)
                           .where.not(status: true)
                           .group(:id, :category_name)
                           .select('categories.id, category_name, count(posts.id) as count, sum(ifnull(posts.hidden, 0)) hidden_count')
                 else
                   Category.where.not(status: true)
                           .select('categories.id, category_name')
                 end

    category_list = nil
    if admin?
      category_list = []
      # 集計
      cnt = 0
      hidden_cnt = 0
      categories.each do |category|
        cnt += category[:count]
        hidden_cnt += category[:hidden_count]
        category_list.push(category)
      end
      category_list.unshift({ id: -1, category_name: 'すべて', count: cnt, hidden_count: hidden_cnt })
    else
      category_list = categories
    end

    response = {
      categories: category_list
    }

    send_success(:ok, response)
  end

  def create
    params.require(:category).permit(:category_name)

    Category.create({ category_name: params[:category_name], status: false })

    send_success(:ok)
  end

  def update
    params.require(:category).permit(:category_id, :category_name)

    @category = Category.find(params[:category_id])
    @category.update({ category_name: params[:category_name] })

    send_success(:ok)
  end

  def destroy
    params.permit(:category_id)

    @category = Category.find(params[:category_id])
    @category.update({ status: true })

    send_success(:ok)
  end
end
