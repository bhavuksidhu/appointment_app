class Member < ApplicationRecord

  attr_accessor :dob

  has_one_attached :avatar
  enum role: { doctor: 1, patient: 2 }
  enum gender: { male: 1, female: 2 } 
  before_save :calculate_age_from_dob

  def calculate_age_from_dob
    return unless dob.present?
    # dob_date = Date.strptime(dob.to_s, "%d/%m/%Y")
    self.age = (Date.current - dob.to_date).to_i / 365
  end    
end
