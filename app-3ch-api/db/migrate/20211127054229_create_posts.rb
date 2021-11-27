class CreatePosts < ActiveRecord::Migration[6.1]
  def change
    create_table :posts do |t|
      t.references :category, index: true, foreign_key: true
      t.string :anonymous_id
      t.string :name
      t.string :mail
      t.string :title
      t.text :body
      t.boolean :hidden

      t.timestamps
    end
  end
end
