Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  resources :members
  resources :opportunities

  get '/doctors',to: 'members#doctor_list'
  get '/patients',to: 'members#patient_list'
  get '/searchPatients',to: 'members#search_patients'
  get '/searchDoctors',to: 'members#search_doctors'
  get '/fetchOpportunity/:id', to: "opportunities#fetch_opportunity"

end