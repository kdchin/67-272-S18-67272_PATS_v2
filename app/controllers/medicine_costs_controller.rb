class MedicineCostsController < ApplicationController
  before_action :check_login
  authorize_resource
  skip_before_action :verify_authenticity_token, :only => [:create] # better solution: add auth to react ajax request

  def new
    @medicine_cost = MedicineCost.new
    @medicine = Medicine.find(params[:medicine_id])
  end

  def create
    @medicine_cost = MedicineCost.new(medicine_cost_params)
    @medicine_cost.start_date = Date.current
    # @medicine_cost.cost_per_unit = @medicine_cost.cost_per_unit
    if @medicine_cost.save
      flash[:notice] = "Successfully updated medicine costs."
      # redirect_to medicine_path(@medicine_cost.medicine)
      render json: @medicine_cost.to_json # provide react with the newly created cost
    else
      @medicine = Medicine.find(params[:medicine_cost][:medicine_id])
      render action: 'new', locals: { medicine: @medicine }
    end
  end

  private
    def medicine_cost_params
      params.require(:medicine_cost).permit(:medicine_id, :cost_per_unit)
    end

end