import React from 'react';



export default class Header extends React.Component{
  

  render(){
    return(
      <section className = 'hero is-bold is-primary'>
        <div className = 'hero-body'>
          <div className = 'container'>
            <h1 className = 'title'>
              IMS
            </h1>
            <h2 className = 'subtitle'>
              Inventory Management System
            </h2>
          </div>
        </div>
      </section>
    );
  }
}