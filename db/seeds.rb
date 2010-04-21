# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#   
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Major.create(:name => 'Daley', :city => cities.first)
User.create("user_type" => "Administrator",
            "user_name" => "rapidftr",
            "password" => "rapidftr",
            "password_confirmation" => "rapidftr",
            "full_name" => "RapidFTR",
            "email" => "rapidftr@rapidftr.com"
)


name_field = FieldDefinition.new "name" => "name", "type" => "text_field"
age_field = FieldDefinition.new "name" => "age", "type" => "text_field"
age_is_field = FieldDefinition.new "name" => "age_is", "type" => "select_box", "options" => ["Approximate", "Exact"]
FormSectionDefinition.create!("name" =>"Basic details", "enabled"=>"true", :description => "Basic information about a child", :order=> 1, :unique_id=>"basic_details", :fields=>[name_field, age_field, age_is_field])

FormSectionDefinition.create!("name" =>"Family details", "enabled"=>"true", :description =>"Information about a child's known family", :order=> 2, :unique_id=>"family_details", :fields=>Array.new)

FormSectionDefinition.create!("name" =>"Caregiver details", "enabled"=>"true", :description =>"Information about the child's current caregiver", :order=> 3, :unique_id=>"caregiver_details", :fields=>Array.new)

SuggestedField.create!("name"=>"Sample suggested field", "unique_id"=> "field_1", "description"=>"This is a useful field", :is_used=>"false", "field"=> FieldDefinition.new(:name=>"theField", :type=>"TEXT"))
SuggestedField.create!("name"=>"Another suggested field", "unique_id"=> "field_2", "description"=>"This is a useful field", :is_used=>"false", "field"=> FieldDefinition.new(:name=>"theSecondField", :type=>"radio_button"))