class MemberSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :first_name, :last_name, :age, :gender, :role

  attributes :avatar do |object|
    host = (Rails.env.development? || Rails.env.test?) ? 'http://localhost:3000' : ENV['APP_URL']
    host + Rails.application.routes.url_helpers.rails_blob_path(object.avatar, only_path: true) if object.avatar.attached?
  end
end
