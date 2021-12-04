class Post < ApplicationRecord
  belongs_to :category

  validates :category_id, presence: true, numericality: { only_integer: true }
  validates :anonymous_id, length: { maximum: 16 }
  validates :name, length: { maximum: 50 }
  validates :mail, length: { maximum: 256 }
  validates :title, length: { maximum: 256 }
  validates :body, presence: true, length: { maximum: 500 }
end
