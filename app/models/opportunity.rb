class Opportunity < ApplicationRecord
  enum stage_name: { lead: 1, qualified: 2, booked: 3, treated: 4 }
  belongs_to :patient, class_name: 'Member', foreign_key: 'patient_id'
  belongs_to :doctor, class_name: 'Member', foreign_key: 'doctor_id'
  validates :procedure_name, presence: true

  def create_stage_history
    self.stage_history ||= []
    self.stage_history << { stage_name: stage_name, timestamp: Time.current }
    self.save
  end
end
