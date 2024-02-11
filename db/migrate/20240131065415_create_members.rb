class CreateMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :members do |t|
      t.string :first_name
      t.string :last_name
      t.integer :gender
      t.integer :age
      t.integer :role

      t.timestamps
    end
  end
end
