class OpportunitySerializer < ActiveModel::Serializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :procedure_name, :doctor_id, :patient_id, :stage_history

  attribute :doctor_details do |obj|
    if obj.doctor_id.present?
      doc = Member.find(obj.doctor_id)
      MemberSerializer.new(doc).serializable_hash
    end
  end

  attribute :patient_details do |obj|
    if obj.patient_id.present?
      patient = Member.find(obj.patient_id)
      MemberSerializer.new(patient).serializable_hash
    end
  end
end
