# Typemanship

Typemanship is an online Dropbox file editor written in sinatra. Typemanship uses bootstrap, knockoutjs, jquery, sinatra and is ready for heroku deployment.

## Usage

```
git clone git@github.com:brettof86/typemanship.git
cd typemanship
bundle install
```

Move configs/config.example.yaml to configs/config.yaml and add your Dropbox api key information where specified. Put any random alphanumeric values for the encryption key and salt also. (eg. syd98ouij3iha)

Once you've saved the config.yaml to the configs folder run:

```
ruby app.rb
```
