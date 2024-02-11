class OpportunitiesController < ApplicationController
    before_action :check_valid_member, only: [:create, :update]
    before_action :set_opportunity, only: [:update]

    def create
      @opportunity = Opportunity.new(opportunity_params)
      @opportunity.stage_history = [{ stage_name: 'Lead', timestamp: Time.current }]
      if @opportunity.save
        render json: OpportunitySerializer.new(@opportunity).serializable_hash, status: :created
      else
        render json: @opportunity.errors.full_messages, status: :unprocessable_entity
      end
    end

    def index
      opportunities = Opportunity.includes(patient: { avatar_attachment: :blob }, doctor: { avatar_attachment: :blob })
    
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
        formatted_data[op.procedure_name] << op_data
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
      stage_name = opportunity_params[:stage_history][:stage_name]
      if stage_name.present?
        unless ['Treated', 'Booked', 'Qualified', 'Lead'].include?(stage_name)
          render json: { error: 'Invalid stage_name' }, status: :unprocessable_entity
          return
        end        
        @opportunity.stage_history = [{ stage_name: stage_name, timestamp: Time.current }]
      end

      if @opportunity.update(opportunity_params.except(:stage_history))
        render json: OpportunitySerializer.new(@opportunity).serializable_hash, status: :ok
      else
        render json: @opportunity.errors.full_messages, status: :unprocessable_entity
      end
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


