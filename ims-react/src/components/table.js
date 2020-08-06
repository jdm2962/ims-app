import React from 'react';


class Table extends React.Component{

	constructor(props){
		super(props);

		this.state = {

			// this is going to be an api call
			tableData : []
		}
	}

	componentDidMount(){

		fetch('ec2-54-90-134-15.compute-1.amazonaws.com/api/items', {
			mode : 'cors'
		})
		.then(res => res.json())
		.then((result) => {
			console.log(JSON.parse(result));
		})
		.catch((err) => {
			console.log(err);
		})
	}


	render(){
		
		const items = this.state.tableData.map((item) => {
			return (
				<tr className = 'tr'>
					<td className = 'td'>{item.category}</td>
					<td className = 'td'>{item.itemId}</td>
					<td className = 'td'>{item.name}</td>
				</tr>
			);
		});

		return(

			<table className = 'table'>
				<tbody className = 'tbody'>
					<tr className = 'td'>
						<th className = 'th'>Category</th>
						<th className = 'th'>ID</th>
						<th className = 'th'>Name</th>
					</tr>

				</tbody>
			</table>
		);
	}
}

export default Table;