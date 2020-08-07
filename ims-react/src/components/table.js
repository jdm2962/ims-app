import React from 'react';


class Table extends React.Component{

	constructor(props){
		super(props);

		this.state = {

			// this is going to be an api call
			tableData : [],
			items : []
		}
	}

	componentDidMount(){

		fetch('http://ec2-3-94-195-38.compute-1.amazonaws.com/api/items')
			.then(res => res.json())
			.then((result) => {
				console.log(result);
				this.setState({
					tableData : Object.entries(result)
				})
			})
	}



	render(){
		
			const items = this.state.tableData.map((item) => {
			return (
				<tr className = 'tr' key = {item.itemId}>
					<td className = 'td'>id</td>
					<td className = 'td'>category</td>
					<td className = 'td'>name</td>
					<td className = 'td'>singles</td>
					<td className = 'td'>packages</td>
					<td className = 'td'>quantity per package</td>
				</tr>
			);
		});

			console.log(this.state.tableData);
		return(

			<table className = 'table'>
				<tbody className = 'tbody'>
					<tr className = 'td'>
						<th className = 'th'>Category</th>
						<th className = 'th'>ID</th>
						<th className = 'th'>Name</th>
						<th className = 'th'>Singles</th>
						<th className = 'th'>Packages</th>
						<th className = 'th'>Quantity Per Package</th>
					</tr>

					{items}

				</tbody>
			</table>
		);
	}
}

export default Table;