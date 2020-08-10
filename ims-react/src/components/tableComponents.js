import React from 'react';
import {Component} from 'react';




class TableRow extends Component{

	constructor(props){
		super(props);

		this.state = {
			
		};

	}

	render(){

		return(
			<tr className = 'tr'>{this.props.children}</tr>
		);
	};
}




class TableData extends Component{
	constructor(props){
		super(props);

		this.state = {
			name : this.props.name,
			data : this.props.data,
			isEditable : true,
		};

		this.updateValue = this.updateValue.bind(this);

	}


	updateValue(e){

		// this.setState()
		console.log(e.target.value);
		this.setState({data : e.target.value});
	}





	render(){

		const isEditable = this.state.isEditable;
		const data = this.state.data;
		const name = this.state.name;
		let display;

		if(name === 'id' || name === 'total'){
			display = data;
		}
		else{
			display = isEditable 
			? 
				<input 
					type = 'text' 
					value = {data} 
					className = 'input' 
					onChange = {this.updateValue}
				/> 
			: 
				data;
		}

		return(
			<td>
				{display}
			</td>
		);
	}

}




class TableButton extends Component{
	constructor(props){
		super(props);

		this.state = {
			name : this.props.name,
			className : '',
			funcName : this.editData
		};


		this.updateData = this.updateData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.editData = this.editData.bind(this);
	}


	updateData(){
		console.log('update');
	}

	deleteData(){
		console.log('delete');
	}

	editData(){
		console.log('edit');
	}

	
	componentDidMount(){
		
		if(this.state.name === 'Update'){
			this.setState({
				className : 'button is-primary',
				funcName : this.updateData
			});
		}
		else if(this.state.name === 'Delete'){
			this.setState({
				className : 'button is-danger',
				funcName : this.deleteData
			});
		}
		else if(this.state.name === 'Edit'){
			this.setState({
				className : 'button is-warning',
				funcName : this.editData
			});
		}
	}

	render(){

		return(
			<button className = {this.state.className} onClick = {this.state.funcName}>
				{this.props.name}
			</button>
		);
	}
}


export {
	TableData,
	TableButton,
	TableRow	
};
