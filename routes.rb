protected_paths = ['/dropbox/get/*','/dropbox/save']

protected_paths.each do |path|
  before path do
    error 401,'Unauthorized' unless authorized?
  end
end

get '/' do
  haml :editor
end

get '/dropbox/connect' do
  redirect '/' if authorized?
  consumer = Dropbox::API::OAuth.consumer(:authorize)
  request_token = session[:request_token] = consumer.get_request_token
  redirect request_token.authorize_url(:oauth_callback => "#{request.base_url}/dropbox/authorize")
end

get '/dropbox/authorize' do
  result = session[:request_token].get_access_token(:oauth_verifier => params[:oauth_token])
  session[:dba] = {:token => result.token.encrypt, :secret => result.secret.encrypt}
  redirect '/'
end

get '/dropbox/get/dir' do
  ls(params[:dir]).to_json
end

get '/dropbox/get/file' do
  raise ArgumentError, 'Path required' unless params[:path]
  puts "receiving..." + params[:path]
  download params[:path]
end

# params: contents, path
post '/dropbox/save' do
  json = JSON.parse request.body.read
  result = save_file json['path'],json['contents']
  result.to_json
end