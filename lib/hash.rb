require_relative 'string.rb'

class Hash

  def symbolize_keys!
    d = self.dup
    d.each do |k, v| 
      v.symbolize_keys! if v.is_a?(Hash)
      self[:"#{k.methodize}"] = v 
    end
    self
  end

end