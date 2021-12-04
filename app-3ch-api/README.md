# API サーバ

- Ruby version

  3.0.2

- installation

```
bundle install
rails db:create
rials db:migrate
```

- rails db:create に失敗する場合

```
gem uninstall sqlite3 --all
gem install sqlite3 --platform ruby
```

- How to run

```
rails s
```
