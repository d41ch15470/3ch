class InsertInitialUsers < ActiveRecord::Migration[6.1]
  def change
    User.create({ provider: 'user_id', uid: 'admin', user_id: 'admin', user_type: 'admin',
                  encrypted_password: '$2a$12$Fi2IOWm.tYTk0YaHk9WFpOI30UB.4L6nOyiz40tgOqV8rShO.3Hfm' })
    User.create({ provider: 'user_id', uid: 'user', user_id: 'user', user_type: 'user',
                  encrypted_password: '$2a$12$jmEbHs/YaPhptWMNArj9Kehq2gbiAUg6AamZDhMDwCQlE0vNnvkWC' })
  end
end
