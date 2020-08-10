import React from 'react';
import ReactDOM from 'react-dom';

import 'bulma/css/bulma.css';

import Header from './components/header.js';
import Body from './components/body.js';
import Footer from './components/footer.js';




class App extends React.Component{

  render(){
    return(
      <div className = "">
        <Header />
        <Body />
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
