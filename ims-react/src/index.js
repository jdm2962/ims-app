import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css'

import Header from './components/header.js';
import Table from './components/table.js';




class App extends React.Component{

  render(){
    return(
      <div className = "">
        <Header />
        <Table />
        
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
