require 'rails_helper'

describe Api::V2::ChildrenController, type: :request do

  before :each do
    @case1 = Child.create!(data: { name: "Test1", age: 5, sex: 'male' })
    @case2 = Child.create!(data: {name: "Test2", age: 10, sex: 'female'})
    @case3 = Child.create!(
        data: {
            name: "Test3", age: 6, sex: 'male',
            family_details: [
                {unique_id: 'a1', relation_type: 'mother', age: 33},
                {unique_id: 'a2', relation_type: 'father', age: 32}
            ]
        }
    )
    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/cases', search: true do

    it 'lists cases and accompanying metadata' do
      login_for_test
      get '/api/v2/cases'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map{|c| c['name']}).to include(@case1.name, @case2.name)
      expect(json['metadata']['total']).to eq(3)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

    it 'shows relevant fields' do
      login_for_test(permitted_field_names: %w(age sex))
      get '/api/v2/cases'

      record = json['data'][0]
      expect(record.keys).to match_array(%w(id age sex))
    end

    it 'refuses unauthorized access' do
      login_for_test(permissions: [])
      get '/api/v2/cases'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
    end

  end

  describe 'GET /api/v2/cases/:id' do
    it 'fetches the correct record with code 200' do
      login_for_test
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case1.id)
    end

    it 'shows relevant fields' do
      login_for_test(permitted_field_names: %w(age sex))
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(200)
      expect(json['data'].keys).to match_array(%w(id age sex))
    end

    it "returns 403 if user isn't authorized to access" do
      login_for_test(group_permission: Permission::SELF)
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
    end

    it 'returns a 404 when trying to fetch a record with a non-existant id' do
      login_for_test
      get '/api/v2/cases/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/thisdoesntexist')
    end
  end

  describe 'POST /api/v2/cases' do
    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test
      params = {data: {name: 'Test', age: 12, sex: 'female'}}
      post '/api/v2/cases', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['name']).to eq(params[:data][:name])
      expect(json['data']['age']).to eq(params[:data][:age])
      expect(json['data']['sex']).to eq(params[:data][:sex])
      expect(Child.find_by(id: json['data']['id'])).not_to be_nil
    end

    describe 'empty response' do

      let(:json) { nil }

      it 'creates a new record with 204 and returns no JSON if the client generated the id' do
        login_for_test
        id = SecureRandom.uuid
        params = {
            data: {id: id, name: 'Test', age: 12, sex: 'female'}
        }
        post '/api/v2/cases', params: params

        expect(response).to have_http_status(204)
        expect(Child.find_by(id: id)).not_to be_nil
      end

    end

    it "returns 403 if user isn't authorized to create records" do
      login_for_test(permissions: [])
      id = SecureRandom.uuid
      params = {
          data: {id: id, name: 'Test', age: 12, sex: 'female'}
      }
      post "/api/v2/cases", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases")
      expect(Child.find_by(id: id)).to be_nil
    end

    it 'returns a 409 if record already exists' do
      login_for_test
      params = {
          data: {id: @case1.id, name: 'Test', age: 12, sex: 'female'}
      }
      post "/api/v2/cases", params: params

      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases")
    end

    it 'returns a 422 if the case record is invalid' do
      login_for_test
      params = {
          data:  {name: 'Test', age: 12, sex: 'female', registration_date: 'is invalid'}
      }
      post "/api/v2/cases", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases")
      expect(json['errors'][0]['detail']).to eq("registration_date")
    end

  end

  describe 'PATCH /api/v2/cases/:id' do

    it 'updates an existing record with 200' do
      login_for_test
      params = {data: {name: 'Tester', age: 10, sex: 'female'}}
      patch "/api/v2/cases/#{@case1.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case1.id)

      case1 = Child.find_by(id: @case1.id)
      expect(case1.data['age']).to eq(10)
      expect(case1.data['sex']).to eq('female')
    end

    it 'appends to rather than replaces nested forms' do
      login_for_test
      params = {
        data: {
          family_details: [
            {unique_id: 'a1', relation_type: 'mother', age: 35},
            {unique_id: 'a3', relation_type: 'uncle',  age: 50}
          ]
        }
      }
      patch "/api/v2/cases/#{@case3.id}", params: params

      expect(response).to have_http_status(200)

      case3 = Child.find_by(id: @case3.id)
      family_details = case3.data['family_details']
      uncle = family_details.select{|f| f['unique_id'] == 'a3' && f['relation_type'] == 'uncle'}
      expect(family_details.size).to eq(3)
      expect(uncle.present?).to be true
    end

    it 'removes nested forms marked for deleteion' do
      login_for_test
      params = {
          data: {
              family_details: [
                  {unique_id: 'a1', _delete: true},
                  {unique_id: 'a3', relation_type: 'uncle',  age: 50}
              ]
          }
      }
      patch "/api/v2/cases/#{@case3.id}", params: params

      expect(response).to have_http_status(200)

      case3 = Child.find_by(id: @case3.id)
      family_details = case3.data['family_details']
      mother = family_details.select{|f| f['unique_id'] == 'a1' && f['relation_type'] == 'mother'}
      expect(family_details.size).to eq(2)
      expect(mother.present?).to be false
    end

    it "returns 403 if user isn't authorized to update records" do
      login_for_test(permissions: [])
      params = {data: {name: 'Tester', age: 10, sex: 'female'}}
      patch "/api/v2/cases/#{@case1.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
    end

    it 'returns a 422 if the case record is invalid' do
      login_for_test
      params = {
          data: {name: 'Test', age: 12, sex: 'female', registration_date: 'is invalid'}
      }
      patch "/api/v2/cases/#{@case1.id}", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
      expect(json['errors'][0]['detail']).to eq("registration_date")
    end


  end

  after :each do
    Child.destroy_all
  end

end