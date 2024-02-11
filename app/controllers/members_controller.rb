class MembersController < ApplicationController

    def create
        memberparams = create_member_params
        memberparams[:gender] =  memberparams[:gender].to_i
        memberparams[:role] =  memberparams[:role].to_i
        member = Member.new(memberparams)
        if member.save
            render json: MemberSerializer.new(member).serializable_hash, status: :created
        else
            render json: { errors: [{ member: 'Please enter all the details' }] }, status: :unprocessable_entity
        end
    end

    def doctor_list
        doctors = Member.where(role: "doctor")
        if doctors.present?
            render json: MemberSerializer.new(doctors).serializable_hash, status: :ok
        else
            render json: {message: "No doctor found"}, status: :not_found
        end
    end

    def patient_list
        patients = Member.where(role: "patient")
        if patients.present?
            render json: MemberSerializer.new(patients).serializable_hash, status: :ok
        else
            render json: {message: "No patient found"}, status: :not_found
        end
    end

    private
      def member_params
        params.require(:member).permit(:first_name, :last_name, :dob, :gender, :role, :avatar)
      end
      def create_member_params
        params.permit(:first_name, :last_name, :dob, :gender, :role, :avatar)
      end
end
