class SearchController < ApplicationController
    def get
        query = params[:query]
        owners = Owner.search(query)
        render json: { owners: owners }.to_json # provide react with the newly created cost
    end
end
