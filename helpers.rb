def partial page
  haml :"_#{File.basename page.to_s}"
end

def ls path=nil
  path ||= "/"
  api.ls path
end

def authorized?
  not session[:dba].nil?
end

def download path
  path.slice!(0) if path.starts_with? '/'
  contents = api.download path
  {:contents => contents}.to_json
end

def save_file path,contents
  path.slice!(0) if path.starts_with? '/'
  api.upload path,contents
end

def cryptkey
  return @key if @key
  @enc_key = ENV['enc_key'] || SETTINGS[:encryption][:key]
  @salt = ENV['salt'] || SETTINGS[:encryption][:salt]
  @key ||= EzCrypto::Key.with_password(@enc_key,@salt)
end

private
def api
  return @client if @client
  secret = session[:dba][:secret].decrypt
  token = session[:dba][:token].decrypt
  @client ||= Dropbox::API::Client.new({:token => token, :secret => secret})
end

