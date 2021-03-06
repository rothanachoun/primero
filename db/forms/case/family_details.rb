family_details_fields_subform = [
  Field.new({"name" => "relation_name",
             "type" => "text_field",
             "display_name_en" => "Name",
             "matchable" => true
           }),
  Field.new({"name" => "relation",
             "type" => "select_box",
             "display_name_en" => "How are they related to the child?",
             "option_strings_source" => "lookup lookup-family-relationship",
             "matchable" => true
            }),
  Field.new({"name" => "relation_is_caregiver",
             "type" => "tick_box",
             "display_name_en" => "Is this person the caregiver?",
             "tick_box_en" => "Yes"
            }),
  Field.new({"name" => "relation_child_lived_with_pre_separation",
             "type" => "radio_button",
             "display_name_en" => "Did the child live with this person before separation?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "relation_child_is_in_contact",
             "type" => "radio_button",
             "display_name_en" => "Is the child in contact with this person?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "relation_child_is_separated_from",
             "type" => "radio_button",
             "display_name_en" => "Is the child separated from this person?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "relation_identifiers",
             "type" => "text_field",
             "display_name_en" => "List any agency identifiers as a comma separated list"
           }),
  Field.new({"name" => "relation_nickname",
             "type" => "text_field",
             "display_name_en" => "Nickname",
             "matchable" => true
           }),
  Field.new({"name" => "relation_is_alive",
             "type" => "select_box",
             "display_name_en" => "Is this family member alive?",
             "option_strings_text_en" => [
               { id: 'unknown', display_text: "Unknown" },
               { id: 'alive', display_text: "Alive" },
               { id: 'dead', display_text: "Dead" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "relation_death_details",
             "type" => "textarea",
             "display_name_en" => "If dead, please provide details"
           }),
  Field.new({"name" => "relation_age",
             "type" => "numeric_field",
             "display_name_en" => "Age"
           }),
  Field.new({"name" => "relation_date_of_birth",
             "type" => "date_field",
             "display_name_en" => "Date of Birth",
             "date_validation" => "not_future_date"
           }),
  Field.new({"name" => "relation_language",
             "type" => "select_box",
             "display_name_en" => "Language",
             "multi_select" => true,
             "option_strings_source" => "lookup lookup-language",
             "matchable" => true
           }),
  Field.new({"name" => "relation_religion",
             "type" => "select_box",
             "display_name_en" => "Religion",
             "multi_select" => true,
             "option_strings_source" => "lookup lookup-religion",
             "matchable" => true
           }),
  Field.new({"name" => "relation_ethnicity",
             "type" => "select_box",
             "display_name_en" => "Ethnicity",
             "option_strings_source" => "lookup lookup-ethnicity",
             "matchable" => true
           }),
  Field.new({"name" => "relation_sub_ethnicity1",
             "type" => "select_box",
             "display_name_en" => "Sub Ethnicity 1",
             "option_strings_source" => "lookup lookup-ethnicity"
           }),
  Field.new({"name" => "relation_sub_ethnicity2",
             "type" => "select_box",
             "display_name_en" => "Sub Ethnicity 2",
             "option_strings_source" => "lookup lookup-ethnicity"
           }),
  Field.new({"name" => "relation_nationality",
             "type" => "select_box",
             "display_name_en" => "Nationality",
             "multi_select" => true,
             "option_strings_source" => "lookup lookup-country",
             "matchable" => true
           }),
  Field.new({"name" => "relation_comments",
             "type" => "textarea",
             "display_name_en" => "Comments"
           }),
  Field.new({"name" => "relation_occupation",
             "type" => "text_field",
             "display_name_en" => "Occupation"
           }),
  Field.new({"name" => "relation_address_current",
             "type" => "textarea",
             "display_name_en" => "Current Address",
             "matchable" => true
           }),
  Field.new({"name" => "relation_address_is_permanent",
             "type" => "tick_box",
             "display_name_en" => "Is this a permanent location?"
            }),
  Field.new({"name" => "relation_location_current",
             "type" => "select_box",
             "display_name_en" => "Current Location",
             "searchable_select" => true,
             "option_strings_source" => "Location",
             "matchable" => true
           }),
  Field.new({"name" => "relation_address_last",
             "type" => "textarea",
             "display_name_en" => "Last Known Address"
           }),
  Field.new({"name" => "relation_location_last",
             "type" => "select_box",
             "display_name_en" => "Last Known Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
           }),
  Field.new({"name" => "relation_telephone",
             "type" => "text_field",
             "display_name_en" => "Telephone",
             "matchable" => true
           }),
  Field.new({"name" => "relation_other_family",
             "type" => "text_field",
             "display_name_en" => "Other persons well known to the child"
           })
]

family_details_section = FormSection.create_or_update_form_section({
    "visible"=>false,
    "is_nested"=>true,
    :mobile_form => true,
    :order_form_group => 50,
    :order => 10,
    :order_subform => 1,
    :unique_id=>"family_details_section",
    :parent_form=>"case",
    "editable"=>true,
    :fields => family_details_fields_subform,
    :initial_subforms => 1,
    "name_en" => "Nested Family Details",
    "description_en" => "Family Details Subform",
    #relation_is_caregiver will have some special manage in the subforms headers.
    "collapsed_fields" => ["relation", "relation_name", "relation_is_caregiver"]
})

family_details_fields = [
  Field.new({"name" => "family_size",
             "type" => "numeric_field",
             "display_name_en" => "Size of Family"
           }),
  Field.new({"name" => "family_notes",
             "type" => "textarea",
             "display_name_en" => "Notes about Family"
           }),
  Field.new({"name" => "childs_intended_address",
             "type" => "textarea",
             "display_name_en" => "What is the child’s intended address?"
           }),
  ##Subform##
  Field.new({"name" => "family_details_section",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => family_details_section.unique_id,
             "display_name_en" => "Family Details"
            }),
  ##Subform##
]

FormSection.create_or_update_form_section({
  :unique_id => "family_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 50,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Family / Partner Details",
  "editable" => true,
  :fields => family_details_fields,
  "name_en" => "Family Details",
  "description_en" => "Family Details",
  :mobile_form => true
})
