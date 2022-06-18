import ky from 'ky';
import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this)
        this.state = {
            loaded: false,
            value: '',
            mode: 'list',
            data: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    async getData() {
        try {
            if (this.state.mode === 'list') {
                const json = await ky.get('https://www.themealdb.com/api/json/v1/1/search.php?s='+this.state.value).json();
                await this.setState({
                    data: json['meals']
                } )
            }
            if (this.state.mode === 'meal') {
                const json2 = await ky.get('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+this.state.meal_id).json();
                await this.setState({
                    dish: json2['meals'][0],
                    loaded: true
                } )
            }
        } catch (e){

        }
    }

  createTable() {
  return this.state.data((item, index) => (
    <span className="indent" key={index}>
        {index}
    </span>
  ));
  }

  handleChange(event) {
      this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getData()
  }

  handleClick(id) {

    this.setState({
                mode: 'meal',
                meal_id: id
                } )
    this.getData()
  }


  render() {
  if (this.state.mode === 'list' && this.state.data === null) {
           return (
          <>
             <form onSubmit={this.handleSubmit}>
               <label>
                 Search for a meal:
                 <input type="text" value={this.state.value} onChange={this.handleChange} />
               </label>
               <input type="submit" value="GO" />
             </form>
          </>
      )
     }
    if (this.state.mode === 'list' && this.state.data !== null) {
           return (
          <>
             <form onSubmit={this.handleSubmit}>
               <label>
                 Search for a meal:
                 <input type="text" value={this.state.value} onChange={this.handleChange} />
               </label>
               <input type="submit" value="GO" />
             </form>
             {this.state.data.map((element, i) => {
                  return (<p key={i}><a href="#" onClick={this.handleClick.bind(this,element.idMeal)}> {element.strMeal} </a></p>)
              })
              }
          </>
      )
     }
  if (this.state.mode === 'meal' && this.state.loaded === true) {
           return (
          <>
            <h1>{this.state.dish.strMeal}</h1>
            <img className="photo" src={this.state.dish.strMealThumb}></img>
            <p>{this.state.dish.strInstructions}</p>
          </>
      )
     }
  }
}
