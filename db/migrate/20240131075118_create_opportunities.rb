class CreateOpportunities < ActiveRecord::Migration[7.1]
  def change
    create_table :opportunities do |t|
      t.string :procedure_name
      t.jsonb :stage_history
      t.references :patient, foreign_key: { to_table: :members }
      t.references :doctor, foreign_key: { to_table: :members }

      t.timestamps
    end
  end
end
