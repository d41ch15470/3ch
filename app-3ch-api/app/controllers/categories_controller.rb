class CategoriesController < ApplicationController
  def index
    params.permit(:allCnt)

    categories = Category.left_outer_joins(:posts)
                         .where.not(status: 'delete')
                         .group(:id, :category_name)
                         .select('categories.id, category_name, count(posts.id) as count, sum(ifnull(posts.hidden, 0)) hidden_count')

    # 集計
    cnt = 0
    hidden_cnt = 0
    categories_list = []
    categories.each do |category|
      cnt += category[:count]
      hidden_cnt += category[:hidden_count]
      categories_list.push(category)
    end

    if params[:allCnt] == 'true'
      categories_list.unshift({ id: -1, category_name: 'すべて', count: cnt, hidden_count: hidden_cnt })
    end

    response = {
      categories: categories_list
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
