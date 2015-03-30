# reset heroku db
heroku pg:reset HEROKU_POSTGRESQL_CRIMSON --confirm music-xml-analyzer

# migrate db for laravel
php artisan migrate

# update db for cron
php artisan migrate --package="liebig/cron"