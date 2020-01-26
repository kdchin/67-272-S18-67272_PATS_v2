import React from "react"
import PropTypes from "prop-types"

const options = { year: 'numeric', month: 'short', day: 'numeric' }

class NewCostForm extends React.Component {
  state = {
    newPrice: '',
  };

  updatePrice = (event) => {
    this.setState({newPrice: event.target.value });
  }

  submitNewPrice = () => {
    // TODO: verify it's a number!
    const data = { medicine_cost: { medicine_id: this.props.medicineID, cost_per_unit: this.state.newPrice.toString() } };
    fetch('/medicine_costs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // you need this line!
      body: JSON.stringify(data),
    }).then(response => response.json()) // convert the response to a json promise
    .then(newMedicineCost => {
      console.log('new medicine cost', newMedicineCost);
      this.setState({ newPrice: ''}); // reset the form
      this.props.onNewMedicineCost(newMedicineCost); // update the prices list view
    })
    .then(console.log('new price saved!'));
  }

  render() {
    return (
      <React.Fragment>
        <input onChange={this.updatePrice} placeholder="Enter new price in cents!" />
        <button onClick={this.submitNewPrice}>Submit</button>
      </React.Fragment>
    )
  }
}

NewCostForm.propTypes = {
  medicineID: PropTypes.number.isRequired,
  onNewMedicineCost: PropTypes.func.isRequired
}

class CostHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingForm: false,
      prices: props.initialPrices,
    }
  }

  renderPrices = () => {
    if (this.state.prices.length === 0) {
      return 'Loading...'
    }
    return (
      <table className="striped highlight">
        <thead>
          <tr>
            <th>Date</th>
            <th className="align_right">Cost Per Unit</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.prices.map((price, i) =>  (
              <tr key={i}>
                <td>{(new Date(price.start_date)).toLocaleDateString('en-US', options)}</td>
                <td className="align_right">{`$${(price.cost_per_unit/100.0).toFixed(2)}`}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }

  toggleNewForm = () => {
    const newIsShowingForm = !this.state.isShowingForm;
    this.setState({ isShowingForm: newIsShowingForm });
  }

  addNewMedicineCost = (newMedicineCost) => {
    const newPrices = [...this.state.prices]; // this is shorthand for copying an array (or object)
    newPrices.push(newMedicineCost);
    this.setState({ prices: newPrices, isShowingForm: false });
  }

  render () {
    return (
      <div className="card">
        <div className="card-content">
          <span className="card-title">Cost History</span>
          {this.renderPrices()}
          {this.state.isShowingForm ? <NewCostForm
                                        medicineID={this.props.medicine.id}
                                        onNewMedicineCost={this.addNewMedicineCost} /> : null }
        </div>
        {
          this.props.canMake ? (
          <div className="card-action">
            {/* <%= link_to "Add a new cost", new_medicine_cost_path(medicine_id: @medicine.id) %> */}
            <a onClick={this.toggleNewForm}>{this.state.isShowingForm ? "Cancel" : "Add a new cost"}</a>
          </div>
          ) : null
        }
      </div>
    );
  }
}

CostHistory.propTypes = {
  medicine: PropTypes.object.isRequired,
  initialPrices: PropTypes.array.isRequired,
  canMake: PropTypes.bool,
}

export default CostHistory
