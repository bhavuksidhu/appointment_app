class OpportunitiesController < ApplicationController
    before_action :check_valid_member, only: [:create]
    before_action :set_opportunity, only: [:update]

    def create
      opportunityparams = opportunity_params
      opportunityparams[:stage_name] = opportunityparams[:stage_name].to_i
      @opportunity = Opportunity.new(opportunityparams)
      if @opportunity.save
        @opportunity.create_stage_history
        render json: OpportunitySerializer.new(@opportunity).serializable_hash, status: :created
      else
        render json: @opportunity.errors.full_messages, status: :unprocessable_entity
      end
    end

    def index
      opportunities = Opportunity.includes(patient: { avatar_attachment: :blob }, doctor: { avatar_attachment: :blob }).order(updated_at: :desc)
    
      # Initialize an empty hash for formatted data
      formatted_data = Hash.new { |hash, key| hash[key] = [] }
    
      opportunities.each do |op|
        # Serialize the opportunity along with patient and doctor, including avatar URLs
        op_data = op.attributes.merge(
          'patient' => op.patient.attributes.merge(
            'avatar' => op.patient.avatar.attached ? Rails.application.routes.url_helpers.rails_blob_url(op.patient.avatar, only_path: true)  : ""
          ),
          'doctor' => op.doctor.attributes.merge(
            'avatar' => op.doctor.avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_url(op.doctor.avatar, only_path: true)  : ""
          )
        )
    
        # Group opportunities by procedure_name
        formatted_data[op.stage_name] << op_data
      end
    
      # Render the response
      if formatted_data.any?
        render json: { opportunities: formatted_data }, status: :ok
      else
        render json: { message: "No Opportunity found" }, status: :not_found
      end
    end
    
    

    # def update
    #   stage_name = opportunity_params[:stage_name]
    #   if stage_name.present?
        
    #     unless ['Treated', 'Booked', 'Qualified', 'Lead'].include?(stage_name)
    #       render json: { error: 'Invalid stage_name' }, status: :unprocessable_entity
    #       return
    #     end
        
    #     existing_entry = @opportunity.stage_history.find { |entry| entry['stage_name'] == stage_name }

    #     if existing_entry
    #       existing_entry['timestamp'] = Time.current
    #     else
    #       @opportunity.stage_history << { stage_name: stage_name, timestamp: Time.current }
    #     end
    #   end

    #   if @opportunity.update(opportunity_params.except(:stage_name))
    #     render json: @opportunity
    #   else
    #     render json: @opportunity.errors.full_messages, status: :unprocessable_entity
    #   end
    # end
    
    def update
      opportunityparams = opportunity_params
      opportunityparams[:stage_name] = opportunityparams[:stage_name].to_i
      if @opportunity.update(opportunityparams)
        @opportunity.create_stage_history
        @opportunity.save
        render json: {save: true}, status: :ok
      else
        render json: @opportunity.errors.full_messages, status: :unprocessable_entity
      end
    end

    def fetch_opportunity
      opportunity = Opportunity.find(params[:id])
      patient = opportunity.patient
      doctor = opportunity.doctor
      allMembers = {patients: [{label: patient.name, id: patient.id}], doctors: [{label: doctor.name, id: doctor.id}]}
      opportunity = opportunity&.as_json
      opportunity['stage_name'] = Opportunity.stage_names[opportunity['stage_name'] ].to_i
      render json: {opportunity: opportunity, allMembers: allMembers}
    end

    private
    def opportunity_params
      params.require(:opportunity).permit(:procedure_name, :patient_id, :doctor_id, :stage_name, stage_history: {})
    end

    def check_valid_member
      doctor_id = opportunity_params[:doctor_id]
      patient_id = opportunity_params[:patient_id]

      unless Member.where(id: doctor_id, role: "doctor").exists?
      render json: { error: 'Invalid doctor ID' }, status: :unprocessable_entity
      return
      end

      unless Member.where(id: patient_id, role: "patient").exists?
      render json: { error: 'Invalid patient ID' }, status: :unprocessable_entity
      end
    end

    def set_opportunity
      @opportunity = Opportunity.find(params[:id])
    end
end


