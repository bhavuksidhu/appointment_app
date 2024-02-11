class CreateAdminUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :admin_users do |t|
      t.string :first_name
      t.string :last_name
      t.string :role

      t.timestamps
    end
  end
end
