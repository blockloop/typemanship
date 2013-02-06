# encoding: utf-8
require 'sinatra'
require "sinatra/cookies"
require 'haml'
require 'yaml'
require 'RedCloth'
require 'rdiscount'
require 'dropbox-api'
require 'ostruct'
require 'active_support/all'
require 'ap'
require 'ezcrypto'

helpers do
  include Rack::Utils
  include Sinatra::Cookies
  alias_method :h, :escape_html
  require_relative 'helpers.rb'
end

%w(lib).each do |req| 
  Dir["#{req}/*.rb"].each { |f| require_relative f }
end

JS = OpenStruct.new(YAML.load_file('./configs/javascripts.yaml'))
STYLESHEETS = OpenStruct.new(YAML.load_file('./configs/stylesheets.yaml'))
CACHE = {}
SETTINGS = YAML.load_file('./configs/config.yaml').symbolize_keys!

enable :sessions

configure :production do
  set :haml, { :ugly=>true }
  set :clean_trace, true
end

# configure dropbox
Dropbox::API::Config.app_key = ENV['dropbox_app_key'] || SETTINGS[:dropbox][:app_key]
Dropbox::API::Config.app_secret = ENV['dropbox_app_secret'] || SETTINGS[:dropbox][:app_secret]
Dropbox::API::Config.mode = "dropbox"


require_relative 'routes.rb'
