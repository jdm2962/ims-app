import React from 'react';

import {TableData, TableButton, TableRow} from './tableComponents.js';





class Table extends React.Component{

	constructor(props){
		super(props);

		this.state = {

			// this is going to be an api call
			tableData : [],
		}
	}

	componentDidMount(){

		fetch('http://ec2-3-94-195-38.compute-1.amazonaws.com/api/items')
			.then(res => res.json())
			.then((result) => {
				
				const items = Object.values(result).map((item) => {
					return (
						<TableRow  key = {item.id}>
							<TableData data = {item.category} name = 'category'/>
							<TableData data = {item.name} name = 'name'/>
							<TableData data = {item.id} name = 'id'/>
							<TableData data = {item.singles} name = 'singles'/>
							<TableData data = {item.packages} name = 'packages'/>
							<TableData data = {item.quantityPerPackage} name = 'quantityPerPackage'/>
							<TableData data = {item.total} name = 'total'/>
							<td className = 'td'>
								<TableButton name = 'Edit'/>
								<TableButton name = 'Update' />
								<TableButton name = 'Delete' />
							</td>
						</TableRow>
					)
				});
				// console.log(items);

				this.setState({
					tableData : items
				})
			})
	}



	render(){

			// console.log(this.state.tableData);
		return(

			<table className = 'table'>
				<tbody className = 'tbody'>
					<tr className = 'tr'>
						<th className = 'th'>Category</th>
						<th className = 'th'>Name</th>
						<th className = 'th'>ID</th>
						<th className = 'th'>Singles</th>
						<th className = 'th'>Packages</th>
						<th className = 'th'>Quantity Per Package</th>
						<th className = 'th'>Total</th>
						<th className = 'th'>Operations</th>
					</tr>

					{this.state.tableData}

				</tbody>
			</table>
		);
	}
}

export default Table;