require 'jwt'

class Something
   CLOSE_YOUR_EYES = "uyufidsy768rew786erwuyiuyrwe"

   def generate_jwt(payload)
      return JWT.encode payload, CLOSE_YOUR_EYES, 'HS256'
   end
end