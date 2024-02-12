class AddStageNameToOpportunity < ActiveRecord::Migration[7.1]
  def change
    add_column :opportunities, :stage_name, :integer, default: 1
  end
end
