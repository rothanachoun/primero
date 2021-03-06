require 'rails_helper'

describe "form_section/_photo_upload_box.html.erb" do
  before :each do
    @child = Child.new("_id" => "id12345", "name" => "First Last")
    assigns[:child] = @child
  end

  it "should include image for tooltip when help text exists" do
    photo_upload_box = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'photo_upload_box',
    :help_text => "This is my help text"

    render :partial => 'form_section/photo_upload_box', :locals => { :photo_upload_box => photo_upload_box, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag("img.vtip")
  end

  it "should not include image for tooltip when help text not exists" do
    photo_upload_box = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'photo_upload_box'

    render :partial => 'form_section/photo_upload_box', :locals => { :photo_upload_box => photo_upload_box, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should_not have_tag("img.vtip")
  end

end
